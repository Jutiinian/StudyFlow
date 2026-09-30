import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { useMeasuredHeight } from "../../../shared/hooks/useMeasuredHeight";
import Field from "../../../shared/ui/Field";
import FormError from "../../../shared/ui/FormError";
import Input from "../../../shared/ui/Input";
import MotionButton from "../../../shared/ui/MotionButton";
import Panel from "../../../shared/ui/Panel";
import type { usePlan } from "../hooks/usePlan";
import styles from "./PlanningPanel.module.css";
import PlanView from "./PlanView";

interface PlanningPanelProps {
	planning: ReturnType<typeof usePlan>;
}

export default function PlanningPanel({ planning }: PlanningPanelProps) {
	const fieldId = useId();
	const {
		availableMinutesText,
		plan,
		isGenerating,
		planError,
		changeAvailableMinutes,
		generate,
	} = planning;
	const shouldReduceMotion = useReducedMotion();
	const { ref: resultsRef, height: resultsHeight } = useMeasuredHeight();

	function handleGeneratePlan(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		void generate();
	}

	return (
		<Panel aria-labelledby="session-heading">
			<p className={styles.kicker}>02 / Your next move</p>
			<h2 id="session-heading" className={styles.title}>
				Plan your session
			</h2>

			<form className={styles.form} onSubmit={handleGeneratePlan}>
				<Field htmlFor={`${fieldId}-session-length`}>
					<span>Session length, including breaks</span>
					<Input
						id={`${fieldId}-session-length`}
						required
						disabled={isGenerating}
						type="number"
						min={1}
						max={1440}
						step={1}
						value={availableMinutesText}
						onChange={(e) => changeAvailableMinutes(e.target.value)}
					/>
				</Field>

				{planError && <FormError>{planError}</FormError>}

				<MotionButton variant="primary" type="submit" disabled={isGenerating}>
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
								<p className={styles.summary}>
									{plan.study_minutes} min study · {plan.break_minutes} min
									breaks
									{" · "}
									{plan.total_minutes} min total
								</p>

								{plan.unused_minutes > 0 && (
									<p className={styles.unused}>
										{plan.unused_minutes} minutes left unscheduled.
									</p>
								)}

								<PlanView blocks={plan.blocks} />
							</motion.div>
						) : (
							<div key="empty" className={styles.empty}>
								<span className={styles.emptyMark} aria-hidden="true">
									↗
								</span>
								<strong>A little structure. A lot more focus.</strong>
								<p>
									Choose your session length and turn your tasks into a plan.
								</p>
							</div>
						)}
					</AnimatePresence>
				</div>
			</motion.div>
		</Panel>
	);
}
