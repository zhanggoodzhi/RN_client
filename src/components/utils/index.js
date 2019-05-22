import {
    Dimensions,
    PixelRatio,
    ToastAndroid
} from 'react-native';
import EEmitter from 'events';
const {
    width,
    height
} = Dimensions.get('window');
console.log('宽高', width, height);
console.log('PixelRatio', PixelRatio.get());
export const WIDTH = width;
export const HEIGHT = height;
export const COLOR = {
    theme: '#1bb871',
    orange: '#ff7831',
    gray: '#d2d2d2'
}

export const BRAND = {
    logoImg: require('../../../resource/img/login_logo.png'),
    // logoImg: require('../../../resource/img/login_acer_logo.png'),
    topImg: require('../../../resource/img/logo1.png'),
    // topImg: require('../../../resource/img/logo2.png'),
}
export const DEFAULT_IP = '...';
const uiWidth1 = 1024;
const uiWidth = 1280;
export const SCALE2 = Math.max(width, height) / 640;
export const SCALE1 = Math.max(width, height) / uiWidth1;
export const SCALE = Math.max(width, height) / uiWidth;
console.log('适配比例', SCALE);
export const EventEmitter = new EEmitter();
export const getAnswerColor4 = (score) => {
    if (score < 1.5) {
        return '#fb2401'
    } else if (score < 2.5) {
        return '#457daf'
    } else if (score < 3.5) {
        return '#fd8d06'
    } else if (score >= 3.5) {
        return '#1cb870'
    }
}
export const getAnswerColorText4 = (score) => {
    if (score < 1.5) {
        return '差'
    } else if (score < 2.5) {
        return '中'
    } else if (score < 3.5) {
        return '良'
    } else if (score >= 3.5) {
        return '优'
    }
}
export const getAnswerColor100 = (percent) => {
    if (percent < 0.55) {
        return '#fb2401'
    } else if (percent < 0.70) {
        return '#457daf'
    } else if (percent < 0.85) {
        return '#fd8d06'
    } else if (percent >= 0.85) {
        return '#1cb870'
    }
}

export const formatAreaType = (areaType) => {
    if (areaType == 3 || areaType == 22 || areaType == 7 || areaType == 9 || areaType == 10) {
        return 'speak'
    } else if (areaType == 2 || areaType == 1 || areaType == 5 || areaType == 18) {
        return 'listen'
    } else if (areaType == 25 ) {
        return 'fill&speak'
    }else if (areaType == 27) {
        return 'fill'
    }
}
// 不确定是数组还是对象，转换成对象
export const getObj = (d) => {
    if (d.length) {
        return d[0];
    } else {
        return d;
    }
}
// 是否要整个question切换(相对于切换content)
export const ifSwitchQuestion = (areaType) => {
    if (areaType == 2 || areaType == 25 || areaType == 22 || areaType == 27 || areaType == 7) {
        return true;
    }
    return false;
}
export const toast = (text) => {
    ToastAndroid.showWithGravityAndOffset(text, ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 50 * SCALE);
}
export const NoDoublePress = {
    lastPressTime: 1,
    onPress(callback) {
        let curTime = new Date().getTime();
        if (curTime - this.lastPressTime > 1500) {
            this.lastPressTime = curTime;
            callback();
        }
    },
};

ifFillCorrectAnswer = (currentAnswer, answers) => {
    if (answers.length) {
        for (const v of answers) {
            if (currentAnswer === v.content.trim()) {
                return true;
            }
        }
    } else {
        if (currentAnswer === answers.content.trim()) {
            return true;
        }
    }
    return false;
}

export const getContentScore = (area, question, content) => {
    if (formatAreaType(area.type) === 'speak') {
        if (content.recordResult) {
            const result = content.recordResult;
            const percent = result && (result.overall / result.rank);
            return Number(getObj(content.score).content * percent).toFixed(1);
        }
    } else if (formatAreaType(area.type) === 'listen') {
        if (content.selected === content.answers.answer.content) {
            return getObj(content.score).content;
        }
    } else {
        if (content.recordResult) {
            const result = content.recordResult;
            const percent = result && (result.overall / result.rank);
            return Number(getObj(content.score).content * percent).toFixed(1);
        } else {
            if (ifFillCorrectAnswer(content.currentAnswer, content.answers.answer)) {
                return getObj(content.score).content;
            }
        }
    }
    return 0;
}