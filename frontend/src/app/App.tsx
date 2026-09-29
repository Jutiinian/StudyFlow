import DashboardPage from "../pages/dashboard/DashboardPage";
import styles from "./App.module.css";

export default function App() {
	return (
		<main className={styles.shell}>
			<header className={styles.header}>
				<h1>StudyFlow</h1>
				<p>The next study session, planned.</p>
			</header>
			<DashboardPage />
		</main>
	);
}
