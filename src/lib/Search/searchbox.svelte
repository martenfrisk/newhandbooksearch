<script lang="ts">
	export let currentRefinement, isSearchStalled, refine;

</script>

<form noValidate action="" role="search">
	<input
		type="search"
		value={currentRefinement}
		on:change={(event) => refine(event.currentTarget.value)}
	/>
	<button on:click={() => refine('')}>Reset query</button>
	{#if isSearchStalled}
		My search is stalled
	{/if}
</form>
