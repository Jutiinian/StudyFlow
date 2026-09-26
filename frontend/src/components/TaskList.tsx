import type { TaskOut } from "../types/models";

interface TaskListProps {
	tasks: TaskOut[]
}

export default function TaskList({ tasks }: TaskListProps) {

	{/*<ul>
		{tasks.map((task) => (
			<li key={task.id}>
				{task.title} -- due {task.due} -- {task.remaining} min left -- confidence {task.confidence}
			</li>
			))}
	</ul>*/}

	return (
		<div className="task-list">
			{tasks.map((task) => (
				<div key={task.id} className="task-card">
					<h3>{task.title}</h3>
					<p>Due: {task.due}</p>
					<p>Remaining: {task.remaining}</p>
					<p>Confidence: {task.confidence}/5</p>
				</div>
			))}
		</div>
	)
}
