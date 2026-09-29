import type { ComponentProps } from "react";
import styles from "./Input.module.css";

export default function Input({
	className,
	...props
}: ComponentProps<"input">) {
	return (
		<input
			{...props}
			className={[styles.input, className].filter(Boolean).join(" ")}
		/>
	);
}
