<script context="module" lang="ts">
	import { MeiliSearch } from 'meilisearch';
	import { EpList } from '../../assets/hheplist';
	const client = new MeiliSearch({
		host: 'https://meili-router-zraqvc5gd4kituxj-gtw.qovery.io',
		apiKey: 'masterKey'
	});

	const index = client.index('handbook');
	export async function load({ page }) {
		const { id } = page.params;

		const episode = EpList.find((x) => x.id === id);
		const data = await index.search('', {
			filters: `episode = "${episode.title}"`,
			limit: 999
		});
    const lines = data.hits
		return {
			props: {
				lines: lines.sort((a, b) => a.timeCode - b.timeCode),
        info: episode
			}
		};
	}

</script>

<script lang="ts">
	import { secToMins } from '$lib/Search/utils';
	import type { EpisodeInfo, SearchHit } from '$lib/types';

	export let lines: SearchHit[], info: EpisodeInfo
  // const linesSorted = lines.sort((a, b) => a.timeCode - b.timeCode)
</script>

<svelte:head>
  <title>Handbook Search - Episode {info.id}: {info.title} ★ The Hollywood Handbook Search Engine</title>
</svelte:head>


<div class="w-full px-10 mx-auto md:w-3/4">
  <div class="flex flex-col items-center w-full my-4">
    <h2 class="text-xl">#{info.id} - {info.title}</h2>
    <h3>Published {new Date(info.isoDate).toDateString()}</h3>
    <p class="w-3/4 my-4">{info.description}</p>
  </div>
	{#each lines as line}
		<div class="flex items-start w-full mb-2 hover:bg-gray-100 hover:shadow-sm">
			<div class="flex justify-around w-1/5">
				<span>
					{secToMins(line.timeCode)}
				</span>
				<span>
					{line.speaker}
				</span>
			</div>
			<div class="w-4/5">{line.line}</div>
		</div>
	{/each}
</div>
