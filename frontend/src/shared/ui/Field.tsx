import type { ComponentProps, ReactNode } from "react";
import styles from "./Field.module.css";

type FieldProps = ComponentProps<"label"> & {
	htmlFor: string;
	children: ReactNode;
};

export default function Field({
	className,
	htmlFor,
	children,
	...props
}: FieldProps) {
	return (
		<label
			{...props}
			htmlFor={htmlFor}
			className={[styles.field, className].filter(Boolean).join(" ")}
		>
			{children}
		</label>
	);
}
