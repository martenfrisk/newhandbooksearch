<script lang="ts">
	export let url: string, ep: string, title: string, desc: string, date: string;
</script>

<div class="w-full px-6 py-4 flex mb-4 rounded-md border border-blue-300 shadow-lg flex-wrap">
	<div class="w-full items-center md:items-end flex">
		<a href={`/ep/${ep}`} class="text-blue-700 hover:underline font-semibold">
			{ep}
		</a>
		<a href={`/ep/${ep}`} class="text-blue-800 hover:underline text-xl pl-4">
			{title}
		</a>
	</div>
	<div class="w-full items-center justify-between md:items-end flex">
		<a
			href={url}
			class="text-blue-900 border-b border-dotted border-blue-900 hover:text-blue-700 text-md"
		>
			Listen
		</a>
		<div class="flex flex-row mt-2 md:mt-0 items-end md:flex-col">
			<span class="text-sm mr-3 md:mr-0 text-gray-700"> Released </span>
			<span class="text-sm md:text-base">
				{new Date(date).toLocaleDateString()}
			</span>
		</div>
	</div>
	<div class="my-4 w-full">{desc}</div>
</div>
