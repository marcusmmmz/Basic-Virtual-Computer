<script lang="ts">
	import { opcodes } from "$lib/vm";
</script>

<p>
	Instructions: <br />
	{#each Object.keys(opcodes) as instruction, i (instruction)}
		{instruction} {i.toString(2).padStart(8, "0")} <br />
	{/each}
</p>

<p>And that's all. More coming "soon" ¯\_(ツ)_/¯</p>
