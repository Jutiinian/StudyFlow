import { useState } from "react";
import { createTask } from "../api/client";
import type { TaskCreate, TaskOut } from "../types/models";
import MotionButton from "./MotionButton";

interface TaskFormProps {
	onTaskCreated: (task: TaskOut) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
	const [title, setTitle] = useState("");
	const [due, setDue] = useState("");
	const [remainingText, setRemainingText] = useState("30");
	const [confidenceText, setConfidenceText] = useState("3");

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		if (isSubmitting) return;

		setSubmitError(null);

		const trimmedTitle = title.trim();
		if (!trimmedTitle) {
			setSubmitError("Enter a task title.");
			return;
		}

		setIsSubmitting(true);

		try {
			const newTask: TaskCreate = {
				title: trimmedTitle,
				due,
				remaining: Number(remainingText),
				confidence: Number(confidenceText),
			};

			const created = await createTask(newTask);
			onTaskCreated(created);

			setTitle("");
			setDue("");
			setRemainingText("30");
			setConfidenceText("3");
		} catch (error) {
			setSubmitError(
				error instanceof Error ? error.message : "Failed to add task",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<form className="task-form" onSubmit={handleSubmit}>
			<label className="field">
				<span>Task title</span>
				<input
					className="input"
					required
					disabled={isSubmitting}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="e.g. Read chapter 4"
				/>
			</label>

			<label className="field">
				<span>Due date</span>
				<input
					className="input"
					required
					disabled={isSubmitting}
					type="date"
					value={due}
					onChange={(e) => setDue(e.target.value)}
				/>
			</label>

			<label className="field">
				<span>Minutes remaining</span>
				<input
					className="input"
					required
					disabled={isSubmitting}
					type="number"
					min={0}
					step={1}
					value={remainingText}
					onChange={(e) => setRemainingText(e.target.value)}
				/>
			</label>

			<label className="field">
				<span>Confidence (1-5)</span>
				<input
					className="input"
					required
					disabled={isSubmitting}
					type="number"
					min={1}
					max={5}
					value={confidenceText}
					onChange={(e) => setConfidenceText(e.target.value)}
				/>
			</label>

			{submitError && (
				<p className="form-error" role="alert">
					{submitError}
				</p>
			)}

			<MotionButton
				className="button button--primary"
				type="submit"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Adding..." : "Add Task"}
			</MotionButton>
		</form>
	);
}
