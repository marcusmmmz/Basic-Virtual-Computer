<script lang="ts">
	import { onMount } from "svelte";

	let instructionsEl : HTMLParagraphElement
	let addressesEl : HTMLParagraphElement
	let cpuEl : HTMLDivElement
	let trackedEl : HTMLParagraphElement
	let addTrackerEl : HTMLInputElement

	const instructions : {[key:string]:number} = {
		LOAD: 0b0001,
		ADD:  0b0010,
		STORE:0b0011,
		JUMP: 0b0100,
	}

	// Tracked RAM addresses
	const tracked : string[] = []

	const CPU = {
		clock : 500, // CPU Clock in Milliseconds
		address:0, // Current RAM address
		register:0, // Instruction register
		accumulator:0,

		get instruction() { return this.register >> 4 },
		get argument() { return this.register - (this.instruction << 4) },

		fetch() {
			this.register = RAM.adresses[this.address]
		},
		decode() {
				
		},
		execute() {
			let instruction = this.instruction
			let argument = this.argument
			
			switch (instruction) {
				case instructions["LOAD"]:
					this.accumulator = RAM.adresses[argument]
					break;
		
				case instructions["ADD"]:
					this.accumulator += RAM.adresses[argument]
					break;

				case instructions["STORE"]:
					RAM.adresses[argument] = this.accumulator
					break;

				case instructions["JUMP"]:
					this.address = argument
					break;

				default:
					console.log("execute default?")
					break;
			}
		},
		cycle() {
			this.fetch()
			this.decode()
			this.execute()
			if (this.instruction != instructions["JUMP"]) {
				this.address += 1
			}

			updateGUI()
		},

		interval:undefined as ReturnType<typeof setInterval>|undefined,
		start() {
			this.interval = setInterval( () => {
				this.cycle()
			}, this.clock)
		},
		stop() {
			clearInterval(this.interval)
		},
	}

	function instruction(instruction: string, argument: number) {
		return (instructions[instruction] << 4) + argument
	}

	function displayInstruction(number: number) {
		for (const instruction in instructions) {
			if (instructions.hasOwnProperty(instruction)) {
					const element = instructions[instruction];
				if (number == element) {
					return instruction
				}
			}
		}
		return "NULL"
	}

	const RAM = {
		adresses : new Uint8Array([
			instruction("LOAD", 6),
			instruction("ADD", 7),
			instruction("STORE", 6),
			instruction("JUMP", 1),
			0,
			0,
			1,
			1,
		]),
	}

	function updateGUI() {
		let output = ""

		for (const instruction in instructions) {
			if (instructions.hasOwnProperty(instruction)) {
				const element = instructions[instruction];
				output += `${instruction} : ${element} <br/>`
			}
		}

		instructionsEl.innerHTML = output

		output = ""

		RAM.adresses.forEach((value, i, arr) => {
			if (value >> 4) {
				output += `Address ${i}: ${displayInstruction(value >> 4)} ${value - (value >> 4 << 4)} <br/>`
			} else {
				output += `Address ${i}: ${value} <br/>`
			}
		})

		addressesEl.innerHTML = output

		output = ""

		let headerValueFormat = (header: string, value: any) => {
			return `<div><p>${header}:</p> <p>${value}</p></div>`
		}

		output += headerValueFormat("Clock", CPU.clock )
		output += headerValueFormat("Accumulator", CPU.accumulator)
		output += headerValueFormat("Address", CPU.address)
		output += headerValueFormat("Register", `${displayInstruction(CPU.instruction)} ${CPU.argument}`)

		cpuEl.innerHTML = output

		output = ""

		for (const tracker of tracked) {
			output += RAM.adresses[parseInt(tracker)] + "<br/>"
		}

		trackedEl.innerHTML = output
	}

	function addTracker() {
		tracked.push( addTrackerEl.value )
		updateGUI()
	}

	onMount(()=>{
		updateGUI()
	})
</script>

<div id="computer">
	<div id="tracker">
			<input bind:this={addTrackerEl} type="number" id="add-tracker">
			<button on:click={()=>addTracker()}>Track</button>
			<p bind:this={trackedEl} id="tracked"></p>
	</div>
	<div id="cpu">
			<button on:click={()=>CPU.cycle()}>Cycle</button>
			<button on:click={()=>CPU.start()}>Start CPU</button>
			<button on:click={()=>CPU.stop()}>Stop CPU</button>
			<div bind:this={cpuEl} id="cpu-stats"></div>
	</div>
	<div id="ram">
			RAM: <p bind:this={addressesEl} id="addresses"></p>
	</div>
	<div id="display">
			Instructions: <p bind:this={instructionsEl} id="instructions"></p>
	</div>
	<div id="keyboard"></div>
</div>

<style>
	* {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		font-size: 110%;
		color: white;
		text-align: center;
	}

	:global(body) {
		margin: 0px;
	}

	:global(body), button, input {
		background: black;
	}

	#computer {
		width: 100%;
		height: 98vh;
		display: grid;
		gap: 2% 20%;
		grid-template-columns: 40% 40%;
		grid-template-rows: 35% 65%;
	}

	#computer > div {
		background: #1b1b1b;
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}

	#cpu > div {
		display: flex;
		gap: 0 40px;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>