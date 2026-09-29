import type { TaskCreate, TaskOut, TaskUpdate } from "./types";
import { throwForBadResponse } from "../../shared/api/http";

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

export async function updateTask(
	id: number,
	update: TaskUpdate,
): Promise<TaskOut> {
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

export async function deleteTask(id: number): Promise<void> {
	const response = await fetch(`/api/tasks/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		await throwForBadResponse(response);
	}
}
