import FormError from "../../../shared/ui/FormError";
import Panel from "../../../shared/ui/Panel";
import type { TaskOut } from "../types";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

import styles from "./TasksPanel.module.css";

interface TasksPanelProps {
	tasks: TaskOut[];
	isLoadingTasks: boolean;
	tasksError: string | null;
	onTaskCreated: (task: TaskOut) => void;
	onTaskUpdated: (task: TaskOut) => void;
	onTaskDeleted: (id: number) => void;
}

export default function TasksPanel({
	tasks,
	isLoadingTasks,
	tasksError,
	onTaskCreated,
	onTaskUpdated,
	onTaskDeleted,
}: TasksPanelProps) {
	return (
		<Panel aria-labelledby="tasks-heading">
			<div className={styles.heading}>
				<div>
					<p className={styles.kicker}>01 / The backlog</p>
					<h2 id="tasks-heading" className={styles.title}>
						Your tasks
					</h2>
				</div>
				{!isLoadingTasks && !tasksError && (
					<span className={styles.count}>
						{tasks.length} {tasks.length === 1 ? "task" : "tasks"}
					</span>
				)}
			</div>
			{isLoadingTasks ? (
				<p role="status">Loading tasks...</p>
			) : tasksError ? (
				<FormError>{tasksError} Reload the page to try again.</FormError>
			) : (
				<>
					<TaskForm onTaskCreated={onTaskCreated} />
					<TaskList
						tasks={tasks}
						onTaskUpdated={onTaskUpdated}
						onTaskDeleted={onTaskDeleted}
					/>
				</>
			)}
		</Panel>
	);
}
