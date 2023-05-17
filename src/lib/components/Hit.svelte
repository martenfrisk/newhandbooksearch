<script lang="ts">
	import Tooltip from 'lib/components/Tooltip.svelte';
	import Check from 'lib/icons/Check.svelte';
	import Minus from 'lib/icons/Minus.svelte';
	import type { SearchHit } from 'lib/types';
	import { epName, timeToUrl } from 'lib/utils';

	export let hit: SearchHit;

	function formatDateString(date: string | undefined) {
		if (!date) return '';
		const d = new Date(date);
		return d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div
	class="w-full px-4 pt-4 pb-2 mb-6 border border-blue-200 rounded-md shadow-xl md:shadow-md hover:bg-blue-50"
>
	<div class="flex flex-wrap items-center justify-between w-full mb-2">
		<div class="flex flex-row md:items-center">
			<div class="mr-2 text-sm text-blue-900 uppercase hover:underline">
				#{hit.episode.replace('.json', '')}
			</div>
			<!-- <Tooltip>
				<svelte:fragment slot="tooltip">Go to episode page</svelte:fragment>
				<svelte:fragment slot="content">
					<a
						class="mr-2 text-sm text-blue-900 uppercase hover:underline"
						href={`/ep/${hit.episode.replace('.json', '')}`}
					>
						{hit.episode.replace('.json', '')}
					</a>
				</svelte:fragment>
			</Tooltip> -->
			<div class="text-sm text-black md:text-base">
				{epName(hit.episode.replace('.json', ''))?.title}
				{#if epName(hit.episode.replace('.json', ''))?.date}
					<span class="text-sm text-gray-900">
						({formatDateString(epName(hit.episode.replace('.json', ''))?.date)})
					</span>
				{/if}
			</div>
		</div>

		<div class="w-full px-1 my-4 border-gray-400 md:pl-6 md:border-l-2 md:text-lg">
			<p>{@html hit._formatted?.line}</p>
		</div>
		<div
			class="flex items-center justify-between w-full mt-2 font-mono text-sm text-right text-gray-600 md:text-base md:mt-0"
		>
			<div class="flex items-center gap-3 mr-2 font-sans">
				<span class="text-black border-none">
					{hit.speaker}
				</span>
				<span>
					{hit.time}
				</span>
				{#if hit.edited}
					<Tooltip>
						<svelte:fragment slot="tooltip">Edited</svelte:fragment>
						<svelte:fragment slot="content">
							<Check />
						</svelte:fragment>
					</Tooltip>
				{:else}
					<Tooltip>
						<svelte:fragment slot="tooltip">Not edited</svelte:fragment>
						<svelte:fragment slot="content">
							<Minus />
						</svelte:fragment>
					</Tooltip>
				{/if}
			</div>
			<div class="flex gap-4">
				<!-- <Tooltip>
					<svelte:fragment slot="tooltip">Go to line in transcript</svelte:fragment>
					<svelte:fragment slot="content">
						<a
							href={`/ep/${epName(hit.episode)?.ep}?${timeToUrl(
								`t-${hit.time.replaceAll(':', '')}`
							)}`}
							class="font-sans text-base text-blue-600 border-b-2 border-blue-200 border-dotted group hover:border-solid"
						>
							transcript
						</a>
					</svelte:fragment>
				</Tooltip>
				<Tooltip>
					<svelte:fragment slot="tooltip">Listen on Stitcher</svelte:fragment>
					<svelte:fragment slot="content">
						<a
							class="font-sans text-base text-blue-600 border-b-2 border-blue-200 border-dotted has-tooltip hover:border-solid"
							href={epName(hit.episode)?.url}
							rel="noopener noreferrer"
							target="_blank"
						>
							listen
						</a>
					</svelte:fragment>
				</Tooltip> -->
			</div>
		</div>
	</div>
</div>
