import { DeviceEventEmitter, NativeModules } from 'react-native';
import { EventEmitter } from '../utils/index';
const UpdateJsAndResource = NativeModules.UpdateJsAndResource;

DeviceEventEmitter.addListener('DownJS.Loading', function (e) {
    console.log('jsUpdateLoading', e);
    EventEmitter.emit('jsUpdateLoading', e);
});

DeviceEventEmitter.addListener('DownJS.Success', function (e) {
    console.log('jsUpdateSuccess', e);
    EventEmitter.emit('jsUpdateSuccess', e);
});

DeviceEventEmitter.addListener('DownJS.Error', function (e) {
    console.log('jsUpdateError', e);
    EventEmitter.emit('jsUpdateError', e);
});

// cb 参数 true为需要更新
export const checkJSVersion = (ip, cb) => {
    console.log('检测JS更新');
    UpdateJsAndResource.checkJSVersion(ip, cb);
}
export const downloadJS = UpdateJsAndResource.downloadJS;
