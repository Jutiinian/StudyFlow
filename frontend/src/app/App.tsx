import {
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
} from "motion/react";
import { type PointerEvent, useState } from "react";
import DashboardPage from "../pages/dashboard/DashboardPage";
import styles from "./App.module.css";

export default function App() {
	const reduceMotion = useReducedMotion();
	const [ambientPaused, setAmbientPaused] = useState(false);
	const ambientEnabled = !reduceMotion && !ambientPaused;
	const pointerX = useMotionValue(0);
	const pointerY = useMotionValue(0);
	const driftX = useSpring(pointerX, { stiffness: 60, damping: 22 });
	const driftY = useSpring(pointerY, { stiffness: 60, damping: 22 });

	function resetDrift() {
		pointerX.set(0);
		pointerY.set(0);
	}

	function followPointer(event: PointerEvent<HTMLElement>) {
		if (!ambientEnabled || event.pointerType !== "mouse") return;
		pointerX.set((event.clientX / window.innerWidth - 0.5) * 20);
		pointerY.set((event.clientY / window.innerHeight - 0.5) * 16);
	}

	return (
		<main
			className={styles.shell}
			data-motion={ambientEnabled ? "on" : "off"}
			onPointerMove={followPointer}
			onPointerLeave={resetDrift}
		>
			<div className={styles.ambience} aria-hidden="true" />
			<div className={styles.slash} aria-hidden="true" />
			<motion.div
				className={styles.fragments}
				aria-hidden="true"
				style={{
					x: ambientEnabled ? driftX : 0,
					y: ambientEnabled ? driftY : 0,
				}}
			>
				<i />
				<i />
				<i />
				<i />
				<i />
				<i />
			</motion.div>
			<header className={styles.header}>
				<div className={styles.topline}>
					<span>StudyFlow / Mission control</span>
					<span aria-hidden="true">★ TAKE YOUR TIME BACK</span>
				</div>
				<div className={styles.hero}>
					<div>
						<h1 aria-label="StudyFlow">
							<span className={styles.letters} aria-hidden="true">
								{"sTuDy".split("").map((letter, index) => (
									<span key={index}>{letter}</span>
								))}
							</span>
							<span className={styles.letters} aria-hidden="true">
								{"fLoW".split("").map((letter, index) => (
									<span key={index}>{letter}</span>
								))}
							</span>
						</h1>
					</div>
					<div className={styles.stamp} aria-hidden="true">
						TAKE YOUR
						<br />
						<span>TIME BACK. ↗</span>
					</div>
				</div>
			</header>
			<DashboardPage />
			<footer className={styles.footer}>
				<span>ONE TASK AT A TIME. MAKE IT COUNT. ★</span>
				<button
					className={styles.motionToggle}
					type="button"
					aria-pressed={ambientPaused || !!reduceMotion}
					disabled={!!reduceMotion}
					onClick={() => {
						resetDrift();
						setAmbientPaused(!ambientPaused);
					}}
				>
					{reduceMotion
						? "Background motion off · system preference"
						: ambientPaused
							? "Resume background motion"
							: "Pause background motion"}
				</button>
			</footer>
		</main>
	);
}
