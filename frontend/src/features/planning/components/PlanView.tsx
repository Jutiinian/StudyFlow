import { motion, useReducedMotion } from "motion/react";
import type { BlockOut } from "../types";
import styles from "./PlanView.module.css";

interface PlanViewProps {
	blocks: BlockOut[];
}

export default function PlanView({ blocks }: PlanViewProps) {
	const shouldReduceMotion = useReducedMotion();

	if (blocks.length === 0) {
		return (
			<p className={styles.empty}>
				No study blocks to schedule. Add a task with time remaining.
			</p>
		);
	}

	return (
		<ol className={styles.list}>
			{blocks.map((block, index) => (
				<motion.li
					key={block.id}
					className={
						block.kind === "break"
							? `${styles.block} ${styles.breakBlock}`
							: styles.block
					}
					initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						type: "spring",
						stiffness: 400,
						damping: 25,
						delay: shouldReduceMotion ? 0 : Math.min(index * 0.04, 0.2),
					}}
				>
					<h3>{block.title}</h3>
					<p className={styles.duration}>{block.minutes} minutes</p>
					<p className={styles.reason}>{block.explanation}</p>
				</motion.li>
			))}
		</ol>
	);
}
