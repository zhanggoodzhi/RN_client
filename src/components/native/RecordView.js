import { PropTypes } from 'prop-types';
import { DeviceEventEmitter, requireNativeComponent, View, UIManager, findNodeHandle } from 'react-native';
import { EventEmitter } from '../../components/utils';

var props = {
    name: 'RecordView',
    propTypes: {
        ViewWidth: PropTypes.number,
        ViewHeight: PropTypes.number,
        CanvasColor: PropTypes.number,
        PaintColor: PropTypes.number,
        ...View.propTypes // 包含默认的View的属性
    },
};
/**
export const moveToOrigin = (ref) => {
    UIManager.dispatchViewManagerCommand(
        findNodeHandle(ref),
        UIManager.RecordView.Commands.moveToOrigin,
        [],
    );
}
**/
export const startDraw = (ref,value1,value2,value3) => {
    if (ref) {
        console.log('startDraw');
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(ref),
            UIManager.RecordView.Commands.startDraw,
            [value1,value2,value3],
        );
    }
}
export const stopDraw = (ref,ifCancel) => {
    if (ref) {
        console.log('发送');
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(ref),
            UIManager.RecordView.Commands.stopDraw,
            [ifCancel],
        );
    }
}
export const clearDraw = (ref) => {
    if (ref) {
        console.log('清除画布');
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(ref),
            UIManager.RecordView.Commands.clearDraw,
            [],
        );
    }
}
/**
export const setXpoint = (ref, value) => {
    console.log('setXpoint');
    UIManager.dispatchViewManagerCommand(
        findNodeHandle(ref),
        UIManager.RecordView.Commands.set_xpoint,
        [value],
    );
    console.log('发送命令成功');
}
**/
//export const setVolum = (ref, value) => {
//    // console.log('setVolum');
//    UIManager.dispatchViewManagerCommand(
//        findNodeHandle(ref),
//        UIManager.RecordView.Commands.set_volum,
//        [value],
//    );
//}


//export const startRecord = (ref) => {
//    console.log('startRecord');
//    UIManager.dispatchViewManagerCommand(
//        findNodeHandle(ref),
//        UIManager.RecordView.Commands.start_record,
//        [],
//    );
//}
export const setRecordTimes = (ref, value) => {
    console.log('record_time_length');
    UIManager.dispatchViewManagerCommand(
        findNodeHandle(ref),
        UIManager.RecordView.Commands.record_time_length,
        [value],
    );
}
/**
export const Test = (ref) => {
    console.log('record_time_length');
    UIManager.dispatchViewManagerCommand(
        findNodeHandle(ref),
        UIManager.RecordView.Commands.test,
        [],
    );
}
**/

DeviceEventEmitter.addListener('changestate_recording', function () {
    EventEmitter.emit('changestate_recording');
});
DeviceEventEmitter.addListener('countdown', function (value) {
   EventEmitter.emit('countdown',value);
});
DeviceEventEmitter.addListener('stopDrawFromNative', function (value) {
    EventEmitter.emit('stopDrawFromNative',value);
});


export default requireNativeComponent('RecordView', props);