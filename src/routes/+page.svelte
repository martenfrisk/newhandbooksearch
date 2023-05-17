<script lang="ts">
	import type { PageData } from './$types';
	import Search from '$lib/Search.svelte';
	export let data: PageData;

	const { query, filter, hits, editedOnly } = data;
</script>

<Search {query} {filter} {hits} {editedOnly} />
