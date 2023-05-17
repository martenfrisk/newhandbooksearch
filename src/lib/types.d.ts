/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
	query: string;
	filters?: string[];
}

export interface Line {
	value: string;
	matchLevel: string;
}

export interface SnippetResult {
	line: Line;
}

export interface Line2 {
	value: string;
	matchLevel: string;
	fullyHighlighted: boolean;
	matchedWords: string[];
}

export interface Episode {
	value: string;
	matchLevel: string;
	matchedWords: any[];
}

export interface HighlightResult {
	line: Line2;
	episode: Episode;
}
export interface Formatted {
	id: string;
	// season: string;
	time: string;
	speaker: string;
	line: string;
	episode: string;
	edited: boolean;
}

export interface SearchHit {
	id: string;
	// season: string;
	time: string;
	speaker: string;
	line: string;
	episode: string;
	edited: boolean;
	_formatted: Formatted;
}
export interface EpisodeInfo {
	id: string;
	title: string;
	pubDate: string;
	description: string;
	isoDate: Date;
}

export interface LocalEpisode {
	time: string;
	speaker: string;
	line: string;
	episode: string;
	edited: boolean;
}

export interface Ep {
	value: string;
	matchLevel: string;
	matchedWords: any[];
}

export interface Title {
	value: string;
	matchLevel: string;
	fullyHighlighted: boolean;
	matchedWords: string[];
}

export interface Desc {
	value: string;
	matchLevel: string;
	fullyHighlighted: boolean;
	matchedWords: string[];
}

export interface Date {
	value: string;
	matchLevel: string;
	matchedWords: any[];
}

export interface HighlightResult {
	ep: Ep;
	title: Title;
	desc: Desc;
	date: Date;
}

export interface AlgoliaHit {
	ep: string;
	title: string;
	desc: string;
	date: string;
	objectID: string;
	_highlightResult: HighlightResult;
}
export interface SearchResult {
	hits: SearchHit[];
	offset: number;
	limit: number;
	estimatedTotalHits: number;
	processingTimeMs: number;
	query: string;
	facetDistribution?: {
		episode?: { [key: string]: string };
		// season?: { [key: string]: string };
	};
}

export interface EpisodeInfo {
	id: string;
	title: string;
	pubDate: string;
	description: string;
	isoDate: Date;
}

export interface HitStats {
	estimatedTotalHits: SearchResult['estimatedTotalHits'];
	processingTime: SearchResult['processingTimeMs'];
	facets: {
		facetName: string;
		facetHits: {
			ep: string;
			hits: number;
		}[];
	}[];
}
