import { useId, useState } from "react";
import Field from "../../../shared/ui/Field";
import FormError from "../../../shared/ui/FormError";
import Input from "../../../shared/ui/Input";
import MotionButton from "../../../shared/ui/MotionButton";
import { createTask } from "../api";
import type { TaskCreate, TaskOut } from "../types";
import styles from "./TaskForm.module.css";

interface TaskFormProps {
	onTaskCreated: (task: TaskOut) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
	const fieldId = useId();
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
		<form className={styles.form} onSubmit={handleSubmit}>
			<Field htmlFor={`${fieldId}-title`}>
				<span>Task title</span>
				<Input
					id={`${fieldId}-title`}
					required
					disabled={isSubmitting}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="e.g. Read chapter 4"
				/>
			</Field>

			<Field htmlFor={`${fieldId}-due`}>
				<span>Due date</span>
				<Input
					id={`${fieldId}-due`}
					required
					disabled={isSubmitting}
					type="date"
					value={due}
					onChange={(e) => setDue(e.target.value)}
				/>
			</Field>

			<Field htmlFor={`${fieldId}-remaining`}>
				<span>Minutes remaining</span>
				<Input
					id={`${fieldId}-remaining`}
					required
					disabled={isSubmitting}
					type="number"
					min={0}
					step={1}
					value={remainingText}
					onChange={(e) => setRemainingText(e.target.value)}
				/>
			</Field>

			<Field htmlFor={`${fieldId}-confidence`}>
				<span>Confidence (1-5)</span>
				<Input
					id={`${fieldId}-confidence`}
					required
					disabled={isSubmitting}
					type="number"
					min={1}
					max={5}
					value={confidenceText}
					onChange={(e) => setConfidenceText(e.target.value)}
				/>
			</Field>

			{submitError && <FormError>{submitError}</FormError>}

			<MotionButton variant="primary" type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Adding..." : "Add Task"}
			</MotionButton>
		</form>
	);
}
