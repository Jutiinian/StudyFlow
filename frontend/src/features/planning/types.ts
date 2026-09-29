export interface BlockOut {
	kind: "study" | "break";
	task_id: number | null;
	id: string;
	title: string;
	minutes: number;
	explanation: string;
}

export interface PlanResponse {
	blocks: BlockOut[];
	study_minutes: number;
	break_minutes: number;
	total_minutes: number;
	unused_minutes: number;
}
