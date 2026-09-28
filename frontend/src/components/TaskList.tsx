import { AnimatePresence } from "motion/react";
import type { TaskOut } from "../types/models";
import TaskCard from "./TaskCard";

interface TaskListProps {
	tasks: TaskOut[];
	onTaskUpdated: (task: TaskOut) => void;
	onTaskDeleted: (id: number) => void;
}

export default function TaskList({
	tasks,
	onTaskUpdated,
	onTaskDeleted,
}: TaskListProps) {
	return (
		<>
			{tasks.length === 0 && <p>No tasks yet. Add one above to get started.</p>}
			{/* biome-ignore lint/a11y/noRedundantRoles: keeping here in case of Safari not exposing list to assistive technology */}
			<ul className="task-list" role="list">
				<AnimatePresence initial={false}>
					{tasks.map((task) => (
						<TaskCard
							key={task.id}
							task={task}
							onTaskUpdated={onTaskUpdated}
							onTaskDeleted={onTaskDeleted}
						/>
					))}
				</AnimatePresence>
			</ul>
		</>
	);
}
