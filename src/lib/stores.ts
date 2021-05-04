import { cpu, ram } from "$lib/vm";
import { readable } from "svelte/store";

export const ramStore = readable(ram, (set) => {
	let unsubscriber = ram.addressesUpdated.subscribe(() => set(ram));
	return () => ram.addressesUpdated.unsubscribe(unsubscriber);
});

// This makes reactivity in the template possible
export const cpuStore = readable(cpu, (set) => {
	let unsubscriber = cpu.cycleFinished.subscribe(() => set(cpu));
	return () => cpu.cycleFinished.unsubscribe(unsubscriber);
});
