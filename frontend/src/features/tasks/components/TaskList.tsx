import { AnimatePresence } from "motion/react";
import type { TaskOut } from "../types";
import TaskCard from "./TaskCard";
import styles from "./TaskList.module.css";

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
			{tasks.length === 0 && (
				<p className={styles.empty}>
					<strong>Your next move starts here.</strong>
					<br />
					Add a task above to put it on the board.
				</p>
			)}
			{/* biome-ignore lint/a11y/noRedundantRoles: keeping here in case of Safari not exposing list to assistive technology */}
			<ul className={styles.list} role="list">
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
