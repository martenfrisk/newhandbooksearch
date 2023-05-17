import { createSearchParams } from 'lib/utils';

/** @type {import('./$types').PageLoad} */
export async function load({ url, fetch }) {
	let query = url?.searchParams?.get('s') || '';
	let editedOnly = url?.searchParams?.has('edited') || false;
	let filter = url?.searchParams?.get('f')?.split(',') || [];
	let hits;
	if (query) {
		const searchParams = createSearchParams({ query, filter, editedOnly });
		const response = await fetch(`/api/search?${searchParams}`);

		if (response.ok) {
			const data = await response.json();
			hits = data.hits;
		} else {
			console.error('HTTP-Error: ' + response.status);
		}
	}
	return {
		query: query,
		filter: filter,
		hits: hits,
		editedOnly: editedOnly
	};
}
