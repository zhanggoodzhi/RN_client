import {
	NativeModules,
	NativeEventEmitter,
	DeviceEventEmitter,
	NativeAppEventEmitter,
	Platform,
} from 'react-native';

const { RNTimer } = NativeModules;
const Emitter = new NativeEventEmitter(RNTimer);

class myTimer {

	constructor() {
		this.uniqueId = 0;
		this.callbacks = {};

		Emitter.addListener('Timer.timeout', (id) => {
			if (this.callbacks[id]) {
				const callback = this.callbacks[id].callback;
				if (!this.callbacks[id].interval) {
					delete this.callbacks[id];
					RNTimer.clearInterval(intervalId);
				}
				callback();
			}
		});
	}
	setTimeout(callback, timeout) {
		const timeoutId = ++this.uniqueId;
		this.callbacks[timeoutId] = {
			callback: callback,
			interval: false,
			timeout: timeout
		};
		RNTimer.setTimeout(timeoutId, timeout);
		return timeoutId;
	}
	setInterval(callback, timeout) {
		const intervalId = ++this.uniqueId;
		this.callbacks[intervalId] = {
			callback: callback,
			interval: true,
			timeout: timeout
		};
		RNTimer.setInterval(intervalId, timeout);
		return intervalId;
	}
	clearInterval(intervalId) {
		if (this.callbacks[intervalId]) {
			delete this.callbacks[intervalId];
			RNTimer.clearInterval(intervalId);
		}
	}
};

export default new myTimer();
