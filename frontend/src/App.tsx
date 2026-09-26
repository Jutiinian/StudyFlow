import { useEffect, useState } from "react";
import type { TaskOut } from "./types/models";
import { getTasks } from "./api/client";
import TaskList from "./components/TaskList";

type HealthResponse = {
	status: string;
}

export default function App() {
	const [status, setStatus] = useState("Unchecked");
	const [checking, setChecking] = useState(false);

	const [tasks, setTasks] = useState<TaskOut[]>([]);

	async function checkBackend(): Promise<void> {
		setChecking(true);
		setStatus("Connecting...");

		try {
			const response = await fetch("/api/health");

			if (!response.ok) {
				throw new Error("The server returned an error");
			}

			const data: HealthResponse = await response.json();
			setStatus(`Backend status: ${data.status}`);
		} catch {
			setStatus("Unable to connect. Check that the Python server is running.")
		} finally {
			setChecking(false);
		}
	}

	useEffect(() => {
		async function loadTasks() {
			const data = await getTasks()
			setTasks(data);
		}

		loadTasks()
	}, [])

	// Button click
 //    → fetch("/api/health")
 //    → Vite proxy
 //    → FastAPI functions
 //    → JSON response
 //    → React updates the displayed status
	return (
		<main>
			<h1>Lock IN</h1>
			<p>My next study session, planned.</p>

			<button onClick={checkBackend} disabled={checking}>
				{checking ? "Checking..." : "Check backend"}
			</button>

			<p role="status">{status}</p>

			<TaskList tasks={tasks}></TaskList>
		</main>
	)
}
