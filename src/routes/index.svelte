<script context="module" lang="ts">
	export const prerender = true;

</script>

<script lang="ts">
	import Search from '$lib/Search/index.svelte';

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1 class="text-3xl text-blue-400">Handbook Search</h1>
	<p>The unofficial Hollywood Handbook search engine</p>
	<Search />
</section>
