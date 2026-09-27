import type { BlockOut } from "../types/models";

interface PlanViewProps {
	blocks: BlockOut[];
}

export default function PlanView({ blocks }: PlanViewProps) {
	return (
		<div className="plan-view">
			{blocks.map((block) => {
				const key = `${block.title}-${block.minutes}-${block.explanation}`;
				return (
					<div key={key} className="plan-block">
						<h4>{block.title}</h4>
						<p>{block.minutes} minutes</p>
						<p>{block.explanation}</p>
					</div>
				);
			})}
		</div>
	);
}
