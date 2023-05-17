<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/Sidebar.svelte';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { fly } from 'svelte/transition';
	import UpArrow from 'lib/icons/UpArrow.svelte';

	inject({ mode: dev ? 'development' : 'production' });
	let element: HTMLElement;
	let y = 0,
		innerHeight: number;

	$: isButtonVisible = y > innerHeight ? true : false;
</script>

<svelte:head>
	<title>Handbook Search ★ The Hollywood Handbook Transcript Search</title>
</svelte:head>

<svelte:window bind:scrollY={y} bind:innerHeight />
<div bind:this={element} />
<div class="flex flex-col w-screen md:flex-row">
	<Sidebar />
	<main class="w-full h-auto mt-0 px-2 md:px-10 md:mt-10 mb-10 md:w-3/4">
		<slot />
		{#if isButtonVisible}
			<button
				transition:fly={{ y: 100, duration: 400 }}
				on:click={() => element.scrollIntoView()}
				class="bottom-4 rounded-full w-12 h-12 bg-blue-700 right-4 fixed text-white select-none"
			>
				<UpArrow />
			</button>
		{/if}
	</main>
</div>

<style>
	div {
		overflow-x: hidden;
	}
</style>
