from contextlib import asynccontextmanager
from datetime import date
from typing import Literal
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from db import create_task, delete_task, get_all_tasks, init_db, update_task
from planner import ScheduleBlock, Task, allocate_plan


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs before application starts taking requests
    init_db()
    yield
    # Runs after the application handles finishing requests, right before shutdown


# Create the application
app = FastAPI(title="LockIn", lifespan=lifespan)


# Connect URL to a function
@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# --- API Boundary Models ---
class PlanRequest(BaseModel):
    available_minutes: int = Field(strict=True, ge=1, le=1440)


class BlockOut(BaseModel):
    kind: Literal["study", "break"]
    task_id: int | None
    id: str
    title: str
    minutes: int
    explanation: str


class PlanResponse(BaseModel):
    blocks: list[BlockOut]
    study_minutes: int
    break_minutes: int
    total_minutes: int
    unused_minutes: int


def task_db_to_task(task_db: tuple) -> Task:
    return Task(
        id=task_db[0],
        title=task_db[1],
        due=date.fromisoformat(task_db[2]),  # Convert back from string
        remaining=task_db[3],
        confidence=task_db[4],
    )


def block_to_block_out(block: ScheduleBlock) -> BlockOut:
    return BlockOut(
        id=str(uuid4()),
        kind=block.kind,
        task_id=block.task_id,
        title=block.title,
        minutes=block.minutes,
        explanation=block.explanation,
    )


@app.post("/api/plan", response_model=PlanResponse)
def create_plan(request: PlanRequest) -> PlanResponse:
    today_date = date.today()

    tasks: list[Task] = [task_db_to_task(t) for t in get_all_tasks()]
    blocks: list[ScheduleBlock] = allocate_plan(
        tasks, today_date, request.available_minutes
    )
    blocks_out: list[BlockOut] = [block_to_block_out(block) for block in blocks]

    study_minutes = sum(block.minutes for block in blocks if block.kind == "study")
    break_minutes = sum(block.minutes for block in blocks if block.kind == "break")
    total_minutes = study_minutes + break_minutes

    return PlanResponse(
        blocks=blocks_out,
        study_minutes=study_minutes,
        break_minutes=break_minutes,
        total_minutes=total_minutes,
        unused_minutes=request.available_minutes - total_minutes,
    )


# --- TASK CRUD models ---
class TaskCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=200)
    due: date
    remaining: int = Field(strict=True, ge=0)
    confidence: int = Field(strict=True, ge=1, le=5)


class TaskUpdate(BaseModel):
    remaining: int = Field(strict=True, ge=0)
    confidence: int = Field(strict=True, ge=1, le=5)


class TaskOut(BaseModel):
    id: int
    title: str
    due: date
    remaining: int
    confidence: int


def row_to_task_out(row: tuple) -> TaskOut:
    # row shape form db.py (id, title, due, remaining, confidence)
    return TaskOut(
        id=row[0],
        title=row[1],
        due=row[2],
        remaining=row[3],
        confidence=row[4],
    )


@app.post("/api/tasks", response_model=TaskOut)
def create_task_endpoint(task: TaskCreate) -> TaskOut:
    new_id = create_task(
        title=task.title,
        due=task.due.isoformat(),
        remaining=task.remaining,
        confidence=task.confidence,
    )

    return TaskOut(
        id=new_id,
        title=task.title,
        due=task.due,
        remaining=task.remaining,
        confidence=task.confidence,
    )


@app.get("/api/tasks", response_model=list[TaskOut])
def list_tasks_endpoint() -> list[TaskOut]:
    rows = get_all_tasks()
    return [row_to_task_out(row) for row in rows]


@app.patch("/api/tasks/{task_id}", response_model=TaskOut)
def update_task_endpoint(task_id: int, task: TaskUpdate) -> TaskOut:
    updated = update_task(task_id, task.remaining, task.confidence)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")

    rows = get_all_tasks()
    for row in rows:
        if row[0] == task_id:
            return row_to_task_out(row)

    raise HTTPException(status_code=500, detail="Task updated but could not be re-read")


@app.delete("/api/tasks/{task_id}")
def delete_task_endpoint(task_id: int):
    deleted = delete_task(task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"deleted": True}


# Starting backend: python3 -m uvicorn api:app --reload --port 8001
