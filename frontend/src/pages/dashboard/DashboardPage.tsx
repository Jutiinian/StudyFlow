import { useState } from "react";
import PlanningPanel from "../../features/planning/components/PlanningPanel";
import { usePlan } from "../../features/planning/hooks/usePlan";
import TasksPanel from "../../features/tasks/components/TasksPanel";
import { useTasks } from "../../features/tasks/hooks/useTasks";
import type { TaskOut } from "../../features/tasks/types";
import PersonaMenu from "../../shared/ui/PersonaMenu/PersonaMenu";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
	const {
		tasks,
		isLoadingTasks,
		tasksError,
		addTask,
		replaceTask,
		removeTask,
	} = useTasks();
	const planning = usePlan();
	const [activeView, setActiveView] = useState<"tasks" | "session">("tasks");
	const minutesRemaining = tasks.reduce(
		(total, task) => total + task.remaining,
		0,
	);

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
			<aside className={styles.command}>
				<PersonaMenu
					activeId={activeView}
					items={[
						{
							id: "tasks",
							label: "Your tasks",
							description:
								"Choose your targets. Add, edit, and track the work ahead.",
						},
						{
							id: "session",
							label: "Session plan",
							description:
								"Turn your available time into a focused study session.",
						},
						{
							id: "resume",
							label: "Keep going",
							description:
								"Return to your current workspace. Make your next move.",
						},
					]}
					onSelect={(id) => {
						if (id === "tasks" || id === "session") setActiveView(id);
					}}
				/>
				<p className={styles.kicker}>Your time. Your rules.</p>
				<p className={styles.headline}>
					MAKE
					<br />
					<span>YOUR</span>
					<br />
					MOVE<span className={styles.mark}>!</span>
				</p>
				<nav className={styles.menu} aria-label="Study workspace">
					<button
						type="button"
						aria-pressed={activeView === "tasks"}
						aria-controls="task-workspace"
						onClick={() => setActiveView("tasks")}
					>
						<span>01</span> YOUR TASKS <b aria-hidden="true">↗</b>
					</button>
					<button
						type="button"
						aria-pressed={activeView === "session"}
						aria-controls="session-workspace"
						onClick={() => setActiveView("session")}
					>
						<span>02</span> SESSION PLAN <b aria-hidden="true">↗</b>
					</button>
				</nav>
				<p key={activeView} className={styles.hint}>
					{activeView === "tasks"
						? "Pick your targets. Then make a plan."
						: "Choose your time. We’ll build the route."}
				</p>
				<div className={styles.stats} aria-label="Task overview">
					<p>
						<strong key={`tasks-${isLoadingTasks}-${tasks.length}`}>
							{isLoadingTasks || tasksError ? "—" : tasks.length}
						</strong>
						<span>tasks on file</span>
					</p>
					<p>
						<strong key={`minutes-${isLoadingTasks}-${minutesRemaining}`}>
							{isLoadingTasks || tasksError ? "—" : minutesRemaining}
						</strong>
						<span>minutes remaining</span>
					</p>
				</div>
				<span className={styles.burst} aria-hidden="true">
					★
				</span>
			</aside>
			<div className={styles.stage} data-view={activeView}>
				<div key={activeView} className={styles.cut} aria-hidden="true" />
				<div
					key={`${activeView}-label`}
					className={styles.stageLabel}
					aria-hidden="true"
				>
					<span>
						{activeView === "tasks" ? "01 / TARGET FILE" : "02 / ACTION PLAN"}
					</span>
					<span>STUDYFLOW ★</span>
				</div>
				<div
					id="task-workspace"
					hidden={activeView !== "tasks"}
					className={styles.workspace}
				>
					<TasksPanel
						tasks={tasks}
						isLoadingTasks={isLoadingTasks}
						tasksError={tasksError}
						onTaskCreated={handleTaskCreated}
						onTaskUpdated={handleTaskUpdated}
						onTaskDeleted={handleTaskDeleted}
					/>
				</div>
				<div
					id="session-workspace"
					hidden={activeView !== "session"}
					className={styles.workspace}
				>
					<PlanningPanel planning={planning} />
				</div>
			</div>
		</div>
	);
}
