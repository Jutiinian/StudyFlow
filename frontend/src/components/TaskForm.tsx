import { useState } from "react";
import type { TaskCreate, TaskOut } from "../types/models";
import { createTask } from "../api/client";

interface TaskFormProps {
	onTaskCreated: (task: TaskOut) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
	const [title, setTitle] = useState("");
	const [due, setDue] = useState("");
	const [remaining, setRemaining] = useState(0);
	const [confidence, setConfidence] = useState(3);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		const newTask: TaskCreate = {
			title,
			due,
			remaining,
			confidence,
		}

		const created = await createTask(newTask);
		onTaskCreated(created);

		setTitle("");
		setDue("");
		setRemaining(0);
		setConfidence(3);
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				value={title}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
				placeholder="Task Title"
			/>

			<input
				type="date"
				value={due}
				// Provides ISO format already
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDue(e.target.value)}
			/>

			<input
				type="number"
				min={0}
				value={remaining}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemaining(Number(e.target.value))}
				placeholder="Minutes Remaining"
			/>

			<input
				type="number"
				min={1}
				max={5}
				value={confidence}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfidence(Number(e.target.value))}
				placeholder="Confidence (1-5)"
			/>

			<button type="submit">Add Task</button>
		</form>
	)
}
