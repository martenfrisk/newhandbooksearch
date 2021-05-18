<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/Sidebar/index.svelte';

</script>

<!-- <div class="w-full flex flex-col items-center my-4">
	<h1 class="text-3xl text-blue-700">Handbook Search</h1>
	<p>The unofficial Hollywood Handbook search engine</p>
</div> -->
<div class="flex flex-wrap">

	<Sidebar />
	<main class="w-full md:w-3/4">
		<slot />
	</main>
</div>
