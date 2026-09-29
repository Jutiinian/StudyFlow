import { throwForBadResponse } from "../../shared/api/http";
import type { PlanResponse } from "./types";

export async function generatePlan(
	availableMinutes: number,
): Promise<PlanResponse> {
	const response = await fetch("/api/plan", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ available_minutes: availableMinutes }),
	});

	if (!response.ok) {
		await throwForBadResponse(response);
	}

	return (await response.json()) as PlanResponse;
}
