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
					initial={
						shouldReduceMotion ? false : { opacity: 0, x: 35, rotate: 2 }
					}
					animate={{ opacity: 1, x: 0, rotate: 0 }}
					transition={{
						type: "tween",
						duration: shouldReduceMotion ? 0 : 0.24,
						ease: "easeOut",
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
