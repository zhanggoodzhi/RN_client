import { DeviceEventEmitter, NativeModules } from 'react-native';
import { EventEmitter } from '../utils/index';
const ScoreModule = NativeModules.ScoreModule;

DeviceEventEmitter.addListener('recordresult', function (e) {
    EventEmitter.emit('recordresult', e);
});

DeviceEventEmitter.addListener('volum', function (e) {
    EventEmitter.emit('volum', e.volum);
});

DeviceEventEmitter.addListener('recorderror', function (e) {
    console.log('recorderror');
});
export const loadAllResOncce = ScoreModule.loadAllResOncce;
export const initAIEngine = ScoreModule.initAIEngine;
export const recordStart = ScoreModule.recordStart;
export const recordStop = ScoreModule.recordStop;
export const destroy = ScoreModule.destroy;
