import { useRef, useState } from "react";
import { generatePlan } from "../api";
import type { PlanResponse } from "../types";

export function usePlan() {
	const [availableMinutesText, setAvailableMinutesText] = useState("60");
	const [plan, setPlan] = useState<PlanResponse | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [planError, setPlanError] = useState<string | null>(null);

	const planVersion = useRef(0);

	// Reject responses for a plan invalidated while the request was in flight.
	function invalidatePlan() {
		planVersion.current += 1;
		setPlan(null);
		setPlanError(null);
	}

	function changeAvailableMinutes(value: string) {
		setAvailableMinutesText(value);
		invalidatePlan();
	}

	async function generate() {
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

	return {
		availableMinutesText,
		plan,
		isGenerating,
		planError,
		invalidatePlan,
		changeAvailableMinutes,
		generate,
	};
}
