<script lang="ts">
	import { cpu, opcodes } from "$lib/vm";
	import { cpuStore, ramStore } from "$lib/stores";

	// Tracked RAM addresses
	let tracked: string[] = [];
	let newTrackerValue = "";
	function addTracker() {
		tracked = [...tracked, newTrackerValue];
	}

	function displayInstruction(number: number) {
		const opcode = number >> 4;
		const operands = number & 0b1111;

		if (number > 15) {
			for (const strOpcode in opcodes) {
				const element = opcodes[strOpcode];

				if (opcode == element) {
					return `${strOpcode} ${operands.toString(2).padStart(4, "0")}`;
				}
			}
			return "NULL";
		} else {
			return number.toString(2).padStart(8, "0");
		}
	}
</script>

<div class="computer">
	<div class="ram">
		<p>RAM:</p>
		<p>
			{#each $ramStore.addresses as value, i}
				{i.toString(2).padStart(8, "0")}
				:
				{displayInstruction(value)}
				<br />
			{/each}
		</p>
	</div>
	<div>
		<button on:click={() => cpu.cycle()}>Cycle</button>
		<button on:click={() => cpu.start()}>Start CPU</button>
		<button on:click={() => cpu.stop()}>Stop CPU</button>
		<p>
			Clock: {$cpuStore.clock} <br />
			Accumulator: {$cpuStore.accumulator} <br />
			Address: {$cpuStore.address} <br />
			Register: {displayInstruction($cpuStore.register)} <br />
		</p>
	</div>
	<div>
		<input bind:value={newTrackerValue} type="number" />
		<button on:click={() => addTracker()}>Track</button>
		<p>
			{#each tracked as tracker}
				{$ramStore.addresses[parseInt(tracker)]} <br />
			{/each}
		</p>
	</div>
</div>

<style>
	.computer {
		height: 100%;
		display: grid;
		grid-gap: 2% 10%;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 1fr);
	}

	.computer > div {
		background: hsl(0, 0%, 10%);
	}

	.ram {
		grid-row: span 2;
	}

	@media (max-width: 700px) {
		.computer {
			height: auto;
			grid-template-columns: repeat(1, 1fr);
		}
	}
</style>
