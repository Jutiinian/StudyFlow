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
			<p className={styles.caption}>The target board</p>
			<h2 id="tasks-heading">
				Your tasks<span aria-hidden="true"> ↗</span>
			</h2>
			{isLoadingTasks ? (
				<p role="status">Loading tasks...</p>
			) : tasksError ? (
				<FormError>{tasksError} Reload the page to try again.</FormError>
			) : (
				<>
					<details className={styles.composer} open>
						<summary>
							Add a new target <span aria-hidden="true">＋</span>
						</summary>
						<div className={styles.formBody}>
							<TaskForm onTaskCreated={onTaskCreated} />
						</div>
					</details>
					<h3 className={styles.boardHeading}>
						On the board <span key={tasks.length}>{tasks.length}</span>
					</h3>
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
