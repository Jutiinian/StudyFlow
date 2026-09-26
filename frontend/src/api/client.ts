import type { PlanResponse, TaskCreate, TaskOut, TaskUpdate } from "../types/models";

// Function will never return normally, always throws
async function throwForBadResponse(response: Response): Promise<never> {
	let detail: string;

	try {
		const body = await response.json();
		detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
	} catch {
		detail = response.statusText;
	}

	throw new Error(`Request failed (${response.status}): ${detail}`);
}

export async function getTasks(): Promise<TaskOut[]> {
	const response = await fetch("/api/tasks");
	if (!response.ok) {
		await throwForBadResponse(response);
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
		await throwForBadResponse(response);
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
		await throwForBadResponse(response);
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
		await throwForBadResponse(response);
	}

	return (await response.json()) as PlanResponse;
}
