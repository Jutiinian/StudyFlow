import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react";
import styles from "./MotionButton.module.css";

type MotionButtonProps = HTMLMotionProps<"button"> & {
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
				disabled ? undefined : { backgroundColor: "var(--button-hover)" }
			}
			whileTap={disabled || shouldReduceMotion ? undefined : { scale: 0.98 }}
			transition={{ duration: shouldReduceMotion ? 0 : 0.12 }}
		>
			{children}
		</motion.button>
	);
}
