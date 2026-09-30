import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useMeasuredHeight } from "../../../shared/hooks/useMeasuredHeight";
import MotionButton from "../../../shared/ui/MotionButton";
import type { TaskOut } from "../types";
import styles from "./TaskCard.module.css";
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
			initial={
				shouldReduceMotion
					? false
					: { opacity: 0, height: 0, x: -65, y: 0, paddingBottom: 0 }
			}
			animate={{ opacity: 1, height: "auto", x: 0, y: 0, paddingBottom: 12 }}
			exit={{
				opacity: 0,
				height: 0,
				x: shouldReduceMotion ? 0 : 35,
				y: 0,
				paddingBottom: 0,
			}}
			transition={{ duration: shouldReduceMotion ? 0 : 0.14, ease: "easeOut" }}
			style={{ overflow: "hidden" }}
		>
			<div className={styles.card}>
				<motion.div
					initial={false}
					animate={{ height: height ?? "auto" }}
					transition={
						shouldReduceMotion
							? { type: "tween", duration: 0 }
							: { type: "spring", stiffness: 800, damping: 45 }
					}
				>
					<div ref={ref} className={styles.content}>
						<h3 className={styles.title}>{task.title}</h3>
						<p className={styles.meta}>
							<span className={styles.metaLabel}>Deadline</span> {task.due}
						</p>

						<AnimatePresence initial={false} mode="wait">
							<motion.div
								key={isEditing ? "edit" : "view"}
								className={styles.body}
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
										<p className={styles.meta}>
											<span className={styles.metaLabel}>Time left</span>{" "}
											{task.remaining} min
										</p>
										<p className={styles.meta}>
											<span className={styles.metaLabel}>Confidence</span>{" "}
											{task.confidence}/5
										</p>

										<MotionButton
											variant="secondary"
											className={styles.edit}
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
