import { useEffect, useState } from "react";
import { generatePlan, getTasks } from "./api/client";
import PlanView from "./components/PlanView";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import type { PlanResponse, TaskOut } from "./types/models";
import "./App.css";

export default function App() {
	const [tasks, setTasks] = useState<TaskOut[]>([]);
	const [isLoadingTasks, setIsLoadingTasks] = useState(true);
	const [tasksError, setTasksError] = useState<string | null>(null);

	const [availableMinutesText, setAvailableMinutesText] = useState("60");
	const [plan, setPlan] = useState<PlanResponse | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [planError, setPlanError] = useState<string | null>(null);

	useEffect(() => {
		let ignoreResult = false;

		async function loadTasks() {
			try {
				const data = await getTasks();

				if (!ignoreResult) {
					setTasks(data);
				}
			} catch (error) {
				if (!ignoreResult) {
					setTasksError(
						error instanceof Error ? error.message : "Failed to load tasks",
					);
				}
			} finally {
				if (!ignoreResult) {
					setIsLoadingTasks(false);
				}
			}
		}

		loadTasks();

		return () => {
			ignoreResult = true;
		};
	}, []);

	function handleTaskCreated(task: TaskOut) {
		// Make a new array, unpack all the elements in prev and add task into a new array
		setTasks((prev) => [...prev, task]);
	}

	function handleTaskUpdated(updated: TaskOut) {
		setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
	}

	function handleTaskDeleted(id: number) {
		setTasks((prev) => prev.filter((t) => t.id !== id));
	}

	async function handleGeneratePlan(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		if (isGenerating) return;

		setPlanError(null);
		setPlan(null);
		setIsGenerating(true);

		try {
			const result = await generatePlan(Number(availableMinutesText));
			setPlan(result);
		} catch (error) {
			setPlanError(
				error instanceof Error ? error.message : "Failed to generate plan",
			);
		} finally {
			setIsGenerating(false);
		}
	}

	return (
		<main className="app-shell">
			<header className="app-header">
				<h1>Lock IN</h1>
				<p>My next study session, planned.</p>
			</header>

			<div className="dashboard">
				<section className="panel" aria-labelledby="tasks-heading">
					<h2 id="tasks-heading">Your tasks</h2>

					{isLoadingTasks ? (
						<p role="status">Loading tasks...</p>
					) : tasksError ? (
						<p className="form-error" role="alert">
							{tasksError} Reload the page to try again.
						</p>
					) : (
						<>
							<TaskForm onTaskCreated={handleTaskCreated} />
							<TaskList
								tasks={tasks}
								onTaskUpdated={handleTaskUpdated}
								onTaskDeleted={handleTaskDeleted}
							/>
						</>
					)}
				</section>

				<section className="panel" aria-labelledby="session-heading">
					<h2 id="session-heading">Plan your session</h2>

					<form className="session-form" onSubmit={handleGeneratePlan}>
						<label className="field">
							<span>Available minutes</span>
							<input
								className="input"
								required
								disabled={isGenerating}
								type="number"
								min={1}
								step={1}
								value={availableMinutesText}
								onChange={(e) => setAvailableMinutesText(e.target.value)}
							/>
						</label>

						{planError && (
							<p className="form-error" role="alert">
								{planError}
							</p>
						)}

						<button
							className="button button--primary"
							type="submit"
							disabled={isGenerating}
						>
							{isGenerating ? "Generating..." : "Generate plan"}
						</button>
					</form>

					{plan && <PlanView blocks={plan.study_blocks} />}
				</section>
			</div>
		</main>
	);
}
