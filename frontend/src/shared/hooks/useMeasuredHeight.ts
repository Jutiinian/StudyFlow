import { useLayoutEffect, useRef, useState } from "react";

export function useMeasuredHeight() {
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState<number | null>(null);

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;

		const observer = new ResizeObserver(([entry]) => {
			setHeight(entry.contentRect.height);
		});

		observer.observe(element);

		return () => observer.disconnect();
	}, []);

	return { ref, height };
}
