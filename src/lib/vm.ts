import { createObservable } from "$lib/utils";
import { get, writable } from "svelte/store";

export const opcodes = {
	LOAD: 0b0001,
	ADD: 0b0010,
	STORE: 0b0011,
	JUMP: 0b0100,
};

function replaceAt(array, index, value) {
	const ret = array.slice(0);
	ret[index] = value;
	return ret;
}

export function createRAM(addresses: Uint8Array) {
	return {
		addressesUpdated: createObservable<() => any>(),
		addresses,
		setAddress(address: number, value: number) {
			addresses[address] = value;
			this.addressesUpdated.emit();
		},
		getAddress(address: number) {
			return addresses[address];
		},
	};
}

type RAM = ReturnType<typeof createRAM>;

export function createCPU(ram: RAM) {
	return {
		cycleFinished: createObservable<() => any>(),
		clock: 500, // CPU Clock in Milliseconds
		address: 0, // Current RAM address
		register: 0, // Instruction register
		accumulator: 0,

		get opcode() {
			return this.register >> 4;
		},
		get operands() {
			return this.register & 0b1111;
		},

		fetch() {
			this.register = ram.getAddress(this.address);
		},
		decode() {},
		execute() {
			let opcode = this.opcode;
			let operands = this.operands;

			switch (opcode) {
				case opcodes["LOAD"]:
					this.accumulator = ram.getAddress(operands);
					break;

				case opcodes["ADD"]:
					// TODO: getting extra data from RAM
					// should be part of the decode phase
					this.accumulator += ram.getAddress(operands);
					break;

				case opcodes["STORE"]:
					ram.setAddress(operands, this.accumulator);
					break;

				case opcodes["JUMP"]:
					this.address = operands;
					break;

				default:
					console.log("execute default?");
					break;
			}
		},
		cycle() {
			this.fetch();
			this.decode();
			this.execute();
			if (this.opcode != opcodes["JUMP"]) {
				this.address += 1;
			}

			this.cycleFinished.emit("cycleFinished");
		},

		interval: undefined as ReturnType<typeof setInterval> | undefined,
		start() {
			this.interval = setInterval(() => {
				this.cycle();
			}, this.clock);
		},
		stop() {
			clearInterval(this.interval);
		},
	};
}

export function instruction(opcode: string, operands: number) {
	return (opcodes[opcode] << 4) + operands;
}

export const ram = createRAM(
	new Uint8Array([
		instruction("LOAD", 6),
		instruction("ADD", 7),
		instruction("STORE", 6),
		instruction("JUMP", 1),
		0,
		0,
		1,
		1,
	])
);

export const cpu = createCPU(ram);
