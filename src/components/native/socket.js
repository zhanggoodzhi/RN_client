import { DeviceEventEmitter, NativeModules, Alert, ToastAndroid } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { SCALE, EventEmitter, toast } from '../../components/utils';
const TcpSockets = NativeModules.TcpSockets;
// TcpSockets.destroy(1);
let connectTimer = null;
let canExam;
function _connectPaperServer(ip) {
    console.log('连接试卷服务器', ip);
    TcpSockets.connect(2, ip, 19090);
}

function formatPaper(paperData) {
    const newPaperData = { ...paperData };
    const newAreas = [];
    if (newPaperData.areas.area.length) {
        newPaperData.areas.area.forEach((v) => {
            // 过滤未开发题型
            if (
                v.type == '3'
                || v.type == '22'
                // || v.type == '14'
                // || v.type == '24'
                || v.type == '2'
                // || v.type == '7'
                // || v.type == '25'
            ) {
                newAreas.push(formatArea(v));
            }
        });
    } else {
        newAreas.push(formatArea(newPaperData.areas.area));
    }
    if (!newAreas.length) {
        canExam = false;
    } else {
        canExam = true;
    }
    newPaperData.areas = newAreas;
    return newPaperData;
}

function formatArea(area) {
    const newArea = { ...area };
    const newQuestions = [];
    if (area.questions.question.length) {
        area.questions.question.forEach((v) => {
            newQuestions.push(formatQuestion(v));
        });
    } else {
        newQuestions.push(formatQuestion(area.questions.question));
    }
    newArea.questions = newQuestions;
    return newArea;
}

function formatQuestion(question) {
    const newQuestion = { ...question };
    const newContents = [];
    if (question.contents.content.length) {
        question.contents.content.forEach((v) => {
            newContents.push(v);
        });
    } else {
        newContents.push(question.contents.content);
    }
    newQuestion.contents = newContents;
    return newQuestion;
}

export function connect(ip) {
    console.log('发起连接', ip);
    TcpSockets.connect(1, ip, 9090);
    EventEmitter.emit('connecting', 1);
    // TcpSockets.listen(1, '10.0.70.75', 9091);
}

export function destroy(ip) {
    console.log('销毁连接', ip);
    TcpSockets.destroy(1);
    // TcpSockets.listen(1, '10.0.70.75', 9091);
}
export function end(ip) {
    console.log('结束连接', ip);
    TcpSockets.end(1);
    // TcpSockets.listen(1, '10.0.70.75', 9091);
}
export function destroyPaperServer() {
    console.log('销毁试卷服务器连接');
    TcpSockets.destroy(2);
    // TcpSockets.listen(1, '10.0.70.75', 9091);
}

export const connectPaperServer = (ip) => {
    _connectPaperServer(ip);
}

export const bindEvents = () => {
    DeviceEventEmitter.addListener('connection', function (e) {
        console.log('服务器信息', e);
    });

    DeviceEventEmitter.addListener('connect', function (e) {
        console.log('连接信息', e);
        if (e.id === 1) {
            BackgroundTimer.clearInterval(connectTimer);
            connectTimer = null;
            EventEmitter.emit('connectSuccess');
        }
        if (e.id === 2) {
            TcpSockets.downloadsocket(2);
            EventEmitter.emit('connectPaperServerSuccess');
        }
    });

    DeviceEventEmitter.addListener('data', function (e) {
        // console.log('origin', e);
        let obj;
        obj = JSON.parse(e.data);
        if (obj.error) {
            let alertText = '';
            switch (obj.error.errorcode) {
                case '1':
                    alertText = '该学号不存在，请重新输入！';
                    break;
                case '2':
                    alertText = '该学号已登录，请重新输入或者联系监考教师！';
                    break;
                case '3':
                    alertText = '现在还不允许登录！';
                    break;
                case '4':
                    alertText = '该学生已完成考试，请重新输入或联系监考老师！';
                    break;
                    alertText = `错误码：${obj.error.errorcode}`;
                default: break;
            }
            toast(alertText);
            // Alert.alert(
            //     '提示',
            //     alertText,
            //     [
            //         { text: '确定' },
            //     ],
            //     { cancelable: false }
            // )
            console.log(obj);
            EventEmitter.emit('dataError', formatData);
            return;
        }
        if (!obj.resbody) {
            return;
        }
        // 试卷列表特殊处理
        if (obj.rescommand === '46') {
            obj.resbody = obj.resbody.replace(/\\/g, '/');
            obj.resbody = obj.resbody.slice(4);
        }
        // 更新特殊处理
        if (obj.rescommand === '44') {
            obj.resbody = obj.resbody.slice(4);
        }
        // 获取座位号特殊处理
        if (obj.rescommand === '52') {
            obj.resbody = obj.resbody.slice(4);
        }
        const formatData = {
            command: obj.rescommand,
            data: JSON.parse(obj.resbody),
            path: e.path
        }
        // console.log('数据', formatData);        
        //排除心跳返回
        if (formatData.command !== '1') {
            console.log('数据', formatData);
        }
        if (formatData.command === '1') {
            EventEmitter.emit('setLoginStatus', formatData);
        }
        // 允许登录
        if (formatData.command === '6') {
            console.log('event', EventEmitter);
            EventEmitter.emit('canLogin');
        }
        // 考试机设置座位号
        if (formatData.command === '30') {
            console.log('监考机设置座位号');
            EventEmitter.emit('setSeat', formatData.data);
        }
        // 设置座位号成功
        if (formatData.command === '31') {
            console.log('设置座位号成功');
            // EventEmitter.emit('getSeat', formatData.data);
        }
        // 静默登录成功
        if (formatData.command === '33') {
            EventEmitter.emit('silentLoginSuccess', formatData.data);
        }
        // 登录
        if (formatData.command === '9') {
            EventEmitter.emit('login', formatData.data);
        }
        // 确认登录
        if (formatData.command === '13') {
            EventEmitter.emit('sureLogin', formatData.data);
        }
        // 下载试卷
        if (formatData.command === '21') {
            console.log('试卷解析前', formatData.data.paper);
            const paperData = formatPaper(formatData.data.paper);
            console.log('试卷解析后，', paperData);
            // console.log('试卷解析后，', JSON.stringify(paperData));
            // paperData.areas[0].questions.splice(0, 3);
            EventEmitter.emit('paperDownloaded', {
                data: paperData,
                path: formatData.path
            });
        }
        // 开始考试
        if (formatData.command === '22') {
            if (canExam) {
                EventEmitter.emit('startExam');
            } else {
                toast('试卷未下载或没有已开发的题型,无法进行考试');
                // Alert.alert(
                //     '提示',
                //     '试卷未下载或没有已开发的题型,无法进行考试',
                //     [
                //         { text: '确定' },
                //     ],
                //     { cancelable: false }
                // )
            }
        }
        // 结束考试
        if (formatData.command === '24') {
            EventEmitter.emit('endExam');
        }
        // 上传成功
        if (formatData.command === '27') {
            EventEmitter.emit('uploadSuccess');
        }
        // 标记练习成功
        if (formatData.command === '4') {
            EventEmitter.emit('resetApp');
        }
        // 重置登录
        if (formatData.command === '10') {
            EventEmitter.emit('resetApp');
        }
        // // 获取试卷列表
        // if (formatData.command === '41') {
        //     EventEmitter.emit('getPaperList', formatData.data);
        // }
        // 获取试卷列表
        if (formatData.command === '46') {
            EventEmitter.emit('getPaperList', formatData.data);
        }
        // 更新数据
        if (formatData.command === '44') {
            EventEmitter.emit('getUpdateInfo', formatData.data);
        }
        // 关闭学生机
        if (formatData.command === '42') {
            EventEmitter.emit('exitApp');
        }
         // 获取上传的路径
         if (formatData.command === '49') {
            EventEmitter.emit('getUploadPath',formatData.data);
        }
         // 获取座位号
         if (formatData.command === '52') {
            EventEmitter.emit('getSeat',formatData.data);
        }
    });

    DeviceEventEmitter.addListener('close', function (e) {
        console.log('connectClose', e);
    });

    DeviceEventEmitter.addListener('error', function (e) {
        console.log('connectError', e);
        EventEmitter.emit('connectError', e.id);
    });
}

export const send = (command, data) => {
    const obj = {
        reqcommand: command,//命令
        reqbody: data
    };
    // if (command !== 0) {
    //     console.log('执行write命令', command, '传输的数据',JSON.stringify(obj));
    // }
    TcpSockets.write(1, JSON.stringify(obj), () => {
        if (obj.reqcommand !== 0) {
            console.log('发送1', JSON.stringify(obj), '解析后', obj);
        }
    });
    // if (command !== 0) {
    //     console.log('write命令结束');
    // }
};

export const send2 = (command, data) => {
    const obj = {
        reqcommand: command,//命令
        reqbody: data
    };
    TcpSockets.write(2, JSON.stringify(obj), () => {
        if (obj.reqcommand !== 0) {
            console.log('发送2', JSON.stringify(obj), '解析后', obj);
        }
    });
};
