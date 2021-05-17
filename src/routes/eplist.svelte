<script lang="ts">
	import { EpList } from '../assets/hheplist';
	$: sort = 'oldest';
	$: sortedList = EpList;
	function sorter() {
		if (sort === 'newest') sortedList = sortedList.sort((a, b) => Number(a.id) - Number(b.id));
		if (sort === 'oldest') sortedList = sortedList.sort((a, b) => Number(b.id) - Number(a.id));
		sort === 'oldest' ? (sort = 'newest') : (sort = 'oldest');
	}

</script>

<div class="flex flex-col w-full px-4 py-10">
	<div class="w-full flex justify-start">
		<button
			on:click={sorter}
			class="border-2 border-gray-600 rounded-md shadow-sm transition hover:bg-gray-50 transform hover:shadow-md hover:-translate-y-1 px-4 py-2 cursor-pointer"
			>{sort === 'oldest' ? 'Show newest first' : 'Show oldest first'}</button
		>
	</div>
	{#each sortedList as episode, index}
		<div
			class={`flex-wrap flex mb-8 px-8 py-4 rounded-md shadow-md ${
				index % 2 === 0 ? 'bg-white' : 'bg-yellow-50'
			}`}
		>
			<div class="w-1/4">Episode #{episode.id}</div>
			<div class="w-3/4 text-xl hover:underline">
				<a href={`/ep/${episode.id}`}>{episode.title}</a>
			</div>
			<div class="w-full">{new Date(episode.isoDate).toLocaleDateString()}</div>
			<div class="w-full">{episode.description}</div>
		</div>
	{/each}
</div>
