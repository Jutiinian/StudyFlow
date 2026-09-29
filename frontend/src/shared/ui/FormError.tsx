import type { ComponentProps } from "react";
import styles from "./FormError.module.css";

export default function FormError({
	className,
	...props
}: ComponentProps<"p">) {
	return (
		<p
			role="alert"
			{...props}
			className={[styles.error, className].filter(Boolean).join(" ")}
		/>
	);
}
