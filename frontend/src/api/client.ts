import type { PlanResponse, TaskCreate, TaskOut, TaskUpdate } from "../types/models";

export async function getTasks(): Promise<TaskOut[]> {
	const response = await fetch("/api/tasks");
	if (!response.ok) {
		throw new Error("...");
	}
	return (await response.json()) as TaskOut[];
}

export async function createTask(task: TaskCreate): Promise<TaskOut> {
	const response = await fetch("/api/tasks", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(task),
	});

	if (!response.ok) {
		throw new Error("...");
	}

	return (await response.json()) as TaskOut;
}

export async function updateTask(id: number, update: TaskUpdate): Promise<TaskOut> {
	const response = await fetch(`/api/tasks/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(update),
	});

	if (!response.ok) {
		throw new Error("...");
	}

	return (await response.json()) as TaskOut;
}

export async function generatePlan(availableMinutes: number): Promise<PlanResponse> {
	const response = await fetch("/api/plan", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ available_minutes: availableMinutes }),
	});

	if (!response.ok) {
		throw new Error("...");
	}

	return (await response.json()) as PlanResponse;
}
