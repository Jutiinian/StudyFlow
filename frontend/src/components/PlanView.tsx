import type { BlockOut } from "../types/models";

interface PlanViewProps {
	blocks: BlockOut[];
}

export default function PlanView({ blocks }: PlanViewProps) {
	if (blocks.length === 0) {
		return (
			<p className="plan-empty">
				No study blocks to schedule. Add a task with time remaining.
			</p>
		);
	}

	return (
		<ol className="plan-view">
			{blocks.map((block) => (
				<li key={block.id} className="plan-block">
					<h3>{block.title}</h3>
					<p className="plan-block__duration">{block.minutes} minutes</p>
					<p className="plan-block__reason">{block.explanation}</p>
				</li>
			))}
		</ol>
	);
}
