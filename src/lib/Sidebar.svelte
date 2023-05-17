<script lang="ts">
	import { onMount } from 'svelte';

	$: infoView = true;
	$: moreInfo = false;
	$: copyright = false;
	const handleInfoView = () => (infoView = !infoView);
	const handleMoreInfo = () => (moreInfo = !moreInfo);
	const handleCopyright = () => (copyright = !copyright);

	let width: number;

	onMount(() => {
		if (width > 768) {
			infoView = true;
		} else {
			infoView = false;
		}
	});
</script>

<svelte:window bind:innerWidth={width} />

<div class="sticky w-full py-0 mt-0 md:mb-0 md:w-1/4 md:max-w-sm">
	<div class="flex items-end justify-end h-16 pr-3 mt-0 text-2xl text-white bg-gray-700 md:h-40">
		<div class="flex flex-col justify-end z-10">
			<a href="/" class="text-right"> Handbook Search </a>
			<div class="text-sm font-semibold">Hollywood Handbook transcript search engine</div>
		</div>
	</div>
	<div class="flex">
		<a
			href="/episodes"
			class="w-1/3 px-3 py-2 text-center text-black bg-yellow-100 hover:bg-yellow-200 transition-colors border-r border-white"
		>
			<span class=" border-b border-white border-dashed hover:border-white"> Episodes </span>
		</a>
		<a
			href="/"
			class="w-1/3 px-3 py-2 text-center text-black bg-yellow-100 hover:bg-yellow-200 transition-colors border-l border-white"
		>
			<span class="border-b border-white border-dashed hover:border-white"> Search </span>
		</a>
		<button
			class="w-1/3 px-3 py-2 text-center bg-gray-100 border-l border-gray-700"
			on:click={handleInfoView}
		>
			{#if infoView}
				<div class="flex justify-center">
					<p class="border-b border-white border-dashed cursor-pointer hover:border-black">
						Info&nbsp;&#9662;
					</p>
				</div>
			{:else}
				<div class="flex justify-center">
					<p class="border-b border-white border-dashed cursor-pointer hover:border-black">
						Info&nbsp;&#9652;
					</p>
				</div>
			{/if}
		</button>
	</div>
	<div class="w-full h-auto px-4 py-4 font-sans leading-relaxed text-justify md:px-6">
		{#if infoView}
			<div>
				<div>
					<p class="my-4">
						Currently uploading more recent episodes. Most episodes from 1-320 (and 500) are
						available.
					</p>
					<p class="my-4">
						Transcripts are unedited. Speakers not identified. Timestamp are approximate.
					</p>
				</div>

				<button
					on:click={handleCopyright}
					class="inline-block border-b border-dotted cursor-pointer"
				>
					Copyright information&nbsp;&#9662;
				</button>
				<br />
				{#if copyright}
					<div>
						<p>
							No copyright infringement intended. All rights belong to their respective rights
							holders (probably Hayes & Sean or Earwolf). Want to contact me? Message me on GitHub
							or reddit (u/martanor)
						</p>
						<p>Build with Svelte Kit, powered by MeiliSearch, styled using Tailwind CSS.</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
