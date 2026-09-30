import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import styles from "./MotionButton.module.css";

type MotionButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
	children?: ReactNode;
	variant?: "primary" | "secondary";
};

export default function MotionButton({
	children,
	className,
	variant = "primary",
	disabled,
	...props
}: MotionButtonProps) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.button
			{...props}
			className={[styles.button, styles[variant], className]
				.filter(Boolean)
				.join(" ")}
			disabled={disabled}
			whileHover={
				disabled
					? undefined
					: {
							...(shouldReduceMotion
								? {}
								: { x: -7, y: -4, rotate: -3, scale: 1.03 }),
						}
			}
			whileTap={
				disabled || shouldReduceMotion
					? undefined
					: { scale: 0.96, x: 3, y: 3, rotate: 2 }
			}
			transition={{ duration: shouldReduceMotion ? 0 : 0.065 }}
		>
			{children}
			<span className={styles.spark} aria-hidden="true" />
		</motion.button>
	);
}
