import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { generatePlan, getTasks } from "./api/client";
import MotionButton from "./components/MotionButton";
import PlanView from "./components/PlanView";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { useMeasuredHeight } from "./hooks/useMeasuredHeight";
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

	const planVersion = useRef(0);

	const shouldReduceMotion = useReducedMotion();
	const { ref: resultsRef, height: resultsHeight } = useMeasuredHeight();

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

	function invalidatePlan() {
		planVersion.current += 1;
		setPlan(null);
		setPlanError(null);
	}

	function handleTaskCreated(task: TaskOut) {
		invalidatePlan();
		// Make a new array, unpack all the elements in prev and add task into a new array
		setTasks((prev) => [...prev, task]);
	}

	function handleTaskUpdated(updated: TaskOut) {
		invalidatePlan();
		setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
	}

	function handleTaskDeleted(id: number) {
		invalidatePlan();
		setTasks((prev) => prev.filter((t) => t.id !== id));
	}

	async function handleGeneratePlan(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		if (isGenerating) return;

		setPlanError(null);
		setPlan(null);
		setIsGenerating(true);

		const requestVersion = planVersion.current;

		try {
			const result = await generatePlan(Number(availableMinutesText));
			if (requestVersion === planVersion.current) {
				setPlan(result);
			}
		} catch (error) {
			if (requestVersion === planVersion.current) {
				setPlanError(
					error instanceof Error ? error.message : "Failed to generate plan",
				);
			}
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
							<span>Session length, including breaks</span>
							<input
								className="input"
								required
								disabled={isGenerating}
								type="number"
								min={1}
								max={1440}
								step={1}
								value={availableMinutesText}
								onChange={(e) => {
									setAvailableMinutesText(e.target.value);
									invalidatePlan();
								}}
							/>
						</label>

						{planError && (
							<p className="form-error" role="alert">
								{planError}
							</p>
						)}

						<MotionButton
							className="button button--primary"
							type="submit"
							disabled={isGenerating}
						>
							{isGenerating ? "Generating..." : "Generate plan"}
						</MotionButton>
					</form>

					<motion.div
						initial={false}
						animate={{ height: resultsHeight ?? "auto" }}
						transition={{
							duration: shouldReduceMotion ? 0 : 0.25,
							ease: "easeOut",
						}}
						style={{ overflow: "hidden" }}
					>
						<div
							ref={resultsRef}
							style={{ display: "flow-root" }}
							aria-busy={isGenerating}
						>
							<AnimatePresence initial={false} mode="wait">
								{isGenerating ? (
									<motion.p
										key="loading"
										role="status"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: shouldReduceMotion ? 0 : 0.12 }}
									>
										Building your study session…
									</motion.p>
								) : plan ? (
									<motion.div
										key="results"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: shouldReduceMotion ? 0 : 0.12 }}
										style={{ display: "flow-root" }}
									>
										<p className="plan-summary">
											{plan.study_minutes} min study · {plan.break_minutes} min
											breaks
											{" · "}
											{plan.total_minutes} min total
										</p>

										{plan.unused_minutes > 0 && (
											<p className="plan-unused">
												{plan.unused_minutes} minutes left unscheduled.
											</p>
										)}

										<PlanView blocks={plan.blocks} />
									</motion.div>
								) : null}
							</AnimatePresence>
						</div>
					</motion.div>
				</section>
			</div>
		</main>
	);
}
