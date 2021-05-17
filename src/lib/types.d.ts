/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
	userid: string;
}

export interface SearchHit {
	id: string;
	index: string;
	podcast: string;
	episode: string;
	line: string;
	speaker: string;
	timeCode: number;
	tags: string[];
}

export interface SearchResult {
		hits: SearchHit[];
		offset: number;
		limit: number;
		nbHits: number;
		exhaustiveNbHits: boolean;
		processingTimeMs: number;
		query: string;
}

export interface EpisodeInfo {
	id: string;
	title: string;
	pubDate: string;
	description: string;
	isoDate: Date;
}