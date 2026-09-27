import { useState } from "react";
import type { TaskOut } from "../types/models";
import TaskEditForm from "./TaskEditForm";

interface TaskCardProps {
	task: TaskOut;
	onTaskUpdated: (task: TaskOut) => void;
	onTaskDeleted: (id: number) => void;
}

export default function TaskCard({
	task,
	onTaskUpdated,
	onTaskDeleted,
}: TaskCardProps) {
	const [isEditing, setIsEditing] = useState(false);

	function startEditing() {
		setIsEditing(true);
	}

	return (
		<li className="task-card">
			<h3>{task.title}</h3>
			<p>Due: {task.due}</p>

			{isEditing ? (
				<TaskEditForm
					task={task}
					onSaved={(updated) => {
						onTaskUpdated(updated);
						setIsEditing(false);
					}}
					onCancel={() => setIsEditing(false)}
					onDeleted={onTaskDeleted}
				/>
			) : (
				<>
					<p>Remaining: {task.remaining} min</p>
					<p>Confidence: {task.confidence}/5</p>

					<button
						className="button button--secondary task-card__edit"
						type="button"
						onClick={startEditing}
					>
						Edit
					</button>
				</>
			)}
		</li>
	);
}
