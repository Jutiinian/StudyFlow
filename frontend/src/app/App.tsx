import DashboardPage from "../pages/dashboard/DashboardPage";
import styles from "./App.module.css";

export default function App() {
	return (
		<main className={styles.shell}>
			<header className={styles.header}>
<<<<<<< HEAD
				<h1>StudyFlow</h1>
				<p>The next study session, planned.</p>
=======
				<div>
					<p className={styles.eyebrow}>Less overthinking. More doing.</p>
					<h1 className={styles.title}>
						Study <span>FLOW</span>
					</h1>
					<p className={styles.subtitle}>
						Your next study session, with a game plan.
					</p>
				</div>
				<aside className={styles.note} aria-label="A little encouragement">
					<strong>Small sessions. Big moves.</strong>
					<p>Pick your time. Find your focus.</p>
				</aside>
>>>>>>> feat/dashboard-redesign
			</header>
			<DashboardPage />
		</main>
	);
}
