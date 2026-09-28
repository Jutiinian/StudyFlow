import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react";

export default function MotionButton({
	children,
	disabled,
	...props
}: HTMLMotionProps<"button">) {
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.button
			{...props}
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
