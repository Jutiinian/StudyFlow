import type { ComponentProps } from "react";
import styles from "./Panel.module.css";

export default function Panel({
	className,
	...props
}: ComponentProps<"section">) {
	return (
		<section
			{...props}
			className={[styles.panel, className].filter(Boolean).join(" ")}
		/>
	);
}
