import { useState } from "react";

type HealthResponse = {
	status: string;
};

export default function DevelopmentDiagnostics() {
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
			setStatus("Unable to connect. Check that the Python server is running.");
		} finally {
			setChecking(false);
		}
	}

	return (
		<>
			{/* Limit item to development using Vite's data */}
			{import.meta.env.DEV && (
				<details className="dev-tools">
					<summary>Development diagnostics</summary>

					<button type="button" onClick={checkBackend} disabled={checking}>
						{checking ? "Checking..." : "Check backend"}
					</button>

					<p role="status">{status}</p>

					{/*<pre>{JSON.stringify(plan, null, 2)}</pre>*/}
				</details>
			)}
		</>
	);
}
