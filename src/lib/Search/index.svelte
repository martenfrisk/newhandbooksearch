<script lang="ts">
	import { onMount } from 'svelte';
	import { MeiliSearch } from 'meilisearch';
	import type { SearchHit, SearchResult } from '$lib/types';
	import { getRandomInt, highlight, randomQuery, secToMins, throttle } from './utils';
	import { EpList } from '../../assets/hheplist';
	import { VITE_APIKEY } from '$lib/Env';

	let query = '';
	let hits: any[],
		filter = '',
		stats: {
			nbHits: SearchResult['nbHits'];
			processingTime: SearchResult['processingTimeMs'];
		};
	const client = new MeiliSearch({
		host: 'https://ts.pcast.site/',
		apiKey: VITE_APIKEY
	});

	const index = client.index('handbook');
	async function search() {
		const data =
			filter === ''
				? await index.search(query, { attributesToHighlight: ['line'] })
				: await index.search(query, {
						attributesToHighlight: ['line'],
						filters: `episode = "${filter}"`
				  });

		stats = {
			nbHits: data.nbHits,
			processingTime: data.processingTimeMs
		};
		hits = data.hits;
	}

	const throttledSearch = throttle(500, search);
	onMount(() => {
		if (query === '') query = randomQuery[getRandomInt(randomQuery.length)];
		search();
	});
	const findEpNr = (title: string, returnValue: string) => {
		const epNr = EpList.find((x) => x.title == title);
		if (epNr) return epNr[returnValue];
		return null;
	};
	function newRandom() {
		query = randomQuery[getRandomInt(randomQuery.length)];
		search();
	}
</script>

<div class="mx-auto md:mt-8 w-full px-10 md:px-4 md:w-3/4">
	<input
		class="w-full h-12 px-4 text-xl border border-gray-500 outline-none"
		type="text"
		bind:value={query}
		on:keyup={throttledSearch}
	/>
	<!-- <input
		class="w-full h-8 px-4 text-xl border border-gray-500 outline-none"
		type="text"
		bind:value={filter}
		on:keyup={throttledSearch}
	/> -->
	<p class="my-2 text-xs md:text-sm">
		{#if stats}
			Found {stats.nbHits} hits for <span class="font-bold">{query}</span> in {stats.processingTime}
			ms
		{/if}
	</p>
	<button
		on:click={newRandom}
		class="mb-2 rounded-md bg-yellow-50 transform hover:shadow-sm hover:bg-yellow-100 border-yellow-500 border px-4 py-2"
		>Random phrase</button
	>
	{#if hits}
		{#each hits as hit}
			<div class="w-full px-4 pb-6 mb-6 shadow-md hover:bg-blue-50">
				<div class="flex flex-wrap items-center justify-between w-full mb-2">
					<a
						sveltekit:prefetch
						class="hover:underline flex py-2 items-center"
						href={`ep/${findEpNr(hit.episode, 'id')}`}
					>
						<div class="pt-1 mr-2 text-xs text-gray-700 uppercase">
							#{findEpNr(hit.episode, 'id')}
						</div>
						<div class="text-sm text-gray-800 md:text-base">
							{hit.episode} ({new Date(findEpNr(hit.episode, 'isoDate')).toDateString()})
						</div>
					</a>
					<div class="flex items-center font-mono text-right text-gray-600">
						<div class="mr-2 font-sans text-black">{hit.speaker}</div>
						<div class="mr-2 font-sans text-right text-blue-600 border-b-2 border-dotted">
							<!-- <a href={`/ep/${epName(hit.episode).ep}#:~:text=${hit.time}`}> go to transcript </a> -->
						</div>
						{secToMins(hit.timeCode)}&nbsp;
					</div>
				</div>
				<div class="py-2 pl-4 mt-4 border-l-2 border-gray-400 md:text-lg">
					<p>{@html hit._formatted.line}</p>
				</div>
			</div>
		{/each}
	{/if}
</div>
