import FormError from "../../../shared/ui/FormError";
import Panel from "../../../shared/ui/Panel";
import type { TaskOut } from "../types";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

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
			<h2 id="tasks-heading">Your tasks</h2>
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
