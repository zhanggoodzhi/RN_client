import React, { Component } from 'react';
import { ScrollView, InteractionManager, Slider, StyleSheet, View, Text, TextInput, Image, Button, ART, Path, processColor, PanResponder, ViewPagerAndroid, TouchableOpacity, Animated, StatusBar, ImageBackground } from 'react-native';
import { NoDoublePress, COLOR, SCALE, SCALE2, SCALE1, EventEmitter, formatAreaType, WIDTH, ifSwitchQuestion, getContentScore, HEIGHT } from '../../components/utils';
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'
import * as prompt from '../../components/prompt';
import Modal from "react-native-modalbox";
import * as areaComponents from '../../components/trainArea';
import * as components from '../../components/ui';
import * as answerComponents from '../../components/trainAnswer';
import { uploadAnswer } from '../../components/native/ftp';
import * as socket from '../../components/native/socket';
import * as scoreModule from '../../components/native/score';
import * as soundComponent from '../../components/sound';
import { config } from '../../components/native/channel';
import BackgroundTimer from 'react-native-background-timer';
import myTimer from '../../components/utils/timerutil';
import TimeCountView from './TimeCountView';
// import Slider from "react-native-slider";
import * as lodash from 'lodash';
import RecordView, { startDraw, stopDraw, clearDraw, setRecordTimes } from '../../components/native/RecordView';
// var Popover = require('@taw/react-native-popover');
const earImg = require('../../../resource/img/tx_earphone.png');
const cutEarImg = require('../../../resource/img/ksms_earphone.png');
const maxVolum = 70;
const chartHeight = 42 * SCALE;
const chartWidth = 306 * SCALE;
const volumPercent = chartHeight / (2 * maxVolum);
let count = 0;
let getServerVolumLength = 1;
// 接收服务器返回的数组
let volumArr = [];
// 绘图用的总数组
let ARTArr = [];
let ifInit = false;
let ifsetVolume = false;// 防止滑条设置音量后，系统监听音量又设置滑条
let listenVolumeCount = 0; //音量键监听会返回3次

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            number: 5,
            smallCountSecond: 0,
            isVisible: false,
            buttonRect: {},
            value: 0,
            systemVolume: 0,
            currentTime: '',
            hour: '',
            minute: '',
            second: '',
            xPoint: 0,
            yPoint: 0,
            ifFixed: false,// 答案解析的返回练习
            bigImage: null,
            soundPopoverOpacity: new Animated.Value(0),
            soundPopoverVisible: false
        }
        this.swipeId = 0;
        this.timerInterval = 100;
        this.ifCancel = false;
        this.myTimer = null;
        this.trainTimer = null;
        this.saveSystemTime = 0;
        this.volum = 0;
        this.ifUploaded = false;
        this.ifJump = false;
        this.path = new ART.Path();
        this.currentPage = 0;
        this.viewPager = null;
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
                this.hideSoundPopover();
            },
        });
        this._panResponderPower = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
                this.hideSoundPopover();
            },
        });
    }

    startdraw(recordjson, coretype, answerid) {
        return new Promise((resolve) => {
            const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
            const question = paperData.areas[areaIndex].questions[questionIndex];
            let content = question.contents[contentIndex];
            if (paperData.areas[areaIndex].type === '25') {
                content = question.contents[question.contents.length - 1];
            }
            // const newAnswer = { ...this.props.paperAnswer };

            // let ifAlready = false;
            // newAnswer.recordguid.forEach((v, i) => {
            //     if (content.guid === v.guid) {
            //         newAnswer.recordguid[i].answer = content.guid + '.mp3',
            //             ifAlready = true;
            //     }
            // });initAIEngine
            // if (!ifAlready) {
            //     newAnswer.recordguid.push({
            //         guid: content.guid,
            //         answer: content.guid + '.mp3',
            //         score: getContentScore(paperData.areas[areaIndex], question, content)
            //     });
            // }
            // this.props.changePaperAnswer(newAnswer);
            let seconds = Number(content.answerseconds||content.answersecond);
            if (paperData.areas[areaIndex].type === '25') {
                seconds = Number(question.contents[question.contents.length - 1].answerseconds||content.answersecond)
            }
            // const seconds = 500;
            getServerVolumLength = 1;
            console.log('开始录音', seconds + '秒');
            getServerVolumLength = 1;
            //if (seconds < 10) {
            //   this.timerInterval = 50;
            //}
            this.setState({
                smallCountSecond: seconds
            });
            // var loopCount = seconds * 1000 / this.timerInterval;
            this.myTimer && myTimer.clearInterval(this.myTimer);
            setRecordTimes(this.refs.nativeRecordView, seconds * 1000);
            //startDraw(this.refs.nativeRecordView,'text1',222,"text2");
            startDraw(this.refs.nativeRecordView, recordjson, coretype, answerid);
        });
    }

    startRecord() {
        return new Promise((resolve) => {
            const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
            const question = paperData.areas[areaIndex].questions[questionIndex];
            let content = paperData.areas[areaIndex].questions[questionIndex].contents[contentIndex];
            if (paperData.areas[areaIndex].type == '25') {
                content = paperData.areas[areaIndex].questions[questionIndex].contents[question.contents.length - 1];
            }
            this.ifCancel = false;
            let seconds = Number(content.answerseconds||content.answersecond);// 后面的兼容老版题型
            const areaType = this.props.paperData.areas[this.props.areaIndex].type;


            setTimeout(() => {
                if (areaType === '3') {
                    let text = content.text;

                    console.log('录音参数', JSON.stringify({
                        duration: seconds * 1000,
                        reftext: text
                    }))

                    const recordjson = JSON.stringify({
                        duration: seconds * 1000,
                        reftext: text
                    });
                    const coretype = "en_pred_score"
                    const answerid = content.guid
                    this.startdraw(recordjson, coretype, answerid);

                } else if (areaType === '22' || areaType === '7') {
                    const obj = {
                        qid: content.guid,
                        role: 'b',
                        lmTextList: paperData.areas[areaIndex].questions[questionIndex].contents[contentIndex].refrencetexts.refrencetext.map((v) => {
                            return {
                                text: v.content,
                                answer: '1',
                                active: "1",
                                role: "b"
                            }
                        })
                    };
                    console.log('录音参数', JSON.stringify({
                        duration: seconds * 1000,
                        reftext: obj
                    }));
                    const recordjson = JSON.stringify({
                        duration: seconds * 1000,
                        reftext: obj
                    });
                    const coretype = "en_scne_exam"
                    const answerid = content.guid
                    this.startdraw(recordjson, coretype, answerid);

                } else if (areaType === '25') {
                    const obj = {
                        qid: content.guid,
                        lmTextList: areaType === '9' ? [{ text: content.refrencetexts.refrencetext.content, answer: '1' }] : content.refrencetexts.refrencetext.map((v) => {
                            return {
                                text: v.content,
                                answer: '1',
                            }
                        })
                    };
                    console.log('录音参数', JSON.stringify({
                        duration: seconds * 1000,
                        reftext: obj
                    }));
                    //                    scoreModule.recordStart(JSON.stringify({
                    //                        duration: seconds * 1000,
                    //                        reftext: guid
                    //                    }), 232, content.guid);
                    const recordjson = JSON.stringify({
                        duration: seconds * 1000,
                        reftext: obj
                    });
                    const coretype = "en_prtl_exam"
                    const answerid = content.guid
                    this.startdraw(recordjson, coretype, answerid);
                }else if ( areaType === '9' ) {
                    const obj = {
                        qid: content.guid,
                        lmTextList: content.refrencetexts.refrencetext.map((v) => {
                            return {
                                text: v.content,
                                answer: '1',
                            }
                        })
                    };
                    console.log('录音参数', JSON.stringify({
                        duration: seconds * 1000,
                        reftext: obj
                    }));

                    const recordjson = JSON.stringify({
                        duration: seconds * 1000,
                        reftext: obj
                    });
                    const coretype = "en_pict_exam"
                    const answerid = content.guid
                    this.startdraw(recordjson, coretype, answerid);
                }else if (areaType === '10') {
                    const obj = {
                        qid: content.guid,
                        lmTextList:content.refrencetexts.refrencetext.map((v) => {
                            return {
                                text: v.content,
                                answer: '1',
                            }
                        })
                    };
                    console.log('录音参数', JSON.stringify({
                        duration: seconds * 1000,
                        reftext: obj
                    }));
                    const recordjson = JSON.stringify({
                        duration: seconds * 1000,
                        reftext: obj
                    });
                    const coretype = "en_oesy_exam"
                    const answerid = content.guid
                    this.startdraw(recordjson, coretype, answerid);
                }
            }, 0);
        });
    }

    stopRecord() {
        console.log('停止录音');
        this.myTimer && myTimer.clearInterval(this.myTimer);
        stopDraw(this.refs.nativeRecordView, false);
        // console.log(this.refs.nativeRecordView);
        clearDraw(this.refs.nativeRecordView);
        //        scoreModule.recordStop();
        this.props.changeTrainRecordState('scoring');
        // 测试
        // this.testTimer && BackgroundTimer.clearTimeout(this.testTimer);
        // this.testTimer = BackgroundTimer.setTimeout(() => {
        //     if (this.ifCancel) {
        //         return;
        //     }
        //     console.log('1秒后恢复状态');
        //     this.props.changeTrainRecordState('free');
        // }, 1000);
    }

    formatDuring(mss) {
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((mss % (1000 * 60)) / 1000);
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return {
            hours,
            minutes,
            seconds
        }
    }
    showSoundPopover() {
        this.setState({
            soundPopoverVisible: true
        });
    }
    hideSoundPopover = () => {
        this.setState({
            soundPopoverVisible: false
        });
    }
    startTiming() {
        this.saveSystemTime = new Date().getTime();
        this.trainTimer && myTimer.clearInterval(this.trainTimer);
        this.trainTimer = myTimer.setInterval(() => {
            const currentTime = new Date().getTime();
            const trainTime = currentTime - this.saveSystemTime;
            const timeObj = this.formatDuring(trainTime);
            if (timeObj.hours === this.state.hour && timeObj.minutes === this.state.minute && timeObj.seconds === this.state.second) {
                return;
            }
            this.setState((state) => {
                const newTimeObj = {};
                if (timeObj.hours !== state.hour) {
                    newTimeObj.hour = timeObj.hours;
                }
                if (timeObj.minutes !== state.minute) {
                    newTimeObj.minute = timeObj.minutes;
                }
                if (timeObj.seconds !== state.second) {
                    newTimeObj.second = timeObj.seconds;
                }
                return newTimeObj;
            });
        }, 300);
    }
    cancelRecord() {
        console.log('取消录音');
        this.myTimer && myTimer.clearInterval(this.myTimer);
        stopDraw(this.refs.nativeRecordView, true);
        // console.log(this.refs.nativeRecordView);
        clearDraw(this.refs.nativeRecordView);
        // scoreModule.recordStop();
        this.props.changeTrainRecordState('free');
        this.ifCancel = true;
    }
    closeStopRadioModal() {
        this.refs.stopRadioModal.close();
    }
    openStopRadioModal() {
        this.refs.stopRadioModal.open();
    }
    closeImageModal() {
        this.refs.imageModal.close();
    }
    openImageModal(image) {
        this.setState({
            bigImage: image
        });
        this.refs.imageModal.open();
    }

    componentDidMount() {
        if (this.props.nav.routes[this.props.nav.routes.length - 1].routeName !== 'train') {
            return;
        }
        // this.refs.stopRadioModal.open();
        // this.refs.answerModal.open();
        // this.refs.cardModal.open();
        console.log('绑定Main事件');
        const { MarkAppKey, MarkSecret, MarkProvision } = this.props.userData;
        // scoreModule.loadAllResOncce(MarkAppKey, MarkSecret, MarkProvision, (ifLoadSourceSuccess) => {
        //     scoreModule.initAIEngine((ifInitSuccess) => {
        //         console.log('初始化成功');
        //     });
        // });
        soundComponent.getSystemVolume((volume) => {
            this.setState({
                systemVolume: volume
            });
        });
        // if (this.props.rightSideType === 'count') {
        //     this.reduceSecond();
        // }
        // if (this.props.rightSideType === 'exam') {
        //     this.myTimer && BackgroundTimer.myTimer.clearInterval(this.myTimer);
        //     this.myTimer =BackgroundTimer.setTimeout(() => {
        //         this.exam();
        //     }, 1000);
        // }
        EventEmitter.addListener('CurrentVolum', (volume) => {
            if (!ifsetVolume) {
                this.setState({ systemVolume: volume });
            }
            listenVolumeCount++;
            if (listenVolumeCount === 3) {
                listenVolumeCount = 0;
                ifsetVolume = false;
            }
        });
        EventEmitter.addListener('changestate_recording', () => {
            console.log('changestate_recording');
            if (this.ifCancel) {
                return;
            }
            this.props.changeTrainRecordState('recording');
            console.log("20180830", "JS变录音中状态");

        });
        EventEmitter.addListener('stopDrawFromNative', (value) => {
            console.log('stopDrawFromNative');
            console.log('结束');
            console.log('20180830', value);
            if (value) {
                console.log('20180830', '接收到通知录音结束-不需要评分');
                this.props.changeTrainRecordState('free');
            } else {
                console.log('20180830', '接收到通知录音结束-需要评分');
                this.props.changeTrainRecordState('scoring');
            }
            //this.stopRecord();
        });
        EventEmitter.addListener('countdown', (value) => {
            console.log('countdown', value);
            this.setState({
                smallCountSecond: value
            });
        });
        //        EventEmitter.addListener('volum', (volum) => {
        //            volumArr.push(volum);
        //
        //            if (volumArr.length == 10) {
        //                let volumall = 0;
        //                for (let i = 0; i < volumArr.length; i++) {
        //                    volumall = volumall + volumArr[i];
        //                }
        //                let volumx = volumall / volumArr.length;
        //                const yPoint = volumx * volumPercent || 0
        //
        //                // const yPoint = volumArr[0] * volumPercent || 0
        //                // console.log("yPointyPoint", volumArr);
        //                // console.log("yPointyPoint____", yPoint);
        //                // console.log(volumArr);
        //                volumArr = [];
        //                setVolum(this.refs.nativeRecordView, yPoint);
        //            }
        //        });

        EventEmitter.addListener('recordresult', (e) => {
            console.log('recordresult', e);
            if (this.ifCancel) {
                return;
            }
            console.log('未取消，继续');
            this.props.changeTrainRecordState('free');
            //录音评分
            const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
            const resultWrap = JSON.parse(e.result).jsonresult;
            const result = JSON.parse(resultWrap);
            console.log('录音评分', result);
            const newPaperData = { ...paperData };
            if (newPaperData.areas[areaIndex].type === '25') {
                const lastItem = newPaperData.areas[areaIndex].questions[questionIndex].contents.length - 1
                newPaperData.areas[areaIndex].questions[questionIndex].contents[lastItem].recordResult = result.result;
                newPaperData.areas[areaIndex].questions[questionIndex].contents[lastItem].stuRadioFilePath = JSON.parse(e.result).radiofilepath;
            } else {
                newPaperData.areas[areaIndex].questions[questionIndex].contents[contentIndex].recordResult = result.result;
                newPaperData.areas[areaIndex].questions[questionIndex].contents[contentIndex].stuRadioFilePath = JSON.parse(e.result).radiofilepath;
            }
            this.props.changePaperData(newPaperData);
            setTimeout(() => {
                const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
                const question = paperData.areas[areaIndex].questions[questionIndex];
                let content = question.contents[contentIndex];
                if (paperData.areas[areaIndex].type === '25') {
                    content = question.contents[question.contents.length - 1];
                }
                const newAnswer = { ...this.props.paperAnswer };
                let ifAlready = false;
                newAnswer.recordguid.forEach((v, i) => {
                    if (content.guid === v.guid) {
                        newAnswer.recordguid[i].answer = content.guid + '.mp3',
                            ifAlready = true;
                    }
                });
                if (!ifAlready) {
                    newAnswer.recordguid.push({
                        guid: content.guid,
                        answer: content.guid + '.mp3',
                        score: getContentScore(paperData.areas[areaIndex], question, content)
                    });
                }
                this.props.changePaperAnswer(newAnswer);
            }, 0);
            // const myScore = details[0].score;
            // const allScore =Number(paperData.areas[areaIndex].questions[questionIndex].contents[0].score[0].content);
        });
        EventEmitter.addListener('resetApp', () => {
            this.clearComponent();
        });
    }
    clearComponent() {
        this.cancelRecord();
        this.myTimer && myTimer.clearInterval(this.myTimer);
        this.trainTimer && myTimer.clearInterval(this.trainTimer);
        soundComponent.reset();
    }
    componentWillUnmount() {
        console.log('Main卸载');
        EventEmitter.removeAllListeners('CurrentVolum');
        EventEmitter.removeAllListeners('stopDrawFromNative');
        EventEmitter.removeAllListeners('countdown');
        EventEmitter.removeAllListeners('recordresult');
        EventEmitter.removeAllListeners('changestate_recording');
    }
    showPopover = () => {
        console.log('触发');
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: { x: px, y: py, width: width, height: height }
            });
        });
    }
    changeSoundSlider = lodash.debounce((value) => {
        // if (this.state.systemVolume !== 0 && value === 0) {
        //     this.setState({
        //         systemVolume: 0
        //     });
        //     return;
        // }
        // if (this.state.systemVolume === 0 && value !== 0) {
        //     this.setState({
        //         systemVolume: value
        //     });
        // }
        this.setState({
            systemVolume: value
        });
        ifsetVolume = true;
        soundComponent.changeSoundValue(value);
    }, 50)
    prePage = () => {
        const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
        const maxAreaIndex = paperData.areas.length - 1;
        const maxQuestionIndex = paperData.areas[maxAreaIndex].questions.length - 1;
        const maxContentIndex = paperData.areas[maxAreaIndex].questions[maxQuestionIndex].contents.length - 1;
        if ((paperData.areas[areaIndex].type == '22' || paperData.areas[areaIndex].type == '7') && contentIndex !== 0) {// 听对话或独白回答问题不滑页
            return;
        }
        if (areaIndex === 0 && questionIndex === 0 && contentIndex === 0) {
            return;
        }
        this.currentPage--;
        this.viewPager.setPage(this.currentPage);
    }
    ifCorrectAnswer(currentAnswer, answers) {
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
    nextPage = () => {
        const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
        const maxAreaIndex = paperData.areas.length - 1;
        const maxQuestionIndex = paperData.areas[maxAreaIndex].questions.length - 1;
        const maxContentIndex = paperData.areas[maxAreaIndex].questions[maxQuestionIndex].contents.length - 1;
        const currentQuestion = paperData.areas[areaIndex].questions[questionIndex];
        const currentMaxContentIndex = currentQuestion.contents.length - 1;
        if ((paperData.areas[areaIndex].type == '22' || paperData.areas[areaIndex].type == '7') && contentIndex !== currentMaxContentIndex) {// 听对话或独白回答问题不滑页
            return;
        }
        if (contentIndex === maxContentIndex &&
            questionIndex === maxQuestionIndex &&
            areaIndex === maxAreaIndex) {
            return;
        }
        this.currentPage++;
        this.viewPager.setPage(this.currentPage);
    }
    ifCorrectAnswer(currentAnswer, answers) {
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
    preEvent = (ifSlide) => {
        const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
        this.cancelRecord();
        this.props.resetSound();
        console.log('pre', areaIndex);
        const currentSwitchQuestionType = ifSwitchQuestion(paperData.areas[areaIndex].type);
        if (paperData.areas[areaIndex].type == '22' || paperData.areas[areaIndex].type == '7') {// 听对话或独白回答问题特殊处理
            if (ifSlide) {
                if (questionIndex === 0) {
                    const afterAreaIndex = areaIndex - 1;
                    if (ifSwitchQuestion(paperData.areas[afterAreaIndex].type)) {// 上一题切换question
                        const afterQuestionIndex = paperData.areas[afterAreaIndex].questions.length - 1;
                        this.props.setAreaIndex(afterAreaIndex);
                        this.props.setQuestionIndex(afterQuestionIndex);
                        this.props.setContentIndex(0);
                    } else {
                        const afterQuestionIndex = paperData.areas[afterAreaIndex].questions.length - 1;
                        const afterContentIndex = paperData.areas[afterAreaIndex].questions[afterQuestionIndex].contents.length - 1;
                        this.props.setAreaIndex(afterAreaIndex);
                        this.props.setQuestionIndex(afterQuestionIndex);
                        this.props.setContentIndex(afterContentIndex);
                    }
                } else {
                    this.props.setQuestionIndex(questionIndex - 1);
                    this.props.setContentIndex(0);
                }
            } else {
                if (contentIndex === 0) {
                    if (questionIndex === 0) {
                        const afterAreaIndex = areaIndex - 1;
                        if (ifSwitchQuestion(paperData.areas[afterAreaIndex].type)) {// 上一题切换question
                            const afterQuestionIndex = paperData.areas[afterAreaIndex].questions.length - 1;
                            this.props.setAreaIndex(afterAreaIndex);
                            this.props.setQuestionIndex(afterQuestionIndex);
                            this.props.setContentIndex(0);
                        } else {
                            const afterQuestionIndex = paperData.areas[afterAreaIndex].questions.length - 1;
                            const afterContentIndex = paperData.areas[afterAreaIndex].questions[afterQuestionIndex].contents.length - 1;
                            this.props.setAreaIndex(afterAreaIndex);
                            this.props.setQuestionIndex(afterQuestionIndex);
                            this.props.setContentIndex(afterContentIndex);
                        }
                    }
                    else {
                        const afterQuestionIndex = questionIndex - 1;
                        const afterContentIndex = paperData.areas[areaIndex].questions[afterQuestionIndex].contents.length - 1;
                        this.props.setQuestionIndex(afterQuestionIndex);
                        this.props.setContentIndex(afterContentIndex);
                    }
                } else {
                    this.props.setContentIndex(contentIndex - 1);
                }
            }
        } else if (currentSwitchQuestionType) { // 本题是切换question的
            if (questionIndex === 0) {
                const afterAreaIndex = areaIndex - 1;
                if (ifSwitchQuestion(paperData.areas[afterAreaIndex].type)) {// 上一题切换question
                    const afterQuestionIndex = paperData.areas[afterAreaIndex].questions.length - 1;
                    this.props.setAreaIndex(afterAreaIndex);
                    this.props.setQuestionIndex(afterQuestionIndex);
                    this.props.setContentIndex(0);
                } else {
                    const afterQuestionIndex = paperData.areas[afterAreaIndex].questions.length - 1;
                    const afterContentIndex = paperData.areas[afterAreaIndex].questions[afterQuestionIndex].contents.length - 1;
                    this.props.setAreaIndex(afterAreaIndex);
                    this.props.setQuestionIndex(afterQuestionIndex);
                    this.props.setContentIndex(afterContentIndex);
                }
            } else {
                this.props.setQuestionIndex(questionIndex - 1);
                this.props.setContentIndex(0);
            }
        } else {// 本题切换content
            if (contentIndex === 0) {
                if (questionIndex === 0) {
                    const afterAreaIndex = areaIndex - 1;
                    if (ifSwitchQuestion(paperData.areas[afterAreaIndex].type)) {// 上一题切换question
                        const afterQuestionIndex = paperData.areas[afterAreaIndex].questions.length - 1;
                        this.props.setAreaIndex(afterAreaIndex);
                        this.props.setQuestionIndex(afterQuestionIndex);
                        this.props.setContentIndex(0);
                    } else {
                        const afterQuestionIndex = paperData.areas[afterAreaIndex].questions.length - 1;
                        const afterContentIndex = paperData.areas[afterAreaIndex].questions[afterQuestionIndex].contents.length - 1;
                        this.props.setAreaIndex(afterAreaIndex);
                        this.props.setQuestionIndex(afterQuestionIndex);
                        this.props.setContentIndex(afterContentIndex);
                    }
                }
                else {
                    const afterQuestionIndex = questionIndex - 1;
                    const afterContentIndex = paperData.areas[areaIndex].questions[afterQuestionIndex].contents.length - 1;
                    this.props.setQuestionIndex(afterQuestionIndex);
                    this.props.setContentIndex(afterContentIndex);
                }
            } else {
                this.props.setContentIndex(contentIndex - 1);
            }
        }
        setTimeout(() => {
            socket.send('16', {
                Status: parseInt(4001, 16),
                AreaIndex: this.props.areaIndex + 1,
                QuestionIndex: 0,
                ContentIndex: 0,
                Behavior: 0
            });
        }, 0);
    }
    nextEvent = (ifSlide) => {
        const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
        const maxAreaIndex = paperData.areas.length - 1;
        const maxQuestionIndex = paperData.areas[maxAreaIndex].questions.length - 1;
        const maxContentIndex = paperData.areas[maxAreaIndex].questions[maxQuestionIndex].contents.length - 1;
        this.cancelRecord();
        this.props.resetSound();
        console.log('next', areaIndex);
        const currentSwitchQuestionType = ifSwitchQuestion(paperData.areas[areaIndex].type);
        if (paperData.areas[areaIndex].type == '22' || paperData.areas[areaIndex].type == '7') {// 听对话或独白回答问题特殊处理
            if (ifSlide) {
                if (questionIndex === paperData.areas[areaIndex].questions.length - 1) {
                    const afterAreaIndex = areaIndex + 1;
                    if (ifSwitchQuestion(paperData.areas[afterAreaIndex].type)) {// 下一题切换question
                        const afterQuestionIndex = 0;
                        this.props.setAreaIndex(afterAreaIndex);
                        this.props.setQuestionIndex(afterQuestionIndex);
                        this.props.setContentIndex(0);
                    } else {
                        const afterQuestionIndex = 0;
                        const afterContentIndex = 0;
                        this.props.setAreaIndex(afterAreaIndex);
                        this.props.setQuestionIndex(afterQuestionIndex);
                        this.props.setContentIndex(afterContentIndex);
                    }
                }
                else {
                    this.props.setQuestionIndex(questionIndex + 1);
                    this.props.setContentIndex(0);
                }
            } else {
                if (contentIndex === paperData.areas[areaIndex].questions[questionIndex].contents.length - 1) {
                    if (questionIndex === paperData.areas[areaIndex].questions.length - 1) {
                        const afterAreaIndex = areaIndex + 1;
                        if (ifSwitchQuestion(paperData.areas[afterAreaIndex]).type) {// 下一题切换question
                            const afterQuestionIndex = 0;
                            this.props.setAreaIndex(afterAreaIndex);
                            this.props.setQuestionIndex(afterQuestionIndex);
                            this.props.setContentIndex(0);
                        } else {
                            const afterAreaIndex = areaIndex + 1;
                            const afterQuestionIndex = 0;
                            const afterContentIndex = 0;
                            this.props.setAreaIndex(afterAreaIndex);
                            this.props.setQuestionIndex(afterQuestionIndex);
                            this.props.setContentIndex(afterContentIndex);
                        }
                    }
                    else {
                        const afterQuestionIndex = questionIndex + 1;
                        const afterContentIndex = 0;
                        this.props.setQuestionIndex(afterQuestionIndex);
                        this.props.setContentIndex(afterContentIndex);
                    }
                } else {
                    this.props.setContentIndex(contentIndex + 1);
                }
            }
        } else if (currentSwitchQuestionType) {// 本题是切换question的
            if (questionIndex === paperData.areas[areaIndex].questions.length - 1) {
                const afterAreaIndex = areaIndex + 1;
                if (ifSwitchQuestion(paperData.areas[afterAreaIndex].type)) {// 下一题切换question
                    const afterQuestionIndex = 0;
                    this.props.setAreaIndex(afterAreaIndex);
                    this.props.setQuestionIndex(afterQuestionIndex);
                    this.props.setContentIndex(0);
                } else {
                    const afterQuestionIndex = 0;
                    const afterContentIndex = 0;
                    this.props.setAreaIndex(afterAreaIndex);
                    this.props.setQuestionIndex(afterQuestionIndex);
                    this.props.setContentIndex(afterContentIndex);
                }
            }
            else {
                this.props.setQuestionIndex(questionIndex + 1);
                this.props.setContentIndex(0);
            }
        } else {
            if (contentIndex === paperData.areas[areaIndex].questions[questionIndex].contents.length - 1) {
                if (questionIndex === paperData.areas[areaIndex].questions.length - 1) {
                    const afterAreaIndex = areaIndex + 1;
                    if (ifSwitchQuestion(paperData.areas[afterAreaIndex]).type) {// 下一题切换question
                        const afterQuestionIndex = 0;
                        this.props.setAreaIndex(afterAreaIndex);
                        this.props.setQuestionIndex(afterQuestionIndex);
                        this.props.setContentIndex(0);
                    } else {
                        const afterAreaIndex = areaIndex + 1;
                        const afterQuestionIndex = 0;
                        const afterContentIndex = 0;
                        this.props.setAreaIndex(afterAreaIndex);
                        this.props.setQuestionIndex(afterQuestionIndex);
                        this.props.setContentIndex(afterContentIndex);
                    }
                }
                else {
                    const afterQuestionIndex = questionIndex + 1;
                    const afterContentIndex = 0;
                    this.props.setQuestionIndex(afterQuestionIndex);
                    this.props.setContentIndex(afterContentIndex);
                }
            } else {
                this.props.setContentIndex(contentIndex + 1);
            }
        }
        // if (contentIndex === paperData.areas[areaIndex].questions[questionIndex].contents.length - 1) {
        //     if (questionIndex === paperData.areas[areaIndex].questions.length - 1) {
        //         const afterAreaIndex = areaIndex + 1;
        //         const afterQuestionIndex = 0;
        //         const afterContentIndex = 0;
        //         this.props.setAreaIndex(afterAreaIndex);
        //         this.props.setQuestionIndex(afterQuestionIndex);
        //         this.props.setContentIndex(afterContentIndex);
        //     }
        //     else {
        //         const afterQuestionIndex = questionIndex + 1;
        //         const afterContentIndex = 0;
        //         this.props.setQuestionIndex(afterQuestionIndex);
        //         this.props.setContentIndex(afterContentIndex);
        //     }
        // } else {
        //     this.props.setContentIndex(contentIndex + 1);
        // }
        setTimeout(() => {
            socket.send('16', {
                Status: parseInt(4001, 16),
                AreaIndex: this.props.areaIndex + 1,
                QuestionIndex: 0,
                ContentIndex: 0,
                Behavior: 0
            });
        }, 0);
    }
    render() {
        // console.log(chartWidth, chartHeight, volumXGap, this.state.xPoint, this.state.yPoint);
        const {
            Surface,
            Shape,
            Path
        } = ART;
        const { hour, minute, second, finishCount, unFinishCount } = this.state;
        const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
        const maxAreaIndex = paperData.areas.length - 1;
        const maxQuestionIndex = paperData.areas[maxAreaIndex].questions.length - 1;
        const maxContentIndex = paperData.areas[maxAreaIndex].questions[maxQuestionIndex].contents.length - 1;
        const area = paperData.areas[areaIndex];
        const AreaComponent = areaComponents[`Area${area.type}`];
        const AnswerComponent = answerComponents[`Area${area.type}`];
        const question = area.questions[questionIndex];

        // console.log('main_paperData', paperData);


        let topTimeView = (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'absolute',
                left: 0,
                top: 25 * SCALE,
                alignItems: 'center',
                bottom: 0,
                right: 0,
                backgroundColor: 'transparent',
                zIndex: 9
            }}>
                <Text style={styles.timeItem}>{this.state.hour}</Text>
                <Text style={{ fontSize: 28 * SCALE, color: '#1ea366', marginHorizontal: 3 * SCALE }}>:</Text>
                <Text style={styles.timeItem}>{this.state.minute}</Text>
                <Text style={{ fontSize: 28 * SCALE, color: '#1ea366', marginHorizontal: 3 * SCALE }}>:</Text>
                <Text style={styles.timeItem}>{this.state.second}</Text>
            </View>
        );
        let finishBtn = (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        currentTime: this.refs.timeCountView.getTime()
                    });
                    this.refs.finishModal.open();
                    //   this.props.changeTrainType('uploadSuccess');

                }}
                style={{
                    position: 'absolute',
                    zIndex: 9,
                    top: 28 * SCALE,
                    right: 20 * SCALE,
                    width: 120 * SCALE,
                    height: 41 * SCALE,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#1ea366'
                }}
                activeOpacity={0.5}>
                <Image
                    style={{ width: 17 * SCALE, height: 19 * SCALE, marginRight: 9 * SCALE }}
                    source={require('../../../resource/img/tx_end.png')}>
                </Image>
                <Text
                    style={{
                        fontSize: 18 * SCALE,
                        color: 'white'
                    }}
                >
                    结束练习
                </Text>
            </TouchableOpacity>
        );
        getIndex = (page) => {
            let count = 0;
            for (let i = 0; i < paperData.areas.length; i++) {
                let v = paperData.areas[i];
                for (let si = 0; si < v.questions.length; si++) {
                    let sv = v.questions[si];
                    if (ifSwitchQuestion(v.type)) {
                        if (count == page) {
                            return {
                                areaIndex: i,
                                questionIndex: si,
                                contentIndex: 0
                            }
                        }
                        count++;
                    } else {
                        for (let ssi = 0; ssi < sv.contents.length; ssi++) {
                            if (count == page) {
                                return {
                                    areaIndex: i,
                                    questionIndex: si,
                                    contentIndex: ssi
                                }
                            }
                            count++;
                        }
                    }
                }
            }
        }
        getPage = (_i, _si, _ssi) => {
            let count = 0;
            let index;
            for (let i = 0; i < paperData.areas.length; i++) {
                let v = paperData.areas[i];
                for (let si = 0; si < v.questions.length; si++) {
                    let sv = v.questions[si];
                    if (ifSwitchQuestion(v.type)) {
                        if (_i === i && _si === si) {
                            index = count;
                            return index;
                        }
                        count++;
                    } else {
                        for (let ssi = 0; ssi < sv.contents.length; ssi++) {
                            let ssv = sv.contents[ssi];
                            if (_i === i && _si === si && _ssi === ssi) {
                                index = count;
                                return index;
                            }
                            count++;
                        }
                    }
                }
            }
            // paperData.areas.forEach((v, i) => {
            //     v.questions.forEach((sv, si) => {
            //         if (ifSwitchQuestion(v.type)) {
            //             if (_i === i && _si === si) {
            //                 index = count;
            //             }
            //             count++;
            //         } else {
            //             sv.contents.forEach((ssv, ssi) => {
            //                 count++;
            //                 if (_i === i && _si === si && _ssi === ssi) {
            //                 }
            //                 index = count;
            //             });
            //         }
            //     });
            // });
        }
        switch (config.channel) {
            case 'chivox':
                title = (
                    <View style={styles.header}>
                        <Image
                            style={{ width: 34 * SCALE, height: 34 * SCALE, marginRight: 9 * SCALE }}
                            source={require('../../../resource/img/logo1_small.png')}>
                        </Image>
                        <View style={{ flex: 0 }}>
                            <Text style={{ color: 'white', fontSize: 18 * SCALE }}>驰声英语听说校园版训练系统</Text>
                        </View>
                        {/* {topTimeView} */}
                        <TimeCountView ref="timeCountView"></TimeCountView>
                        {finishBtn}
                    </View>
                ); break;
            case 'acer':
                title = (
                    <View style={styles.header}>
                        <Image
                            style={{ width: 82 * SCALE, height: 20 * SCALE }}
                            source={require('../../../resource/img/logo2_small.png')}>
                        </Image>
                        <View style={{ flex: 0 }}>
                            <Text style={{ color: 'white', fontSize: 18 * SCALE }}>AES英语听说训练系统</Text>
                        </View >
                        {/* {topTimeView} */}
                        <TimeCountView ref="timeCountView"></TimeCountView>
                        {finishBtn}
                    </View>
                ); break;
        }

        let soundConfig = null;
        let changeAreaView = null;
        let questionCard = null;
        let timeCount = null;
        let recordBtn = null;
        let submitAnswer = null;
        let scorePopover = null;
        let detailView = null;
        const ifExpandHeight = (formatAreaType(area.type) === 'fill&speak' && !this.props.ifSection2) || formatAreaType(area.type) === 'fill'||formatAreaType(area.type) === 'listen' ? false : true;
        const ifPreventPreEvent = () => {
            if (paperData.areas[areaIndex].type == '22' || paperData.areas[areaIndex].type == '7') {
                if (areaIndex === 0 && questionIndex === 0 && contentIndex === 0) {
                    return true;
                }
            } else {
                if ((areaIndex === 0 && questionIndex === 0 && contentIndex === 0 && !ifSwitchQuestion(area.type)) || (areaIndex === 0 && questionIndex === 0 && ifSwitchQuestion(area.type))) {
                    return true;
                }
            }
            return false;
        }
        const ifPreventNextEvent = () => {
            if (paperData.areas[areaIndex].type == '22' || paperData.areas[areaIndex].type == '7') {
                if (contentIndex === maxContentIndex &&
                    questionIndex === maxQuestionIndex &&
                    areaIndex === maxAreaIndex) {
                    return true;
                }
            } else {
                if ((contentIndex === maxContentIndex &&
                    questionIndex === maxQuestionIndex &&
                    areaIndex === maxAreaIndex && !ifSwitchQuestion(area.type)) || (areaIndex === maxAreaIndex && questionIndex === maxQuestionIndex && ifSwitchQuestion(area.type))) {
                    return true;
                }
            }
            return false;
        }
        const ifHasAnswer = () => {
            if (ifSwitchQuestion(area.type)) {
                if (formatAreaType(area.type) === 'speak') {
                    let ifHasAnswer = false;
                    question.contents.forEach((v) => {
                        if (v.recordResult) {
                            ifHasAnswer = true;
                        }
                    });
                    return ifHasAnswer;
                } else if (formatAreaType(area.type) === 'listen') {
                    let ifHasAnswer = false;
                    question.contents.forEach((v) => {
                        if (v.selected) {
                            ifHasAnswer = true;
                        }
                    });
                    return ifHasAnswer;
                } else {
                    if (this.props.ifSection2 && area.type == '25') {
                        let ifHasAnswer = question.contents[question.contents.length - 1].recordResult ? true : false;
                        return ifHasAnswer;
                    } else {
                        let ifHasAnswer = false;
                        question.contents.forEach((v, i) => {
                            if (i !== question.contents.length - 1) {
                                if (v.currentAnswer !== undefined) {
                                    ifHasAnswer = true;
                                }
                            }
                        });
                        return ifHasAnswer;
                    }
                }
            } else {
                return question.contents[contentIndex].recordResult || question.contents[contentIndex].selected ? true : false
            }
        }
        switch (this.props.trainRecordState) {
            case 'free':
                if (ifHasAnswer()) {
                    detailView = (
                        <TouchableOpacity
                            onPress={() => {
                                this.hideSoundPopover();
                                this.refs.answerModal.open();
                                this.props.resetSound();
                            }}
                            style={{ position: 'absolute', left: 980 * SCALE, width: 100 * SCALE, alignItems: 'center' }}
                            activeOpacity={0.5}>
                            <Image
                                style={{ width: 26 * SCALE, height: 24 * SCALE, }}
                                source={require('../../../resource/img/tx_analyse.png')}>
                            </Image>
                            <Text style={{ fontSize: 16 * SCALE }}>答案解析</Text>
                        </TouchableOpacity>
                    );
                }
                soundConfig = (
                    <TouchableOpacity
                        onPress={() => {
                            this.state.soundPopoverVisible ?
                                this.hideSoundPopover() : this.showSoundPopover();
                        }}
                        style={{ alignItems: 'center', width: 100 * SCALE }}
                        activeOpacity={0.5}>
                        <Image
                            style={{ width: 30 * SCALE, height: 23 * SCALE, }}
                            source={require('../../../resource/img/tx_vol.png')}>
                        </Image>
                        <Text style={{ fontSize: 16 * SCALE }}>音量调节</Text>
                    </TouchableOpacity>
                );
                changeAreaView = (
                    <View style={{ width: 304 * SCALE, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.prePage();
                                this.preEvent();
                            }}
                            disabled={ifPreventPreEvent()}
                            activeOpacity={0.5}>
                            <Image
                                style={{ width: 44 * SCALE, height: 44 * SCALE, }}
                                source={
                                    ifPreventPreEvent() ?
                                        require('../../../resource/img/tx_dis_last.png')
                                        : require('../../../resource/img/tx_last.png')
                                }>
                            </Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.nextPage()
                                this.nextEvent();
                            }}
                            disabled={
                                ifPreventNextEvent()
                            }
                            activeOpacity={0.5}>
                            <Image
                                style={{ width: 44 * SCALE, height: 44 * SCALE, }}
                                source={
                                    ifPreventNextEvent() ?
                                        require('../../../resource/img/tx_dis_next.png')
                                        : require('../../../resource/img/tx_next.png')}
                            >
                            </Image>
                        </TouchableOpacity>
                    </View >
                );
                questionCard = (
                    <TouchableOpacity
                        onPress={() => {
                            this.refs.cardModal.open();
                        }}
                        style={{ alignItems: 'center', width: 100 * SCALE }}
                        activeOpacity={0.5}>
                        <Image
                            style={{ width: 25 * SCALE, height: 25 * SCALE, }}
                            source={require('../../../resource/img/tx_card.png')}>
                        </Image>
                        <Text style={{ fontSize: 16 * SCALE }}>答题卡</Text>
                    </TouchableOpacity>
                );
                recordBtn = (
                    <View style={{
                        zIndex: 11,
                        position: 'absolute',
                        width: 130 * SCALE,
                        height: 130 * SCALE,
                        left: 555 * SCALE,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white'
                    }}>
                        <Image
                            style={{ width: 140 * SCALE, height: 57 * SCALE, position: 'absolute', top: 0 }}
                            source={require('../../../resource/img/tx_img_halfround.png')}>
                        </Image>
                        <TouchableOpacity
                            onPress={() => {
                                NoDoublePress.onPress(() => {
                                    this.props.resetSound();
                                    this.startRecord()
                                });
                            }}
                            activeOpacity={0.5}>
                            <Image
                                style={{ width: 80 * SCALE, height: 80 * SCALE, }}
                                source={
                                    require('../../../resource/img/tx_record.png')
                                }>
                            </Image>
                        </TouchableOpacity>
                    </View>
                );
                submitAnswer = (
                    <TouchableOpacity
                        style={{
                            zIndex: 11,
                            position: 'absolute',
                            width: 150 * SCALE,
                            height: 48 * SCALE,
                            left: 542 * SCALE,
                            top: 25 * SCALE,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ff7831',
                            borderRadius: 24 * SCALE
                        }}
                        onPress={() => {
                            this.refs[`areaComponent${areaIndex}${questionIndex}0`].getWrappedInstance().submitAnswer();
                        }}
                        activeOpacity={0.5}>
                        <Text style={{ color: 'white' }}>提交答案</Text>
                    </TouchableOpacity>
                );
                break;
            case 'recording':
                timeCount = (
                    <View style={{ flexDirection: 'row', position: 'absolute', left: 699 * SCALE }}>
                        <Text style={{ fontSize: 10 * SCALE2 }}>倒计时</Text>
                        <Text style={{ fontSize: 10 * SCALE2, color: '#fe0000', paddingHorizontal: 5 * SCALE2 }}>{this.state.smallCountSecond}</Text>
                        <Text style={{ fontSize: 10 * SCALE2 }}>秒</Text>
                    </View>
                );
                recordBtn = (
                    <View style={{
                        zIndex: 11,
                        position: 'absolute',
                        width: 130 * SCALE,
                        height: 130 * SCALE,
                        left: 555 * SCALE,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white'
                    }}>
                        <Image
                            style={{ width: 140 * SCALE, height: 57 * SCALE, position: 'absolute', top: 0 }}
                            source={require('../../../resource/img/tx_img_halfround.png')}>
                        </Image>
                        <TouchableOpacity
                            onPress={() => {
                                NoDoublePress.onPress(() => {
                                    console.log('结束');
                                    this.stopRecord()
                                });
                            }}
                            activeOpacity={0.5}>
                            <Image
                                style={{ width: 80 * SCALE, height: 80 * SCALE, }}
                                source={
                                    require('../../../resource/img/tx_recording.png')
                                }>
                            </Image>
                        </TouchableOpacity>
                    </View>
                );
                break;
            case 'scoring':
                recordBtn = (
                    <View style={{
                        zIndex: 11,
                        position: 'absolute',
                        width: 130 * SCALE,
                        height: 130 * SCALE,
                        left: 555 * SCALE,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white'
                    }}>
                        <Image
                            style={{ width: 140 * SCALE, height: 57 * SCALE, position: 'absolute', top: 0 }}
                            source={require('../../../resource/img/tx_img_halfround.png')}>
                        </Image>
                        <Image
                            style={{ width: 80 * SCALE, height: 80 * SCALE, }}
                            source={
                                require('../../../resource/img/loudou.gif')
                            }>
                        </Image>
                    </View>
                );
                scorePopover = (
                    <ImageBackground
                        style={{
                            position: 'absolute',
                            width: 282 * SCALE, height: 55 * SCALE, left: 500 * SCALE,
                            paddingBottom: 10 * SCALE,
                            bottom: 150 * SCALE,
                            zIndex: 20,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        source={require('../../../resource/img/tx_mark_border.png')}>
                        <Image
                            style={{ width: 35 * SCALE, height: 24 * SCALE, }}
                            source={
                                require('../../../resource/img/tx_ico_score.png')
                            }>
                        </Image>
                        <Text style={{ fontSize: 18 * SCALE, color: 'white', marginLeft: 10 * SCALE }}>正在评分中，请稍后……</Text>
                    </ImageBackground>
                );
                break;
        }

        let wrongCount = 0;
        let rightCount = 0;
        let allCount = 0;
        this.props.paperData.areas.forEach((v, i) => {
            v.questions.forEach((sv, si) => {
                sv.contents.forEach((ssv, ssi) => {
                    allCount++;
                    if (formatAreaType(v.type) === 'speak') {// 口语题
                        if (!ssv.recordResult) {
                        } else if (ssv.recordResult.overall === 0) {
                            wrongCount++;
                        } else {
                            rightCount++;
                        }
                    } else if (formatAreaType(v.type) === 'listen') {// 听力题
                        if (!ssv.selected) {

                        } else if (ssv.selected !== ssv.answers.answer.content) {
                            wrongCount++;
                        } else {
                            rightCount++;
                        }
                    } else {// 填空题
                        if (v.type == '25') {//听后记录与转述
                            if (ssi !== sv.contents.length - 1) {
                                if (ssv.currentAnswer === undefined) {

                                } else if (this.ifCorrectAnswer(ssv.currentAnswer, ssv.answers.answer)) {
                                    rightCount++;
                                } else {
                                    wrongCount++;
                                }
                            } else {
                                if (!ssv.recordResult) {

                                } else if (ssv.recordResult.overall === 0) {
                                    wrongCount++;
                                } else {
                                    rightCount++;
                                }
                            }
                        } else {
                            if (ssv.currentAnswer === undefined) {

                            } else if (this.ifCorrectAnswer(ssv.currentAnswer, ssv.answers.answer)) {
                                rightCount++;
                            } else {
                                wrongCount++;
                            }
                        }
                    }
                });
            });
        });

        const areas = this.props.paperData.areas.map((v, i) => {
            let items = [];
            v.questions.forEach((sv, si) => {
                sv.contents.forEach((ssv, ssi) => {
                    let containerStyle, textStyle;
                    const ifCurrent = () => {
                        if (v.type == '22' || v.type == '7') {// 听后记录的答题卡是小题模式，切换是大题模式
                            if (i === this.props.areaIndex && si === this.props.questionIndex && ssi === this.props.contentIndex) {
                                return true;
                            }
                        } else {
                            if ((ifSwitchQuestion(v.type) && i === this.props.areaIndex && si === this.props.questionIndex)
                                ||
                                (!ifSwitchQuestion(v.type) && i === this.props.areaIndex && si === this.props.questionIndex && ssi === this.props.contentIndex)) {
                                return true;
                            }
                        }
                        return false;
                    }
                    if (ifCurrent()) {
                        containerStyle = [styles.btContainer, { backgroundColor: '#ff7831', borderColor: '#ff7831' }];
                        textStyle = styles.btText;
                    } else if (formatAreaType(v.type) === 'speak') {// 口语题
                        if (!ssv.recordResult) {
                            containerStyle = [styles.btContainer, { backgroundColor: 'white', borderColor: '#dddddd' }];
                            textStyle = [styles.btText, { color: '#333333' }];
                        } else if (ssv.recordResult.overall === 0) {
                            containerStyle = [styles.btContainer, { backgroundColor: 'white', borderColor: '#ff0000' }];
                            textStyle = [styles.btText, { color: '#ff0000' }];
                        } else {
                            containerStyle = styles.btContainer;
                            textStyle = styles.btText;
                        }
                    } else if (formatAreaType(v.type) === 'listen') {// 听力题
                        if (!ssv.selected) {
                            containerStyle = [styles.btContainer, { backgroundColor: 'white', borderColor: '#dddddd' }];
                            textStyle = [styles.btText, { color: '#333333' }];
                        } else if (ssv.selected !== ssv.answers.answer.content) {
                            containerStyle = [styles.btContainer, { backgroundColor: 'white', borderColor: '#ff0000' }];
                            textStyle = [styles.btText, { color: '#ff0000' }];
                        } else {
                            containerStyle = styles.btContainer;
                            textStyle = styles.btText;
                        }
                    }
                    items.push(
                        <components.Button
                            onPress={() => {
                                this.refs.cardModal.close();
                                this.props.setAreaIndex(i);
                                this.props.setQuestionIndex(si);
                                this.props.setContentIndex(ssi);
                                this.currentPage = getPage(i, si, ssi);
                                this.viewPager.setPage(this.currentPage);
                                this.props.resetSound();
                                this.cancelRecord();
                                socket.send('16', {
                                    Status: parseInt(4001, 16),
                                    AreaIndex: i + 1,
                                    QuestionIndex: 0,
                                    ContentIndex: 0,
                                    Behavior: 0
                                });
                            }}
                            key={si + new Date() + ssi + i.toString()}
                            text={ssv.index}
                            containerStyle={containerStyle}
                            textStyle={textStyle}></components.Button>
                    );
                    // });
                });
            });
            let item25 = [];
            v.questions.forEach((sv, si) => {
                let fillItem = [];
                let speakItem = null;
                sv.contents.forEach((ssv, ssi) => {
                    if (ssi !== sv.contents.length - 1) {
                        let containerStyle, textStyle;
                        if (!this.props.ifSection2 && i === this.props.areaIndex && si === this.props.questionIndex) {
                            containerStyle = [styles.btContainer, { backgroundColor: '#ff7831', borderColor: '#ff7831' }];
                            textStyle = styles.btText;
                        } else {
                            if (ssv.currentAnswer === undefined) {
                                containerStyle = [styles.btContainer, { backgroundColor: 'white', borderColor: '#dddddd' }];
                                textStyle = [styles.btText, { color: '#333333' }];
                            } else if (!this.ifCorrectAnswer(ssv.currentAnswer, ssv.answers.answer)) {
                                containerStyle = [styles.btContainer, { backgroundColor: 'white', borderColor: '#ff0000' }];
                                textStyle = [styles.btText, { color: '#ff0000' }];
                            } else {
                                containerStyle = styles.btContainer;
                                textStyle = styles.btText;
                            }
                        }
                        fillItem.push(
                            <components.Button
                                onPress={() => {
                                    this.refs.cardModal.close();
                                    this.props.setAreaIndex(i);
                                    this.props.setQuestionIndex(si);
                                    this.props.setContentIndex(ssi);
                                    this.props.changeSection2(false);
                                    this.currentPage = getPage(i, si, ssi);
                                    this.viewPager.setPage(this.currentPage);
                                    this.props.resetSound();
                                    this.cancelRecord();
                                    socket.send('16', {
                                        Status: parseInt(4001, 16),
                                        AreaIndex: i + 1,
                                        QuestionIndex: 0,
                                        ContentIndex: 0,
                                        Behavior: 0
                                    });
                                }}
                                key={si + new Date() + ssi + i.toString()}
                                text={ssv.index}
                                containerStyle={containerStyle}
                                textStyle={textStyle}></components.Button>
                        );
                    } else {
                        let containerStyle, textStyle;
                        if (this.props.ifSection2 && i === this.props.areaIndex && si === this.props.questionIndex) {
                            containerStyle = [styles.btContainer, { backgroundColor: '#ff7831', borderColor: '#ff7831' }];
                            textStyle = styles.btText;
                        } else {
                            if (!ssv.recordResult) {
                                containerStyle = [styles.btContainer, { backgroundColor: 'white', borderColor: '#dddddd' }];
                                textStyle = [styles.btText, { color: '#333333' }];
                            } else if (ssv.recordResult.overall === 0) {
                                containerStyle = [styles.btContainer, { backgroundColor: 'white', borderColor: '#ff0000' }];
                                textStyle = [styles.btText, { color: '#ff0000' }];
                            } else {
                                containerStyle = styles.btContainer;
                                textStyle = styles.btText;
                            }
                        }
                        speakItem = (
                            <components.Button
                                onPress={() => {
                                    this.refs.cardModal.close();
                                    this.props.setAreaIndex(i);
                                    this.props.setQuestionIndex(si);
                                    this.props.setContentIndex(ssi);
                                    this.props.changeSection2(true);
                                    this.currentPage = getPage(i, si, ssi);
                                    this.viewPager.setPage(this.currentPage);
                                    this.props.resetSound();
                                    this.cancelRecord();
                                    socket.send('16', {
                                        Status: parseInt(4001, 16),
                                        AreaIndex: i + 1,
                                        QuestionIndex: 0,
                                        ContentIndex: 0,
                                        Behavior: 0
                                    });
                                }}
                                key={si + new Date() + ssi + i.toString()}
                                text={1}
                                containerStyle={containerStyle}
                                textStyle={textStyle}></components.Button>
                        );
                    }
                });
                item25.push(
                    <View key={i} style={{ marginBottom: 6 * SCALE }}>
                        <Text style={{ fontSize: 20 * SCALE, marginBottom: 26 * SCALE, paddingRight: 23 * SCALE }}>{v.title}(第一节)</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {fillItem}
                        </View>
                        <Text style={{ fontSize: 20 * SCALE, marginBottom: 26 * SCALE, paddingRight: 23 * SCALE }}>{v.title}(第二节)</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {speakItem}
                        </View>
                    </View>
                )
            });


            let item27 = [];
            v.questions.forEach((sv, si) => {
                sv.contents.forEach((ssv, ssi) => {
                    let containerStyle, textStyle;
                    if (!this.props.ifSection2 && i === this.props.areaIndex && si === this.props.questionIndex) {
                        containerStyle = [styles.btContainer, { backgroundColor: '#ff7831', borderColor: '#ff7831' }];
                        textStyle = styles.btText;
                    } else {
                        if (ssv.currentAnswer === undefined) {
                            containerStyle = [styles.btContainer, { backgroundColor: 'white', borderColor: '#dddddd' }];
                            textStyle = [styles.btText, { color: '#333333' }];
                        } else if (!this.ifCorrectAnswer(ssv.currentAnswer, ssv.answers.answer)) {
                            containerStyle = [styles.btContainer, { backgroundColor: 'white', borderColor: '#ff0000' }];
                            textStyle = [styles.btText, { color: '#ff0000' }];
                        } else {
                            containerStyle = styles.btContainer;
                            textStyle = styles.btText;
                        }
                    }
                    item27.push(
                        <components.Button
                            onPress={() => {
                                this.refs.cardModal.close();
                                this.props.setAreaIndex(i);
                                this.props.setQuestionIndex(si);
                                this.props.setContentIndex(ssi);
                                this.props.changeSection2(false);
                                this.currentPage = getPage(i, si, ssi);
                                this.viewPager.setPage(this.currentPage);
                                this.props.resetSound();
                                this.cancelRecord();
                                socket.send('16', {
                                    Status: parseInt(4001, 16),
                                    AreaIndex: i + 1,
                                    QuestionIndex: 0,
                                    ContentIndex: 0,
                                    Behavior: 0
                                });
                            }}
                            key={si + new Date() + ssi + i.toString()}
                            text={ssv.index}
                            containerStyle={containerStyle}
                            textStyle={textStyle}></components.Button>
                    );
                });
            });

            if (v.type === "25") {
                return item25;
            }

            if (v.type === "27") {
                return (<View key={i} style={{ marginBottom: 6 * SCALE }}>
                    <Text style={{ fontSize: 20 * SCALE, marginBottom: 26 * SCALE, paddingRight: 23 * SCALE }}>{v.title}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {item27}
                    </View>
                </View>
                )
            }

            return (
                <View key={i} style={{ marginBottom: 6 * SCALE }}>
                    <Text style={{ fontSize: 20 * SCALE, marginBottom: 26 * SCALE, paddingRight: 23 * SCALE }}>{v.title}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {items}
                    </View>
                </View>
            )
        });
        const areaCount = (
            <Text style={{ fontSize: 16 * SCALE, color: '#666' }}>已答 <Text style={{ fontSize: 22 * SCALE }}>{wrongCount + rightCount}</Text>/ {allCount}</Text>
        );
        let pages = [];
        paperData.areas.forEach((v, i) => {
            const Page = areaComponents[`Area${v.type}`];
            v.questions.forEach((sv, si) => {
                if (ifSwitchQuestion(v.type)) {
                    pages.push(
                        <View key={sv.guid} style={{ flex: 1, backgroundColor: 'white', borderRadius: 6 * SCALE }}>
                            <Page ifHasAnswer={ifHasAnswer()} ref={`areaComponent${i}${si}0`} cancelRecord={() => { this.cancelRecord(); }} openImageModal={(image) => { this.openImageModal(image); }} openStopRadioModal={() => { this.openStopRadioModal(); }} areaCount={areaCount} renderAreaIndex={i} renderQuestionIndex={si} renderContentIndex={0}></Page>
                        </View>
                    );
                } else {
                    sv.contents.forEach((ssv, ssi) => {
                        pages.push(
                            <View key={ssv.guid} style={{ flex: 1, backgroundColor: 'white', borderRadius: 6 * SCALE }}>
                                <Page ifHasAnswer={ifHasAnswer()} ref={`areaComponent${i}${si}${ssi}`} cancelRecord={() => { this.cancelRecord(); }} openImageModal={(image) => { this.openImageModal(image); }} openStopRadioModal={() => { this.openStopRadioModal(); }} areaCount={areaCount} renderAreaIndex={i} renderQuestionIndex={si} renderContentIndex={ssi}></Page>
                            </View>
                        );
                    });
                }
            });
        });
        return (
            <View
                {...(this.state.soundPopoverVisible ? this._panResponderPower.panHandlers : this._panResponder.panHandlers)}
                // {...this._panResponder.panHandlers}
                style={{ flex: 1 }}>
                {scorePopover}
                {
                    this.state.soundPopoverVisible ? (
                        <ImageBackground
                            source={require('../../../resource/img/tx_vol_border.png')}
                            style={{
                                position: 'absolute',
                                width: 298 * SCALE, height: 80 * SCALE, left: 57 * SCALE,
                                paddingBottom: 10 * SCALE,
                                bottom: 90 * SCALE,
                                zIndex: 20,
                            }}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 6 * SCALE }}>
                                <Image style={{ width: 29 * SCALE, height: 26 * SCALE, resizeMode: Image.resizeMode.stretch }}
                                    source={this.state.systemVolume === 0 ?
                                        earImg
                                        : cutEarImg}
                                >
                                </Image>
                                <View style={{
                                    marginLeft: 16 * SCALE,
                                    width: 208 * SCALE,
                                    alignItems: "stretch",
                                    justifyContent: "center"
                                }}>
                                    <Slider value={this.state.systemVolume}
                                        style={{ width: 230 * SCALE, height: 70 * SCALE, zIndex: 9 }}
                                        minimumTrackTintColor="#63776e"
                                        maximumTrackTintColor="#c8caca"
                                        thumbTintColor="#ff7831"
                                        onValueChange={this.changeSoundSlider}
                                    ></Slider>
                                </View>
                            </TouchableOpacity>
                        </ImageBackground>
                    ) : null
                }
                {/* <View style={{ position: 'absolute', top: 99 * SCALE, right: 39 * SCALE, zIndex: 8 }}>
                    <Text style={{ fontSize: 16 * SCALE, color: '#666' }}>已答 <Text style={{ fontSize: 22 * SCALE }}>25 </Text>/ 40</Text>
                </View> */}
                {title}
                <View style={{ paddingHorizontal: 20 * SCALE, backgroundColor: '#eee', flex: 1 }}>
                    <View style={{ backgroundColor: 'white', flex: 1 }}>
                        <ViewPagerAndroid
                            ref={viewPager => { this.viewPager = viewPager; }}
                            peekEnabled={false}
                            style={{ flex: 1 }}
                            onPageSelected={(e) => {
                                const page = e.nativeEvent.position;
                                this.cancelRecord();
                                this.props.resetSound();
                                const indexObj = getIndex(page);
                                console.log('滑动结束', page, indexObj);
                                this.props.setAreaIndex(indexObj.areaIndex);
                                this.props.setQuestionIndex(indexObj.questionIndex);
                                this.props.setContentIndex(indexObj.contentIndex);
                                this.currentPage = page;
                                setTimeout(() => {
                                    socket.send('16', {
                                        Status: parseInt(4001, 16),
                                        AreaIndex: indexObj.areaIndex + 1,
                                        QuestionIndex: 0,
                                        ContentIndex: 0,
                                        Behavior: 0
                                    });
                                }, 0);
                            }
                            }
                            initialPage={0}>
                            {pages}
                        </ViewPagerAndroid>
                        <View style={{ height: ifExpandHeight ? 130 * SCALE : 86 * SCALE, backgroundColor: '#eee' }}>
                            {/* <View style={{
                                position: 'absolute',
                                backgroundColor: 'yellow',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}> */}
                            {
                                (formatAreaType(area.type) === 'speak') || (formatAreaType(area.type) === 'fill&speak' && this.props.ifSection2) ? recordBtn : null
                            }
                            {
                                (formatAreaType(area.type) === 'fill&speak' && !this.props.ifSection2)||formatAreaType(area.type) === 'fill' ? submitAnswer : null
                            }
                            <View style={{ marginBottom: 12 * SCALE, backgroundColor: 'white', height: ifExpandHeight ? 44 * SCALE : 0, borderBottomLeftRadius: 5 * SCALE, borderBottomRightRadius: 5 * SCALE }}>
                            </View>
                            <View style={{ borderColor: '#e0e0e0', borderWidth: 1 * SCALE, zIndex: 9, paddingHorizontal: 35 * SCALE, justifyContent: 'space-between', alignItems: 'center', flex: 1, backgroundColor: 'white', borderTopLeftRadius: 5 * SCALE, borderTopRightRadius: 5 * SCALE, flexDirection: 'row' }}>
                                {detailView}
                                <RecordView ref="nativeRecordView"
                                    style={{ position: this.props.trainRecordState === 'recording' ? 'relative' : 'absolute', marginLeft: 200 * SCALE, opacity: this.props.trainRecordState === 'recording' ? 1 : 0 }}
                                    CanvasColor={processColor('white')}
                                    PaintColor={processColor(COLOR.theme)}
                                    ViewWidth={chartWidth}
                                    width={chartWidth}
                                    ViewHeight={chartHeight}
                                    height={chartHeight}
                                >
                                </RecordView>
                                {timeCount}
                                {soundConfig}
                                {changeAreaView}
                                {questionCard}
                            </View>
                        </View>
                    </View>
                </View>
                <Modal animationDuration={0} style={{ width: 472 * SCALE, height: 244 * SCALE, backgroundColor: 'white', borderRadius: 3 * SCALE }} ref="finishModal" swipeToClose={false}>
                    <View style={{ width: 472 * SCALE, borderBottomWidth: 1 * SCALE2, borderColor: '#e1e1e1', backgroundColor: '#f3f1f2', padding: 5 * SCALE2, borderTopLeftRadius: 3 * SCALE, borderTopRightRadius: 3 * SCALE }}>
                        <Text style={{ fontSize: 20 * SCALE }}>练习小结</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', paddingVertical: 31 * SCALE }}>
                        <View style={{ flex: 1, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18 * SCALE }}>本次练习共 {allCount} 题，已答 {wrongCount + rightCount} 题，未答 </Text>
                                <Text style={{ fontSize: 18 * SCALE, color: '#EB1718' }}>{allCount - wrongCount - rightCount}</Text>
                                <Text style={{ fontSize: 18 * SCALE }}> 题</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18 * SCALE }}>练习总用时：</Text>
                                <Text style={{ fontSize: 18 * SCALE, color: '#17b874' }}>{this.state.currentTime}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <components.Button
                                    text="继续练习"
                                    onPress={() => { this.refs.finishModal.close(); }}
                                    type="flat"
                                    containerStyle={{ borderRadius: 3 * SCALE, width: 137 * SCALE, marginTop: 20 * SCALE1, height: 44 * SCALE, borderColor: '#cfcfcf', }}
                                    textStyle={{ color: "#333" }}
                                />
                                <components.Button
                                    text="结束练习"
                                    onPress={() => {
                                        this.refs.finishModal.close();
                                        this.props.resetSound();
                                        this.cancelRecord();
                                        if (this.props.loginType === 'error') {
                                            this.props.changeTrainType('uploadError');
                                            return;
                                        }
                                        socket.send('48', {
                                            StudentNo: this.props.No,
                                        });
                                        this.props.changeTrainType('uploading');
                                    }}
                                    containerStyle={{ borderRadius: 3 * SCALE, marginTop: 20 * SCALE1, width: 136 * SCALE, height: 44 * SCALE, marginLeft: 15 * SCALE2, }}
                                    textStyle={{ color: "white" }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal animationDuration={0}
                    style={{ width: WIDTH, height: HEIGHT, backgroundColor: '#f5f5f5', borderRadius: 3 * SCALE }}
                    ref="answerModal"
                    backdropPressToClose={false}
                    swipeToClose={false}>
                    <StatusBar
                        translucent={true}
                        backgroundColor="transparent"
                        barStyle="dark-content"
                    />
                    <View style={{ alignItems: 'center', height: 74 * SCALE, paddingTop: 20 * SCALE, justifyContent: 'center', borderBottomWidth: 1 * SCALE, borderBottomColor: '#b3b3b3' }}>
                        <Text style={{ fontSize: 24 * SCALE, color: 'black' }}>答案解析</Text>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.props.resetSound();
                                this.refs.answerModal.close();
                            }}
                            style={{ padding: 10 * SCALE, position: 'absolute', top: 25 * SCALE, right: 26 * SCALE }}>
                            {/* <Text style={{ fontSize: 50 * SCALE }}>×</Text> */}
                            <Image
                                style={{ width: 23 * SCALE, height: 23 * SCALE }}
                                source={require('../../../resource/img/tx_close.png')}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <ScrollView onContentSizeChange={(contentWidth, contentHeight) => {
                            if (contentHeight <= HEIGHT - (this.state.ifFixed ? 58 * SCALE : 0) - 80 * SCALE) {
                                this.setState({
                                    ifFixed: true
                                });
                            } else {
                                this.setState({
                                    ifFixed: false
                                });
                            }
                        }} showsVerticalScrollIndicator={true} style={{ flex: 1 }}>
                            <AnswerComponent openImageModal={(image) => { this.openImageModal(image); }}></AnswerComponent>
                            {
                                !this.state.ifFixed ?
                                    (
                                        <components.Button
                                            text="返回练习"
                                            onPress={() => {
                                                this.props.resetSound();
                                                this.refs.answerModal.close();
                                            }}
                                            containerStyle={{ width: WIDTH, height: 58 * SCALE }}
                                            textStyle={{ color: "white" }}
                                        />
                                    )
                                    :
                                    null

                            }
                        </ScrollView>
                        {
                            this.state.ifFixed ?
                                (
                                    <components.Button
                                        text="返回练习"
                                        onPress={() => {
                                            this.props.resetSound();
                                            this.refs.answerModal.close();
                                        }}
                                        containerStyle={{ width: WIDTH, height: 58 * SCALE }}
                                        textStyle={{ color: "white" }}
                                    />
                                )
                                :
                                null
                        }
                    </View>
                </Modal>
                <Modal animationDuration={0}
                    style={{ width: WIDTH, height: HEIGHT, backgroundColor: '#f5f5f5', borderRadius: 3 * SCALE }}
                    ref="cardModal"
                    backdropPressToClose={false}
                    swipeToClose={false}>
                    <StatusBar
                        translucent={true}
                        backgroundColor="transparent"
                        barStyle="dark-content"
                    />
                    <View style={{ alignItems: 'center', height: 74 * SCALE, paddingTop: 20 * SCALE, justifyContent: 'center', borderBottomWidth: 1 * SCALE, borderBottomColor: '#b3b3b3' }}>
                        <Text style={{ fontSize: 24 * SCALE, color: 'black' }}>答题卡</Text>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => {
                                this.refs.cardModal.close();
                            }}
                            style={{ position: 'absolute', top: 12 * SCALE, right: 26 * SCALE }}>
                            <Text style={{ fontSize: 50 * SCALE }}>×</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white', paddingLeft: 23 * SCALE, paddingVertical: 30 * SCALE }}>
                        <ScrollView showsVerticalScrollIndicator={true}>
                            {areas}
                        </ScrollView>
                    </View>
                    <View style={{ width: WIDTH, height: 58 * SCALE, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.status, { backgroundColor: '#ff7831' }]}></View>
                            <Text style={{ fontSize: 18 * SCALE, marginLeft: 5 * SCALE }}>当前</Text>
                            <View style={[styles.status, { backgroundColor: '#1cb870' }]}></View>
                            <Text style={{ fontSize: 18 * SCALE, marginLeft: 5 * SCALE }}>做对（{rightCount}）</Text>
                            <View style={[styles.status, { borderWidth: 1, borderColor: '#fd3736' }]}></View>
                            <Text style={{ fontSize: 18 * SCALE, marginLeft: 5 * SCALE }}>做错（{wrongCount}）</Text>
                            <View style={[styles.status, { borderWidth: 1, borderColor: '#ccc' }]}></View>
                            <Text style={{ fontSize: 18 * SCALE, marginLeft: 5 * SCALE }}>未做（{allCount - rightCount - wrongCount}）</Text>
                        </View>
                        <components.Button
                            text="继续答题"
                            onPress={() => {
                                this.refs.cardModal.close();
                            }}
                            containerStyle={{ width: 256 * SCALE, height: 58 * SCALE }}
                            textStyle={{ color: "white" }}
                        />
                    </View>
                </Modal>
                <Modal
                    onOpened={() => {
                        this.props.changeBtnLoading(false);
                    }}
                    backdropPressToClose={false}
                    animationDuration={0}
                    style={{ width: 566 * SCALE, height: 296 * SCALE, backgroundColor: 'white', borderRadius: 3 * SCALE2 }} ref="stopRadioModal" swipeToClose={false}>
                    <View style={{ paddingLeft: 10 * SCALE1, justifyContent: 'center', width: 566 * SCALE, height: 60 * SCALE, borderBottomWidth: 1 * SCALE2, borderColor: '#e1e1e1', backgroundColor: '#f3f1f2', borderTopLeftRadius: 3 * SCALE2, borderTopRightRadius: 3 * SCALE2 }}>
                        <Text style={{ fontSize: 22 * SCALE }}>提示</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 59 * SCALE, paddingTop: 32 * SCALE1 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 * SCALE }}>
                                <Text style={{ fontSize: 20 * SCALE }}>当前正在录音中，请结束录音后，播放其他音频！</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 * SCALE }}>
                                <components.Button
                                    text="结束录音"
                                    onPress={() => {
                                        this.cancelRecord();
                                        this.closeStopRadioModal();
                                    }}
                                    containerStyle={{ width: 136 * SCALE, height: 44 * SCALE, marginLeft: 0, marginRight: 25 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                                    textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                                />
                                <components.Button
                                    text="取消"
                                    onPress={() => {
                                        this.closeStopRadioModal();
                                    }}
                                    type="flat"
                                    containerStyle={{ backgroundColor: '#f6f6f6', width: 136 * SCALE, height: 44 * SCALE, borderColor: '#cfcfcf', marginTop: 22 * SCALE1, marginHorizontal: 0, paddingHorizontal: 0, borderRadius: 3 * SCALE1 }}
                                    textStyle={{ color: "#333", fontSize: 16 * SCALE1 }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    backdropPressToClose={true}
                    style={{ backgroundColor: 'transparent' }}
                    animationDuration={0} ref="imageModal" swipeToClose={false}>
                    {/* <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={true} > */}
                    <View style={{ height: 752 * SCALE, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{ position: 'absolute', zIndex: 20, top: 40 * SCALE, right: 30 * SCALE }}
                            onPress={() => {
                                this.closeImageModal();
                            }}
                        >
                            <Image style={{ width: 44 * SCALE, height: 44 * SCALE }}
                                source={require('../../../resource/img/tx_close2.png')}
                            ></Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                this.closeImageModal();
                            }}
                        >
                            <Image style={{ width: 1000 * SCALE, height: 600 * SCALE, resizeMode: Image.resizeMode.contain }}
                                source={{ uri: this.state.bigImage }}
                            // source={{ uri: 'http://gss0.bdstatic.com/5foIcy0a2gI2n2jgoY3K/static/fisp_static/common/img/sidebar/report_02cdef2.png' }}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                    {/* </ScrollView> */}
                </Modal>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLOR.theme,
        height: 52 * SCALE,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 25 * SCALE,
        paddingTop: 50 * SCALE,
        borderBottomWidth: 2 * SCALE,
        borderColor: '#ff7731'
    },
    timeItem: {
        color: 'white',
        width: 43 * SCALE,
        height: 39 * SCALE,
        fontSize: 28 * SCALE,
        borderRadius: 2 * SCALE,
        backgroundColor: '#1ea366',
        textAlign: 'center',
    },
    status: {
        width: 16 * SCALE,
        height: 16 * SCALE,
        marginLeft: 40 * SCALE
    },
    btContainer: {
        marginBottom: 24 * SCALE,
        marginRight: 24 * SCALE,
        backgroundColor: '#1cb870',
        width: 100 * SCALE,
        borderWidth: 1 * SCALE,
        height: 52 * SCALE,
        borderRadius: 4 * SCALE
    },
    btText: {
        fontSize: 20 * SCALE,
        color: 'white',
        textAlign: 'center',
    }
})

function mapStateToProps(state) {
    const { paperData, areaIndex, questionIndex, contentIndex, audioPath, paperAnswer, ifSection2 } = state.paper;
    const { loginType, rightSideType, checkAnswerState, trainRecordState, ip } = state.global;
    const { soundDuration, whoosh } = state.sound;
    const { No } = state.user.userData;
    const { userData } = state.user;
    const nav = state.nav;
    return {
        userData,
        paperData,
        paperAnswer,
        audioPath,
        rightSideType,
        areaIndex,
        questionIndex,
        contentIndex,
        soundDuration,
        whoosh,
        No,
        checkAnswerState,
        trainRecordState,
        nav,
        ifSection2,
        ip,
        loginType
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Main);