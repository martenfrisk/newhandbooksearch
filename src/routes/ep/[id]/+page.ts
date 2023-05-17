import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { id } = params;
	const epPromise = import(`../../../assets/transcripts/${id}.json`);
	const hits = await epPromise;
	if (id) {
		return {
			episode: id,
			hits: hits
		};
	}

	throw error(404, 'Not found');
}

export const prerender = true;
