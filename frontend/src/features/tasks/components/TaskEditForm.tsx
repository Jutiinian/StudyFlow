import { useId, useState } from "react";
import Field from "../../../shared/ui/Field";
import FormError from "../../../shared/ui/FormError";
import Input from "../../../shared/ui/Input";
import MotionButton from "../../../shared/ui/MotionButton";
import { deleteTask, updateTask } from "../api";
import type { TaskOut } from "../types";
import styles from "./TaskEditForm.module.css";

interface TaskEditFormProps {
	task: TaskOut;
	onSaved: (task: TaskOut) => void;
	onDeleted: (id: number) => void;
	onCancel: () => void;
}

export default function TaskEditForm({
	task,
	onSaved,
	onDeleted,
	onCancel,
}: TaskEditFormProps) {
	const fieldId = useId();
	const [remainingText, setRemainingText] = useState(String(task.remaining));
	const [confidenceText, setConfidenceText] = useState(String(task.confidence));

	const [pendingAction, setPendingAction] = useState<"save" | "delete" | null>(
		null,
	);
	const [actionError, setActionError] = useState<string | null>(null);

	const isBusy = pendingAction !== null;

	async function handleSave(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		if (isBusy) return;

		setActionError(null);
		setPendingAction("save");

		const remaining = Number(remainingText);
		const confidence = Number(confidenceText);

		try {
			const updated = await updateTask(task.id, { remaining, confidence });
			onSaved(updated);
		} catch (error) {
			setActionError(
				error instanceof Error ? error.message : "Failed to update task",
			);
		} finally {
			setPendingAction(null);
		}
	}

	async function handleDelete() {
		if (isBusy) return;

		setActionError(null);
		setPendingAction("delete");

		try {
			await deleteTask(task.id);
			onDeleted(task.id);
		} catch (error) {
			setActionError(
				error instanceof Error ? error.message : "Failed to delete task",
			);
		} finally {
			setPendingAction(null);
		}
	}

	return (
		<form className={styles.form} onSubmit={handleSave}>
			<Field htmlFor={`${fieldId}-remaining`}>
				<span>Minutes remaining</span>
				<Input
					id={`${fieldId}-remaining`}
					required
					disabled={isBusy}
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
					disabled={isBusy}
					type="number"
					min={1}
					max={5}
					step={1}
					value={confidenceText}
					onChange={(e) => setConfidenceText(e.target.value)}
				/>
			</Field>

			{actionError && (
				<FormError className={styles.error}>{actionError}</FormError>
			)}

			<div className={styles.actions}>
				<MotionButton variant="primary" type="submit" disabled={isBusy}>
					{pendingAction === "save" ? "Saving..." : "Save"}
				</MotionButton>

				<MotionButton
					variant="secondary"
					type="button"
					onClick={onCancel}
					disabled={isBusy}
				>
					Cancel
				</MotionButton>

				<MotionButton
					variant="secondary"
					type="button"
					onClick={handleDelete}
					disabled={isBusy}
				>
					{pendingAction === "delete" ? "Deleting..." : "Delete"}
				</MotionButton>
			</div>
		</form>
	);
}
