export interface TaskOut {
	id: number;
	title: string;
	due: string;
	remaining: number;
	confidence: number;
}

export interface TaskCreate {
	title: string;
	due: string;
	remaining: number;
	confidence: number;
}

export interface TaskUpdate {
	remaining: number;
	confidence: number;
}

export interface BlockOut {
	id: string;
	title: string;
	minutes: number;
	explanation: string;
}

export interface PlanResponse {
	study_blocks: BlockOut[];
}
