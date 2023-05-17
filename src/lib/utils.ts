import { MeiliKey } from '$lib/Env';
import type { SearchResult } from 'lib/types';
import { MeiliSearch } from 'meilisearch';

import epList from '../assets/episodes.json';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type throttleFunction = (args: any) => void;
export const throttle = (delay: number, fn: throttleFunction): throttleFunction => {
	let inDebounce: any = null;
	return (args) => {
		clearTimeout(inDebounce);
		inDebounce = setTimeout(() => fn(args), delay);
	};
};

export const highlight = (needle: string, haystack: string): string => {
	const result: string = haystack.replace(new RegExp(needle, 'gi'), (str) => `<em>${str}</em>`);
	return result;
};

export const secToMins = (seconds: number): string => {
	const minutes: number = seconds / 60;
	const totMins: string = minutes.toFixed(2);
	const number = totMins.replace('.', ':');
	return number;
};

export const randomQuery = [
	'santa man',
	'teaser freezer',
	'chef kevin',
	'moriarty',
	'scoop troop',
	'eggnog',
	'gmail roulette',
	'speak on that',
	'ice bucket challenge',
	'cards against humanity',
	'engineer cody boy',
	"i love you and i'm in love with you",
	'guardians of the galaxy',
	'teen pope',
	'bosch',
	'homemade water',
	'doughboys'
];

export const getRandomInt = (max: number): number => Math.floor(Math.random() * Math.floor(max));

interface FacetDistribution {
	[key: string]: {
		[key: string]: number;
	};
}
export interface MeiliResult {
	stats: {
		estimatedTotalHits: SearchResult['estimatedTotalHits'];
		processingTime: SearchResult['processingTimeMs'];
		facetDistribution?: FacetDistribution;
		facets: {
			facetName: string;
			facetHits: {
				ep: string;
				hits: number;
			}[];
		}[];
	};
	hits: SearchResult['hits'];
}

export const client = new MeiliSearch({
	host: 'https://ts.pcast.site/',
	apiKey: MeiliKey
});

export async function searchMeili({
	query,
	filter,
	offset = 20,
	filterEdited = false
}: {
	query: string;
	filter: string[];
	offset: number;
	filterEdited: boolean;
}): Promise<MeiliResult> {
	const index = client.index('handbook');

	// if (!isSSR && window.history.pushState && query !== '') {
	// 	const urlParams = new URLSearchParams(`s=${query}`);

	// 	let newUrl =
	// 		window.location.protocol + '//' + window.location.host.replace('/', '') + '?' + urlParams;

	// 	if (filter.length > 0)
	// 		newUrl = `${newUrl}&f=${filter.map((x) => x.replace(' = ', '=')).join(',')}`;
	// 	// if (filterEdited) newUrl = `${newUrl}&edited=true`;
	// 	window.history.pushState({ path: newUrl }, '', newUrl);
	// }
	let data: SearchResult;
	// only edited & no filters
	if (filterEdited && filter.length == 0) {
		data = await index.search(query, {
			attributesToHighlight: ['line'],
			filter: 'edited=true',
			facets: ['episode'],
			limit: offset
		});
	} else if (filterEdited && filter.length > 0) {
		// 	// only edited & filter
		data = await index.search(query, {
			attributesToHighlight: ['line'],
			filter:
				(filter.length > 1 ? filter.join(' OR ') : filter.toString()) +
				(filterEdited ? ' AND edited=true' : 'edited=true'),
			facets: ['episode'],
			limit: offset
		});
	} else if (!filterEdited && filter.length > 0) {
		// if (filter.length > 0) {
		// not only edited & filters
		data = await index.search(query, {
			attributesToHighlight: ['line'],
			filter: filter.length > 1 ? filter.join(' OR ') : filter.toString(),
			facets: ['episode'],
			limit: offset
		});
	} else {
		data = await index.search(query, {
			attributesToHighlight: ['line'],
			facets: ['episode'],
			limit: offset
		});
	}
	const facets: any[] = [];
	interface FacetHit {
		ep: string;
		hits: number;
	}
	if (data !== undefined && data.facetDistribution) {
		Object.entries(data.facetDistribution).forEach(([facetKey, facetValue]) => {
			const valuesArr: any[] = [];
			Object.entries(facetValue).forEach(([key, value]) => {
				valuesArr.push({ ep: key, hits: value });
			});
			valuesArr.sort((a: FacetHit, b: FacetHit) => {
				return b.hits - a.hits;
			});
			facets.push({ facetName: facetKey, facetHits: valuesArr.slice(0, 9) });
		});
	}
	return {
		stats: {
			estimatedTotalHits: data.estimatedTotalHits,
			processingTime: data.processingTimeMs,
			facets: facets
		},
		hits: data.hits
	};
}
export const timeToUrl = (time: string): URLSearchParams => {
	const urlTime = new URLSearchParams();
	urlTime.append('t', time);
	return urlTime;
};

export function findEpNr(title: string, returnValue: string): string | null {
	const epNr = epList.find((x) => x.title == title);
	if (epNr) {
		// @ts-ignore
		return epNr[returnValue];
	} else {
		return null;
	}
}
export function newRandom(): string {
	return randomQuery[getRandomInt(randomQuery.length)];
}

export function epName(episode: string) {
	return epList.find((x) => x.ep === episode);
}

export function createSearchParams({
	query,
	offset = 20,
	filter,
	editedOnly
}: {
	query: string;
	offset?: number;
	filter?: string[];
	editedOnly?: boolean;
}) {
	const params = new URLSearchParams();
	params.set('q', query);
	if (offset) params.set('o', offset.toString());
	if (filter && filter?.length > 0) {
		params.set('f', filter.join(','));
	}
	if (editedOnly) params.set('e', 'true');
	return params;
}
