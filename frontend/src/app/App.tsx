import DashboardPage from "../pages/dashboard/DashboardPage";
import styles from "./App.module.css";

export default function App() {
	return (
		<main className={styles.shell}>
			<header className={styles.header}>
				<h1>Lock IN</h1>
				<p>My next study session, planned.</p>
			</header>
			<DashboardPage />
		</main>
	);
}
