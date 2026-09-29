// Function will never return normally, always throws
export async function throwForBadResponse(response: Response): Promise<never> {
	let detail: string;

	try {
		const body = await response.json();
		detail =
			typeof body.detail === "string"
				? body.detail
				: JSON.stringify(body.detail);
	} catch {
		detail = response.statusText;
	}

	throw new Error(`Request failed (${response.status}): ${detail}`);
}
