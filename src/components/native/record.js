import { DeviceEventEmitter, NativeModules } from 'react-native';
import { toast } from '../../components/utils';
import { EventEmitter } from '../utils/index';
const Record = NativeModules.Record;

export const startRecord = (guid, cb) => {
    Record.startRecord(guid, cb);
}

DeviceEventEmitter.addListener('volum', function (e) {
    EventEmitter.emit('volum', e.volum);
});

DeviceEventEmitter.addListener('recorderror', function (e) {
    console.log('recorderror', e);
    toast('网络状态异常，请检查后重试！');
});

export const stopRecord = Record.stopRecord;

