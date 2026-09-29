import { useEffect, useState } from "react";
import { getTasks } from "../api";
import type { TaskOut } from "../types";

export function useTasks() {
	const [tasks, setTasks] = useState<TaskOut[]>([]);
	const [isLoadingTasks, setIsLoadingTasks] = useState(true);
	const [tasksError, setTasksError] = useState<string | null>(null);

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

	function addTask(task: TaskOut) {
		setTasks((prev) => [...prev, task]);
	}

	function replaceTask(updated: TaskOut) {
		setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
	}

	function removeTask(id: number) {
		setTasks((prev) => prev.filter((t) => t.id !== id));
	}

	return { tasks, isLoadingTasks, tasksError, addTask, replaceTask, removeTask };
}
