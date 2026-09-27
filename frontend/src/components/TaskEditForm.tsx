import { useState } from "react";
import { deleteTask, updateTask } from "../api/client";
import type { TaskOut } from "../types/models";

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
		<form className="task-card__form" onSubmit={handleSave}>
			<label className="field">
				<span>Minutes remaining</span>
				<input
					className="input"
					required
					disabled={isBusy}
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
					disabled={isBusy}
					type="number"
					min={1}
					max={5}
					step={1}
					value={confidenceText}
					onChange={(e) => setConfidenceText(e.target.value)}
				/>
			</label>

			{actionError && (
				<p className="form-error" role="alert">
					{actionError}
				</p>
			)}

			<div className="task-card__actions">
				<button
					className="button button--primary"
					type="submit"
					disabled={isBusy}
				>
					{pendingAction === "save" ? "Saving..." : "Save"}
				</button>

				<button
					className="button button--secondary"
					type="button"
					onClick={onCancel}
					disabled={isBusy}
				>
					Cancel
				</button>

				<button
					className="button button--secondary"
					type="button"
					onClick={handleDelete}
					disabled={isBusy}
				>
					{pendingAction === "delete" ? "Deleting..." : "Delete"}
				</button>
			</div>
		</form>
	);
}
