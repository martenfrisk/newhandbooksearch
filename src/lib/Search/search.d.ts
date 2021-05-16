
export interface RootObject {
		id: string;
		_index: string;
		_type: string;
		_score: number;
		_source: Source;
	}

	interface Source {
		Episode: string;
		speaker: string;
		startTime: number;
		text: string;
		PodcastName: string;
		tags: string[];
	}