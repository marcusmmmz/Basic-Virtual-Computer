export function createObservable<T extends (...args: any[]) => any>() {
	type Args = Parameters<T>;
	type Callback = (...args: Args) => any;

	let subscribers: Callback[] = [];

	return {
		subscribe(callback: Callback) {
			if (!subscribers) subscribers = [];
			subscribers.push(callback);
			return callback;
		},
		emit(...args: Args) {
			if (!subscribers) subscribers = [];
			subscribers.forEach((callback) => {
				callback(...args);
			});
		},
		unsubscribe(callback: Callback) {
			subscribers = subscribers.filter((subscriber) => subscriber !== callback);
		},
	};
}

export function createMultiObservable<
	EventSignatures extends {
		[index: string]: (...args: any[]) => any;
	}
>() {
	type Args<Event extends string> = Parameters<EventSignatures[Event]>;
	type Callback<Event extends string> = (...args: Args<Event>) => any;

	let subscribers: {
		[index: string]: ReturnType<typeof createObservable>;
	} = {};

	return {
		subscribe<Event extends string>(event: Event, callback: Callback<Event>) {
			if (!subscribers[event]) {
				subscribers[event] = createObservable<Callback<Event>>();
			}
			subscribers[event].subscribe(callback);
			return callback;
		},
		emit<Event extends string>(event: Event, ...args: Args<Event>) {
			if (!subscribers[event]) {
				subscribers[event] = createObservable<Callback<Event>>();
			}
			subscribers[event].emit(...args);
		},
		unsubscribe<Event extends string>(event: Event, callback: Callback<Event>) {
			subscribers[event].unsubscribe(callback);
		},
	};
}

/**
 * @description returns a new array with a modified index
 */
export function replaceAt(array, index, value) {
	const ret = array.slice(0);
	ret[index] = value;
	return ret;
}
