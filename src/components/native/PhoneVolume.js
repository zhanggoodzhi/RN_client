import { NativeModules, DeviceEventEmitter } from 'react-native';
import { EventEmitter } from '../utils/index';
const PhoneVolume = NativeModules.PhoneVolume;
PhoneVolume.registerVolumReceiver(1, 2);
DeviceEventEmitter.addListener('CurrentVolum', function (CurrentVolum) {
    EventEmitter.emit('CurrentVolum', CurrentVolum / 15);
});