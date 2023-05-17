<script lang="ts">
	import EpList from '../../assets/episodes.json';
	$: sort = 'oldest';
	$: sortedList = EpList;
	function sorter() {
		if (sort === 'newest') sortedList = sortedList.sort((a, b) => Number(a.ep) - Number(b.ep));
		if (sort === 'oldest') sortedList = sortedList.sort((a, b) => Number(b.ep) - Number(a.ep));
		sort === 'oldest' ? (sort = 'newest') : (sort = 'oldest');
	}
</script>

<div class="flex flex-col w-full px-4 py-10">
	<div class="w-full flex justify-start">
		<button
			on:click={sorter}
			class="border-2 border-gray-600 rounded-md shadow-sm transition hover:bg-gray-50 transform hover:shadow-md hover:-translate-y-1 px-4 py-2 cursor-pointer"
		>
			{sort === 'oldest' ? 'Show newest first' : 'Show oldest first'}
		</button>
	</div>
	{#each sortedList as episode, index}
		<div
			class={`flex-wrap flex mb-8 px-8 py-4 rounded-md shadow-md ${
				index % 2 === 0 ? 'bg-white' : 'bg-yellow-50'
			}`}
		>
			<div class="w-1/4">Episode #{episode.ep}</div>
			<div class="w-3/4 text-xl hover:underline">
				<a href={`/ep/${episode.ep}`}>{episode.title}</a>
			</div>
			<div class="w-full">{new Date(episode.date).toLocaleDateString()}</div>
			<div class="w-full">{episode.desc}</div>
		</div>
	{/each}
</div>
