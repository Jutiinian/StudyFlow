from fastapi import FastAPI
from pydantic import BaseModel
from datetime import date

from planner import Task, StudyBlock, allocate_round

# Create the application
app = FastAPI(title="LockIn")

# Connect URL to a function
@app.get("/api/health")
def health_check():
	return {"status": "ok"}

# --- API Boundary Models ---
# Same as Task dataclass
class TaskIn(BaseModel):
	title: str
	due: date
	remaining: int
	confidence: int

class PlanRequest(BaseModel):
	tasks: list[TaskIn]
	available_minutes: int

# Same as StudyBlock dataclass
class BlockOut(BaseModel):
	title: str
	minutes: int
	explanation: str

class PlanResponse(BaseModel):
	study_blocks: list[BlockOut]

# --- Conversion between API models and domain objects ---

def task_in_to_task(task_in: TaskIn) -> Task:
	return Task(
		title=task_in.title,
        due=task_in.due,
        remaining=task_in.remaining,
        confidence=task_in.confidence,
	)

def study_block_to_block_out(block: StudyBlock) -> BlockOut:
    return BlockOut(
        title=block.title,
        minutes=block.minutes,
        explanation=block.explanation,
    )

# --- Endpoint ---

@app.post("/api/plan", response_model=PlanResponse)
def create_plan(request: PlanRequest) -> PlanResponse:
    today_date = date.today()

    tasks: list[Task] = [task_in_to_task(t) for t in request.tasks]
    blocks: list[StudyBlock] = allocate_round(tasks, today_date, request.available_minutes)
    blocks_out: list[BlockOut] = [study_block_to_block_out(b) for b in blocks]

    return PlanResponse(study_blocks=blocks_out)

# Starting backend: python3 -m uvicorn api:app --reload --port 8001
