import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useMeasuredHeight } from "../hooks/useMeasuredHeight";
import type { TaskOut } from "../types/models";
import MotionButton from "./MotionButton";
import TaskEditForm from "./TaskEditForm";

interface TaskCardProps {
	task: TaskOut;
	onTaskUpdated: (task: TaskOut) => void;
	onTaskDeleted: (id: number) => void;
}

export default function TaskCard({
	task,
	onTaskUpdated,
	onTaskDeleted,
}: TaskCardProps) {
	const shouldReduceMotion = useReducedMotion();
	const { ref, height } = useMeasuredHeight();
	const [isEditing, setIsEditing] = useState(false);

	function startEditing() {
		setIsEditing(true);
	}

	return (
		<motion.li
			initial={shouldReduceMotion ? false : { opacity: 0, height: 0, y: 8, paddingBottom: 0 }}
			animate={{ opacity: 1, height: "auto", y: 0, paddingBottom: 12 }}
			exit={{ opacity: 0, height: 0, y: shouldReduceMotion ? 0 : -4, paddingBottom: 0 }}
			transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
			style={{ overflow: "hidden" }}
		>
			<div className="task-card">
				<motion.div
					initial={false}
					animate={{ height: height ?? "auto" }}
					transition={
						shouldReduceMotion
							? { type: "tween", duration: 0 }
							: { type: "spring", stiffness: 800, damping: 45 }
					}
				>
					<div ref={ref} className="task-card__content">
						<h3>{task.title}</h3>
						<p>Due: {task.due}</p>

						<AnimatePresence initial={false} mode="wait">
							<motion.div
								key={isEditing ? "edit" : "view"}
								className="task-card__body"
								initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
								transition={{ duration: shouldReduceMotion ? 0 : 0.1 }}
							>
								{isEditing ? (
									<TaskEditForm
										task={task}
										onSaved={(updated) => {
											onTaskUpdated(updated);
											setIsEditing(false);
										}}
										onCancel={() => setIsEditing(false)}
										onDeleted={onTaskDeleted}
									/>
								) : (
									<>
										<p>Remaining: {task.remaining} min</p>
										<p>Confidence: {task.confidence}/5</p>

										<MotionButton
											className="button button--secondary task-card__edit"
											type="button"
											onClick={startEditing}
										>
											Edit
										</MotionButton>
									</>
								)}
							</motion.div>
						</AnimatePresence>
					</div>
				</motion.div>
			</div>
		</motion.li>
	);
}
