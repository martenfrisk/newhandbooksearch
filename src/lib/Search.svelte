<script lang="ts">
	import { onMount } from 'svelte';
	import type { SearchHit, HitStats } from '$lib/types';
	import { createSearchParams, newRandom, throttle } from './utils';

	import Hit from './components/Hit.svelte';
	import Stats from './components/Stats.svelte';
	import { goto } from '$app/navigation';

	export let query: string, filter: string[], hits: SearchHit[] | undefined, editedOnly: boolean;

	let stats: HitStats;
	let offset = 20;

	async function search() {
		if (query) {
			updateParams();
			const paramsObj = createSearchParams({ query, offset, filter, editedOnly });

			const response = await fetch(`/api/search?${paramsObj}`);

			if (response.ok) {
				const data = await response.json();
				hits = data.hits;
				stats = data.stats;
			} else {
				console.error('HTTP-Error: ' + response.status);
			}
		}
	}

	async function addToFilter(filterName: string, filterValue: string) {
		const combinedFilter = `${filterName} = ${filterValue}`;
		filter = filter.includes(combinedFilter)
			? filter.filter((x) => x !== combinedFilter)
			: [combinedFilter, ...filter];

		await search();
	}

	async function clearFilter() {
		filter = [];
		await search();
	}

	async function getNewRandom() {
		query = newRandom();
		filter = [];
		await search();
	}

	async function updateParams() {
		const params = new URLSearchParams();
		params.set('s', query);
		if (filter.length > 0) {
			params.set('f', filter.map((x) => x.replaceAll(' = ', '=')).join(','));
		}
		if (editedOnly) params.set('edited', 'true');
		await goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
	}
	// $: if ((query || editedOnly) && browser) {
	// 	throttle(500, updateParams);
	// }

	onMount(async () => {
		// setTimeout(async () => {
		if (query === '') {
			query = newRandom();
		}
		await search();
		// }, 100);
	});
</script>

<div class="flex flex-wrap justify-center w-full px-2 my-4 md:items-center md:px-6">
	<div class="w-full md:pl-4">
		<label for="search" class="text-sm">Search</label>
	</div>
	<input
		class="w-3/4 h-12 px-4 text-xl border border-gray-500 shadow-md outline-none rounded-l-md rounded-r-md md:rounded-r-none"
		type="text"
		id="search"
		bind:value={query}
		on:keyup={throttle(300, search)}
	/>
	<button
		class="w-1/4 h-12 px-px text-sm font-semibold text-gray-800 border-2 border-gray-500 shadow-md rounded-l-md bg-yellow-200 rounded-r-md md:rounded-l-none md:px-2 md:text-base md:py-2 hover:bg-gray-500 hover:text-white hover:border-white"
		on:click={getNewRandom}
	>
		Random search
	</button>
</div>
<div class="flex flex-col flex-wrap w-full gap-2 px-6 my-2">
	<label for="editedOnly" class="flex items-baseline gap-2 text-sm cursor-pointer">
		Edited lines only
		<input type="checkbox" id="editedOnly" bind:checked={editedOnly} on:change={() => search()} />
	</label>
	<details>
		<summary class="cursor-pointer">
			<span class="hover:underline"> Filter by season or episode </span>
			{#if filter?.length > 0}
				<button
					class="ml-2 text-sm text-gray-700 border-b border-gray-500 border-dotted"
					on:click={clearFilter}
				>
					(clear filter)
				</button>
			{/if}
		</summary>
		{#if stats?.facets}
			<div class="flex flex-wrap w-5/6 gap-2 my-2 max-w-screen">
				<span class="block w-full md:inline md:w-auto">season:</span>
				{#each stats.facets.find((x) => x.facetName === 'season')?.facetHits || [] as facet}
					<button
						class={`border border-blue-500 px-2 py-px focus:outline-none text-sm md:text-base  focus:border-black rounded-lg ${
							filter?.includes(`season = ${facet.ep}`)
								? 'bg-blue-500 text-white'
								: 'bg-white text-black'
						}`}
						on:click={() => addToFilter('season', facet.ep)}>{facet.ep}&nbsp;({facet.hits})</button
					>
				{/each}
			</div>
			<div class="flex flex-wrap w-5/6 gap-2 my-2 max-w-screen">
				<span class="block w-full md:inline md:w-auto">episode:</span>
				{#each stats.facets.find((x) => x.facetName === 'episode')?.facetHits || [] as facet}
					<button
						class={`border border-blue-500 px-2 py-px text-sm md:text-base rounded-lg ${
							filter?.includes(`episode = ${facet.ep}`)
								? 'bg-blue-500 text-white'
								: 'bg-white text-black'
						}`}
						on:click={() => addToFilter('episode', facet.ep)}>{facet.ep}&nbsp;({facet.hits})</button
					>
				{/each}
			</div>
		{/if}
	</details>
</div>
{#if query}
	<Stats {stats} {filter} {query} {offset} />
{:else}
	<p>You need to search for something, or click the random search button.</p>
{/if}
{#if hits && query}
	{#each hits as hit}
		<Hit {hit} />
	{/each}
	{#if stats?.estimatedTotalHits && stats?.estimatedTotalHits > 20}
		<div class="w-full flex justify-center">
			<button
				class="px-4 py-2 rounded-md border border-blue-600 text-blue-600 cursor-pointer"
				on:click={() => {
					offset = offset + 20;
					search();
				}}
			>
				Load more
			</button>
		</div>
	{/if}
{:else}
	<div class="w-full px-4 pt-4 pb-6 mb-6 shadow-md">
		<div class="flex flex-col flex-wrap items-start justify-between w-full gap-2 mb-2">
			<div class="w-1/2 h-8 bg-gray-200 rounded-md animate-pulse">&nbsp;</div>
		</div>
		<div class="h-10 py-2 pl-4 mt-4 bg-gray-200 rounded-md animate-pulse md:text-lg" />
	</div>
{/if}
