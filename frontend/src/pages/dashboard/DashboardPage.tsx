import PlanningPanel from "../../features/planning/components/PlanningPanel";
import { usePlan } from "../../features/planning/hooks/usePlan";
import TasksPanel from "../../features/tasks/components/TasksPanel";
import { useTasks } from "../../features/tasks/hooks/useTasks";
import type { TaskOut } from "../../features/tasks/types";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
	const { tasks, isLoadingTasks, tasksError, addTask, replaceTask, removeTask } =
		useTasks();
	const planning = usePlan();

	// This page coordinates the two features; neither feature imports the other.
	function handleTaskCreated(task: TaskOut) {
		planning.invalidatePlan();
		addTask(task);
	}

	function handleTaskUpdated(task: TaskOut) {
		planning.invalidatePlan();
		replaceTask(task);
	}

	function handleTaskDeleted(id: number) {
		planning.invalidatePlan();
		removeTask(id);
	}

	return (
		<div className={styles.dashboard}>
			<TasksPanel
				tasks={tasks}
				isLoadingTasks={isLoadingTasks}
				tasksError={tasksError}
				onTaskCreated={handleTaskCreated}
				onTaskUpdated={handleTaskUpdated}
				onTaskDeleted={handleTaskDeleted}
			/>
			<PlanningPanel planning={planning} />
		</div>
	);
}
