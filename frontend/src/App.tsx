import { useState } from "react";

type HealthResponse = {
	status: string;
}

export default function App() {
	const [status, setStatus] = useState("Unchecked");
	const [checking, setChecking] = useState(false);

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

	// Button click
 //    → fetch("/api/health")
 //    → Vite proxy
 //    → FastAPI function
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
		</main>
	)
}
