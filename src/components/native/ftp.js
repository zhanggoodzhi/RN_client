import {
    DeviceEventEmitter,
    NativeModules
} from 'react-native';
import {
    EventEmitter
} from '../utils/index';
import {
    getObj
} from '../utils'
import * as socket from '../../components/native/socket';
const FtpModule = NativeModules.FtpModule;

function formatPaper(paperData) {
    const newPaperData = { ...paperData
    };
    const newAreas = [];
    if (newPaperData.areas.area.length) {
        newPaperData.areas.area.forEach((v) => {
            // 过滤未开发题型
            if (
                v.type == '3'
                // || v.type == '14'
                // || v.type == '24'
                ||
                v.type == '22' ||
                v.type == '2' ||
                v.type == '7' ||
                v.type == '25' ||
                v.type == '27' ||
                v.type == '1' ||
                v.type == '5' ||
                v.type == '9' ||
                v.type == '10' ||
                v.type == '18'
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
    const newArea = { ...area
    };
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
    const newQuestion = { ...question
    };
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

DeviceEventEmitter.addListener('paperdata', function (e) {
    console.log('ftp数据', e, '解析后', JSON.parse(e.data));
    if (JSON.parse(e.data).error) {
        console.log(JSON.parse(e.data).error);
        EventEmitter.emit('downloadFailed');
        return;
    }
    const str = JSON.parse(e.data).resbody;
    const formatData = JSON.parse(str);
    console.log('试卷解析前', formatData.paper);
    const paperData = formatPaper(formatData.paper);
    // console.log('试卷解析后，', JSON.stringify(paperData));
    paperData.areas.forEach((v, i) => {
        v.questions.forEach((sv, si) => {
            let score = 0;
            sv.contents.forEach(ssv => {
                score += Number(getObj(ssv.score).content);
            });
            paperData.areas[i].questions[si].score = score;
        })
    });
    console.log('试卷解析后，', paperData);
    EventEmitter.emit('ftpDownloaded', {
        data: paperData,
        path: e.path
    });
});

export const downloadPaper = (ip, path, paperId, lm) => {
    console.log('正在进行ftp下载', ip, path.replace(/\/\//g, '\\\\'), paperId, lm);
    return FtpModule.downloadPaper(ip, path.replace(/\/\//g, '\\\\'), paperId, JSON.stringify(lm));
}
DeviceEventEmitter.addListener('DownAPK.Loading', function (e) {
    console.log('updateLoading', e);
    EventEmitter.emit('updateLoading', e);
});

DeviceEventEmitter.addListener('DownAPK.Success', function (e) {
    console.log('updateSuccess', e);
    EventEmitter.emit('updateSuccess', e);
});

DeviceEventEmitter.addListener('DownAPK.Error', function (e) {
    console.log('updateError', e);
    EventEmitter.emit('updateError', e);
});

export const uploadAnswer = (ip, paperData, path) => {
    socket.send('16', {
        Status: parseInt(8002, 16),
        AreaIndex: 0,
        QuestionIndex: 0,
        ContentIndex: 0,
        Behavior: 0
    });
    console.log('正在上传答案', ip, paperData, path);
    return FtpModule.uploadAnswer(ip, JSON.stringify(paperData), path);
    // setTimeout(() => {
    //     EventEmitter.emit('uploadError');
    // }, 2000);
}

DeviceEventEmitter.addListener('UpLoadAnw.Success', function () {
    console.log('uploadSuccess');
    socket.send('16', {
        Status: parseInt(8003, 16),
        AreaIndex: 0,
        QuestionIndex: 0,
        ContentIndex: 0,
        Behavior: 0
    });
    EventEmitter.emit('uploadSuccess');
    // console.log('uploadError');
    // EventEmitter.emit('uploadError');
});

DeviceEventEmitter.addListener('UpLoadAnw.Error', function (e) {
    // socket.send('16', {
    //     Status: parseInt(8001, 16),
    //     AreaIndex: 0,
    //     QuestionIndex: 0,
    //     ContentIndex: 0,
    //     Behavior: 0
    // });
    console.log('uploadError', e);
    EventEmitter.emit('uploadError');
});

export const downloadApk = (ip, path, fileName) => {
    console.log('正在进行更新', ip, path, fileName);
    return FtpModule.downloadApk(ip, path, fileName);
}