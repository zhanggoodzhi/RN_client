import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Image, Button, ART, Path, ToastAndroid, Animated, Easing, processColor, UIManager, findNodeHandle } from 'react-native';
import { COLOR, SCALE2, EventEmitter, SCALE1 } from '../../components/utils';
import Modal from "react-native-modalbox";
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'
import * as prompt from '../../components/prompt';
import * as areaComponents from '../../components/area';
import * as record from '../../components/native/record';
import * as components from '../../components/ui';
import * as socket from '../../components/native/socket';
import * as soundComponent from '../../components/sound';
import BackgroundTimer from 'react-native-background-timer';
import myTimer from '../../components/utils/timerutil';
import RecordView, { moveToOrigin, startDraw, stopDraw, clearDraw } from '../../components/native/RecordView';
import examBusiness from '../../components/examBusiness';
const maxVolum = 2000;
const chartHeight = 40 * SCALE2;
const chartWidth = 250 * SCALE2;
console.log('width', chartWidth);
const volumPercent = chartHeight / (2 * maxVolum);
let volumXGap = null;
let count = 0;
const barWidth = 246 * SCALE2;
let canAnimateResolve = false;// 结束考试时，控制进度条动画
let getServerVolumLength = 1;
// 接收服务器返回的数组
let volumArr = [];
// 绘图用的总数组
let ARTArr = [];
let ifInit = false;
class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            number: 5,
            bottomType: 'free',
            smallCountSecond: 0,
            soundCurrentDuration: new Animated.Value(0),
            xPoint: 0,
            yPoint: 0,
            checkType: ''// canPlay,rePlay
        }
        this.timerInterval = 100;
        this.Timer = null;
        this.myTimer = null;
        this.systemTime = 0;
        this.volum = 0;
        this.ifUploaded = false;
        this.ifJump = false;
        this.path = new ART.Path();
        this.myAudio = '';
        canAnimateResolve = true;
    }

    reduceSecond() {
        this.Timer && BackgroundTimer.clearInterval(this.Timer);
        BackgroundTimer.setTimeout(() => {
            soundComponent.playAudio(require('../../../resource/audio/TipsTick.mp3'));
        }, 100);
        // this.props.playAudio(require('../../../resource/audio/TipsTick.mp3'));
        this.Timer = BackgroundTimer.setInterval(() => {
            console.log(this.state.number);
            soundComponent.playAudio(require('../../../resource/audio/TipsTick.mp3'));
            // this.props.playAudio(require('../../../resource/audio/TipsTick.mp3'));
            if (this.state.number === 1) {
                BackgroundTimer.clearInterval(this.Timer);
                this.props.changeRightSideType('exam');
                // this.exam();
                examBusiness(this);
                return;
            } else {
                this.setState({
                    number: this.state.number - 1
                });
            }
        }, 1000);
    }

    listenPaperGuide() {
        return new Promise((resolve) => {
            const audio = this.props.paperData.areas[this.props.areaIndex].promptaudio;
            console.log('audioPath:', this.props.audioPath);
            const path = this.props.audioPath + audio;
            this.listenAudio(path, 'listenGuide', resolve);
        })
    }

    promiseListenAudio(audioPath, bottomType) {
        return new Promise((resolve) => {
            this.listenAudio(audioPath, bottomType, resolve);
        })
    }

    listenAudio(audioPath, bottomType, cb) {
        soundComponent.playAudio(audioPath, null, (duration) => {
            this.setState({
                bottomType,
                soundCurrentDuration: new Animated.Value(0)
            });
            Animated.timing(                            // 随时间变化而执行的动画类型
                this.state.soundCurrentDuration,                      // 动画中的变量值
                {
                    toValue: barWidth,
                    easing: Easing.linear,
                    duration: duration * 1000 + 500,
                }
            ).start();
            if (canAnimateResolve) {
                BackgroundTimer.setTimeout(() => {
                    cb();
                }, duration * 1000 + 500);
            }
            // Animated.Value.addListener((value)=>{
            //     console.log(value);
            // });
            // BackgroundTimer.setTimeout(() => {
            // }, duration * 1000 + 500);
            // this.props.changeSoundDuration(duration * 1000 + 500);
            // this.systemTime = new Date().getTime();

            // this.Timer && BackgroundTimer.clearInterval(this.Timer);
            // this.Timer = BackgroundTimer.setInterval(() => {
            //     if (this.state.soundCurrentDuration + 100 > this.props.soundDuration) {
            //         this.setState({
            //             soundCurrentDuration: this.props.soundDuration
            //         });
            //         cb();
            //         BackgroundTimer.clearInterval(this.Timer);
            //         return;
            //     }
            //     this.setState({
            //         soundCurrentDuration: new Date().getTime() - this.systemTime
            //     });
            // }, 100);
        });
    }
    prepare(bottomType, time) {
        return new Promise((resolve) => {
            const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
            let prepareTime;
            if (bottomType === 'read' || bottomType === 'prepare') {
                prepareTime = Number(paperData.areas[areaIndex].questions[questionIndex].contents[contentIndex].prepareseconds);
            } else {
                prepareTime = time;
            }
            this.setState({
                soundCurrentDuration: new Animated.Value(0),
                bottomType,
                smallCountSecond: prepareTime
            },
                // () => {
                //     this.state.soundCurrentDuration.addListener(({ value }) => {
                //         this.setState({
                //             smallCountSecond: Math.floor(prepareTime * (1 - value / barWidth))
                //         });
                //     });
                // }
            );
            this.Timer && BackgroundTimer.clearInterval(this.Timer);
            this.Timer = BackgroundTimer.setInterval(() => {
                if (this.state.smallCountSecond <= 0) {
                    BackgroundTimer.clearInterval(this.Timer);
                } else {
                    this.setState({
                        smallCountSecond: this.state.smallCountSecond - 1
                    });
                }
            }, 1000);
            Animated.timing(                            // 随时间变化而执行的动画类型
                this.state.soundCurrentDuration,                      // 动画中的变量值
                {
                    toValue: barWidth,
                    easing: Easing.linear,
                    duration: prepareTime * 1000,
                }
            ).start();
            if (canAnimateResolve) {
                BackgroundTimer.setTimeout(() => {
                    resolve();
                }, prepareTime * 1000);
            }
            // this.Timer && BackgroundTimer.clearInterval(this.Timer);
            // this.Timer = BackgroundTimer.setInterval(() => {
            //     const smallCountSecond = this.state.smallCountSecond;
            //     if (smallCountSecond <= 0) {
            //         BackgroundTimer.clearInterval(this.Timer);
            //         resolve();
            //     } else {
            //         this.setState({
            //             smallCountSecond: smallCountSecond - 1
            //         });
            //     }
            // }, 1000);
            // this.props.changeSoundDuration(prepareTime * 1000);
            // this.setState({
            //     soundCurrentDuration: 0,
            //     bottomType,
            //     smallCountSecond: prepareTime
            // });
            // this.systemTime = new Date().getTime();
            // this.Timer && BackgroundTimer.clearInterval(this.Timer);
            // this.Timer = BackgroundTimer.setInterval(() => {
            //     if (this.state.soundCurrentDuration + 100 > this.props.soundDuration) {
            //         this.setState({
            //             soundCurrentDuration: this.props.soundDuration
            //         });
            //         resolve();
            //         BackgroundTimer.clearInterval(this.Timer);
            //         return;
            //     }
            //     const soundCurrentDuration = new Date().getTime() - this.systemTime;
            //     let smallCountSecond = Math.floor((this.props.soundDuration - soundCurrentDuration) / 1000);
            //     if (smallCountSecond < 0) {
            //         smallCountSecond = 0;
            //     }
            //     this.setState({
            //         soundCurrentDuration,
            //         smallCountSecond
            //     });
            // }, 100);
        });
    }
    prepareRecord() {
        return new Promise((resolve) => {
            this.setState({
                bottomType: 'prepareRecord',
            });
            soundComponent.playAudio(require('../../../resource/audio/Tips.mp3'), () => {
                resolve();
            });
        });
    }
    endRecord() {
        return new Promise((resolve) => {
            this.setState({
                bottomType: 'free',
            });
            soundComponent.playAudio(require('../../../resource/audio/TipsEnd.mp3'), () => {
                resolve();
            });
        });
    }

    async checkingDevice() {
        // await this.promiseListenAudio('devicetestguide.mp3', 'listenGuide');
        this.setState({
            bottomType: 'free',
            // checkType: 'ifClear'
            // checkType: 'canPlay'
            checkType: 'rePlay'
        });
    }
    
    startRecord(id, seconds, cb) {
        console.log('开始录音');
        // getServerVolumLength = seconds >= 60 ? 1 : (6 - seconds / 10);
        getServerVolumLength = 1;
        if (seconds < 10) {
            this.timerInterval = 50;
        }
        volumXGap = chartWidth / (seconds * getServerVolumLength * 1000 / this.timerInterval);
        this.setState({
            bottomType: 'record',
            smallCountSecond: seconds
        }, () => {
            record.startRecord(id, (a, b) => {
                console.log('录音路径', b);
                this.myAudio = b;
            });
            moveToOrigin(this.refs.nativeRecordView);
            startDraw(this.refs.nativeRecordView);
        });

        var loopCount = seconds * 1000 / this.timerInterval;
        this.reloadART();
        this.Timer && BackgroundTimer.clearInterval(this.Timer);
        this.myTimer = myTimer.setInterval(() => {
            // for (var i = 0; i < getServerVolumLength; i++) {
            //     let volum = volumArr[i];
            //     if (!volum) {
            //         volum = 0;
            //     }
            //     ARTArr.push(volum);
            // }
            // this.drawART();
            const xPoint = volumXGap * (seconds * 1000 / this.timerInterval - loopCount);
            // const yPoint = (maxVolum + volumArr[0]) * volumPercent
            // if (volumArr.length) {
            //     volumArr=[0];
            // }
            console.log(volumArr);
            const yPoint = volumArr[0] * volumPercent
            volumArr = [];
            loopCount--;
            // console.log("loopCount:" + loopCount);
            this.setState({
                xPoint,
                yPoint,
                smallCountSecond: Math.ceil(loopCount / (1000 / this.timerInterval))
            });
            if (loopCount < 0) {
                record.stopRecord();
                myTimer.clearInterval(this.myTimer);
                stopDraw(this.refs.nativeRecordView);
                clearDraw(this.refs.nativeRecordView);
                cb();
            }
        }, this.timerInterval);
    }

    startPaperRecord() {
        return new Promise((resolve) => {
            const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
            const content = paperData.areas[areaIndex].questions[questionIndex].contents[contentIndex];
            const answerseconds = Number(content.answerseconds);
            this.startRecord(content.guid, answerseconds, () => {
                const newAnswer = { ...this.props.paperAnswer };
                newAnswer.recordguid.push({
                    guid: content.guid,
                    answer: content.guid + '.mp3',
                    score: '0'
                });
                this.props.changePaperAnswer(newAnswer);
                resolve();
            });
        });
    }

    drawART() {
        const d = new ART.Path();
        d.moveTo(0, maxVolum * volumPercent);
        ARTArr.forEach((v, i) => {
            const x = volumXGap * i;
            const y = i % 2 === 0 ? (maxVolum + v) * volumPercent : (maxVolum - v) * volumPercent
            d.lineTo(x, y);
        });
        this.setState({
            path: d
        });
    }
    setQuestionTimeIndex(index) {
        const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
        const newPaperData = { ...paperData };
        newPaperData.areas[areaIndex].questions[questionIndex].timeIndex = index;
        this.props.changePaperData(newPaperData);
    }
    setContentTimeIndex(index) {
        const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
        const newPaperData = { ...paperData };
        newPaperData.areas[areaIndex].questions[questionIndex].contents[contentIndex].timeIndex = index;
        this.props.changePaperData(newPaperData);
    }
    sendExamStatus() {
        const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
        const area = paperData.areas[areaIndex];
        const question = area.questions[questionIndex];
        const content = question.contents[contentIndex];
        if (this.props.listenGuide) {
            socket.send('16', {
                Status: parseInt(4001, 16),
                AreaIndex: area.index,
                QuestionIndex: 0,
                ContentIndex: 0,
                Behavior: 0
            });
        } else {
            socket.send('16', {
                Status: parseInt(4001, 16),
                AreaIndex: area.index,
                QuestionIndex: question.index,
                ContentIndex: content.index,
                Behavior: 0
            });
        }
    }
    async exam() {
        const newAnswer = { ...this.props.paperAnswer };
        newAnswer.studentno = this.props.No;
        newAnswer.paperguid = this.props.paperData.guid;
        newAnswer.papername = this.props.paperData.name;
        this.props.changePaperAnswer(newAnswer);
        for (let i = 0; i < this.props.paperData.areas.length; i++) {
            switch (this.props.paperData.areas[this.props.areaIndex].type) {
                // 单词音标认读
                case '24': {
                    this.props.changeListenGuide(true);
                    this.sendExamStatus();
                    await this.listenPaperGuide();
                    this.props.changeListenGuide(false);
                    for (let j = 0; j < this.props.paperData.areas[this.props.areaIndex].questions.length; j++) {
                        this.sendExamStatus();
                        await this.prepare('prepare');
                        await this.prepareRecord();
                        await this.startPaperRecord();
                        await this.endRecord();
                        if (j !== this.props.paperData.areas[this.props.areaIndex].questions.length - 1) {
                            this.props.nextQuestion();
                        }
                    }
                    break;
                }
                //朗读短文
                case '3': {
                    this.props.changeListenGuide(true);
                    this.sendExamStatus();
                    await this.listenPaperGuide();
                    this.props.changeListenGuide(false);
                    for (let j = 0; j < this.props.paperData.areas[this.props.areaIndex].questions.length; j++) {
                        this.sendExamStatus();
                        await this.prepare('prepare');
                        await this.prepareRecord();
                        await this.startPaperRecord();
                        await this.endRecord();
                        if (j !== this.props.paperData.areas[this.props.areaIndex].questions.length - 1) {
                            this.props.nextQuestion();
                        }
                    }
                    break;
                }
                //听短文答题
                case '2': {
                    this.props.changeListenGuide(true);
                    this.sendExamStatus();
                    await this.listenPaperGuide();
                    this.props.changeListenGuide(false);
                    let audioPath;
                    for (let j = 0; j < this.props.paperData.areas[this.props.areaIndex].questions.length; j++) {
                        audioPath = this.props.audioPath + this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].audio;
                        this.sendExamStatus();
                        await this.prepare('read');
                        for (let x = 0; x < Number(this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].times); x++) {
                            this.setQuestionTimeIndex(x + 1);
                            await this.promiseListenAudio(audioPath, 'listen');
                        }
                        await this.prepare('write', Number(this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].answerseconds));
                        if (j !== this.props.paperData.areas[this.props.areaIndex].questions.length - 1) {
                            this.props.nextQuestion();
                        }
                    }
                    break;
                }
                // 情景问答
                case '7': {
                    this.props.changeListenGuide(true);
                    this.sendExamStatus();
                    await this.listenPaperGuide();
                    this.props.changeListenGuide(false);
                    let audioPath;
                    for (let j = 0; j < this.props.paperData.areas[this.props.areaIndex].questions.length; j++) {
                        await this.prepare('read');
                        for (let k = 0; k < this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents.length; k++) {
                            audioPath = this.props.audioPath + this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents[this.props.contentIndex].audio;
                            this.sendExamStatus();
                            for (let x = 0; x < Number(this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].times); x++) {
                                this.setContentTimeIndex(x + 1);
                                console.log(audioPath);
                                this.props.changeListenQuestion(true);
                                await this.promiseListenAudio(audioPath, 'listen');
                                this.props.changeListenQuestion(false);
                            }
                            await this.prepareRecord();
                            await this.startPaperRecord();
                            await this.endRecord();
                            if (k !== this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents.length - 1) {
                                this.props.setContentIndex(this.props.contentIndex + 1);
                            } else {
                                this.props.setContentIndex(0);
                            }
                        }
                        if (j !== this.props.paperData.areas[this.props.areaIndex].questions.length - 1) {
                            this.props.nextQuestion();
                        }
                    }
                    break;
                }
                // 听后记录并转述信息
                case '25': {
                    this.props.changeListenGuide(true);
                    this.sendExamStatus();
                    await this.listenPaperGuide();
                    this.props.changeListenGuide(false);
                    let guidePath;
                    let guidePath2;
                    let audioPath;
                    for (let j = 0; j < this.props.paperData.areas[this.props.areaIndex].questions.length; j++) {
                        let question = this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex];
                        guidePath = this.props.audioPath + question.promptaudio;
                        guidePath2 = this.props.audioPath + question.tipsaudio;
                        audioPath = this.props.audioPath + question.audio;
                        this.sendExamStatus();
                        this.props.changeListenGuide(true);
                        await this.promiseListenAudio(guidePath, 'listenGuide');
                        this.props.changeListenGuide(false);
                        await this.prepare('read');
                        for (let x = 0; x < Number(question.contents[this.props.contentIndex].times); x++) {
                            this.setContentTimeIndex(x + 1);
                            await this.promiseListenAudio(audioPath, 'listen');
                        }
                        await this.prepare('write', Number(question.contents[this.props.contentIndex].answerseconds));
                        this.refs.areaComponent.getWrappedInstance().updatePaperAnswer();
                        //第二节
                        this.props.setContentIndex(question.contents.length - 1);// 把contents设成最后一个，方便this.prepare中选content的时间
                        this.props.changeSection2(true);
                        this.sendExamStatus();
                        this.props.changeListenGuide(true);
                        await this.promiseListenAudio(guidePath2, 'listenGuide');
                        this.props.changeListenGuide(false);
                        this.setContentTimeIndex(1);
                        await this.promiseListenAudio(audioPath, 'listen');
                        await this.prepareRecord();
                        await this.startPaperRecord();
                        await this.endRecord();
                        this.props.changeSection2(false);
                        this.props.setContentIndex(0);
                        if (j !== this.props.paperData.areas[this.props.areaIndex].questions.length - 1) {
                            this.props.nextQuestion();
                        }
                    }
                    break;
                }
                // 快速应答
                case '14': {
                    this.props.changeListenGuide(true);
                    this.sendExamStatus();
                    await this.listenPaperGuide();
                    this.props.changeListenGuide(false);
                    let audioPath;
                    for (let j = 0; j < this.props.paperData.areas[this.props.areaIndex].questions.length; j++) {
                        for (let k = 0; k < this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents.length; k++) {
                            audioPath = this.props.audioPath + this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents[this.props.contentIndex].audio;
                            this.sendExamStatus();
                            for (let x = 0; x < Number(this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].times); x++) {
                                this.setContentTimeIndex(x + 1);
                                console.log(audioPath);
                                this.props.changeListenQuestion(true);
                                this.refs.areaComponent.getWrappedInstance().startVideo();
                                await this.prepare('listen', Number(this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents[this.props.contentIndex].videoseconds));
                                // await this.prepare('listen', 3);
                                this.refs.areaComponent.getWrappedInstance().endVideo();
                                this.props.changeListenQuestion(false);
                            }
                            await this.prepare('prepare');
                            await this.prepareRecord();
                            await this.startPaperRecord();
                            await this.endRecord();
                            if (k !== this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents.length - 1) {
                                this.props.setContentIndex(this.props.contentIndex + 1);
                            } else {
                                this.props.setContentIndex(0);
                            }
                        }
                        if (j !== this.props.paperData.areas[this.props.areaIndex].questions.length - 1) {
                            this.props.nextQuestion();
                        }
                    }
                    break;
                }
            }
            this.props.resetQuestion();
            if (i !== this.props.paperData.areas.length - 1) {
                this.props.nextArea();
            } else {
                this.props.changeRightSideType('complete');
                socket.connectPaperServer(this.props.ip);
                console.log('答案', this.props.paperAnswer);
            }
        }
    }
    getBottom() {
        const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
        // console.log(this.state.soundCurrentDuration, this.props.soundDuration);
        const {
            Surface,
            Shape,
            Path
        } = ART;
        let imageSource = require('../../../resource/img/free.png');
        let title = '空闲中';
        let bar = (
            <View style={styles.barWrap}>
                <Animated.View
                    style={[styles.bar, { width: this.state.soundCurrentDuration }]}
                >
                </Animated.View>
                {/* <View style={[styles.bar, { width: barWidth * percent }]}>
                </View> */}
            </View>
        );
        let text = (
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 10 * SCALE2 }}>倒计时</Text>
                <Text style={{ fontSize: 10 * SCALE2, color: '#fe0000', paddingHorizontal: 5 * SCALE2 }}>{this.state.smallCountSecond}</Text>
                <Text style={{ fontSize: 10 * SCALE2 }}>秒</Text>
            </View>
        );
        switch (this.state.bottomType) {
            case 'free':
                bar = null;
                text = null;
                break;
            case 'listenGuide':
                imageSource = require('../../../resource/img/listen.gif');
                title = '听指导';
                text = null;
                break;
            case 'listenMyAudio':
                imageSource = require('../../../resource/img/listen.gif');
                title = '听回放';
                text = null;
                break;
            case 'listenTest':
                imageSource = require('../../../resource/img/listen.gif');
                title = '听原音';
                text = null;
                break;
            case 'prepare':
                imageSource = require('../../../resource/img/wait.gif');
                title = '请准备';
                break;
            case 'select':
                imageSource = require('../../../resource/img/answer.gif');
                title = '请选择';
                bar = null;
                text = null;
                break;
            case 'read':
                imageSource = require('../../../resource/img/wait.gif');
                title = '请读题';
                break;
            case 'write':
                imageSource = require('../../../resource/img/answer.gif');
                title = '请答题';
                break;
            case 'listen':
                imageSource = require('../../../resource/img/listen.gif');
                title = '请听题';
                let timeIndex = this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents[this.props.contentIndex].timeIndex;
                if (!timeIndex) {
                    timeIndex = this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].timeIndex;
                }
                text = (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 10 * SCALE2 }}>第</Text>
                        <Text style={{ fontSize: 10 * SCALE2, color: '#fe0000', paddingHorizontal: 5 * SCALE2 }}>{timeIndex}</Text>
                        <Text style={{ fontSize: 10 * SCALE2 }}>遍</Text>
                    </View>
                );
                break;
            case 'prepareRecord':
                imageSource = require('../../../resource/img/record.gif');
                title = '开始录音';
                bar = null;
                text = null;
                break;
            case 'endRecord':
                imageSource = require('../../../resource/img/record.gif');
                title = '录音完成';
                bar = null;
                text = null;
                break;
            case 'record':
                imageSource = require('../../../resource/img/record.gif');
                title = '录音中';
                bar = (
                    <View style={styles.recordWrap}>
                        {/* <View style={{ position: 'absolute', zIndex: 9, borderColor: '#fe0000', borderTopWidth: 1 * SCALE2, borderBottomWidth: 1 * SCALE2, height: 14 * SCALE2, width: chartWidth }}>
                        </View> */}
                        {/* <ART.Surface ref="surface" width={chartWidth} height={chartHeight}>
                            <ART.Shape ref="shape" d={this.state.path} stroke={COLOR.theme} strokeWidth={1} />
                        </ART.Surface> */}
                        {/* <RecordView ref="nativeRecordView" CanvasColor={processColor('red')} PaintColor={processColor('white')} width={300} height={50} StrokeWidth={1} XPoint={this.state.xPoint} Volum={this.state.yPoint}></RecordView> */}
                        <RecordView ref="nativeRecordView"
                            CanvasColor={processColor('white')}
                            PaintColor={processColor(COLOR.theme)}
                            ViewWidth={chartWidth}
                            width={chartWidth}
                            ViewHeight={chartHeight}
                            height={chartHeight}
                            StrokeWidth={volumXGap}
                            XPoint={this.state.xPoint}
                            Volum={this.state.yPoint}
                        >
                        </RecordView>
                    </View>
                );
                break;
        }
        return (
            <View style={styles.bottomView}>
                <Image source={imageSource}></Image>
                <Text style={{ fontSize: 10 * SCALE2, fontWeight: 'bold', marginLeft: 5 * SCALE2 }}>{title}</Text>
                {bar}
                {text}
            </View>
        )
    }
    componentDidMount() {
        // moveToOrigin(this.refs.nativeRecordView);
        // startDraw(this.refs.nativeRecordView);
        // const timer = setInterval(() => {
        //     this.setState({
        //         xPoint: Math.random() * 100,
        //         yPoint: Math.random() * 100
        //     });
        // }, 100);
        // setTimeout(() => {
        //     clearInterval(timer);
        //     stopDraw(this.refs.nativeRecordView);
        // }, 5000);

        // if (this.props.rightSideType === 'count') {
        //     this.reduceSecond();
        // }
        // if (this.props.rightSideType === 'exam') {
        //     this.Timer && BackgroundTimer.clearInterval(this.Timer);
        //     this.Timer = BackgroundTimer.setTimeout(() => {
        //         this.exam();
        //     }, 1000);
        // }

        //设备检测
        // soundComponent.getSystemVolume((volume) => {
        //     console.log('检测音量',volume);
        //     if (volume < 0.3) {
        //         this.props.modalOpen('setVolumeModal');
        //     } else {
        //         this.checkingDevice();
        //     }
        // });

        // 开发用
        socket.send('16', {
            Status: parseInt(1021, 16),
            AreaIndex: 0,
            QuestionIndex: 0,
            ContentIndex: 0,
            Behavior: 0
        });
        socket.connectPaperServer(this.props.ip);

        EventEmitter.addListener('volum', (volum) => {
            volumArr.push(volum);
            // console.log(volum);
        });

        EventEmitter.addListener('connectPaperServerSuccess', () => {
            console.log('连接试卷服务器成功');
            console.log(this.props.rightSideType);
            if (this.props.rightSideType === 'loading') {
                // 下载试卷
                socket.send(20, {
                    Index: '0'
                });
                return;
            }
            console.log('准备上传答案');
            if (this.props.rightSideType === 'complete') {
                // 上传答案
                if (this.props.loginType === 'ready' || this.props.loginType === 'login') {
                    socket.send2(26, this.props.paperAnswer);
                } else {
                    BackgroundTimer.setTimeout(() => {
                        this.props.changeRightSideType('uploadError');
                    }, 1000);
                }
            }
        });

        EventEmitter.addListener('paperDownloaded', (obj) => {
            console.log(obj);
            // obj.data.areas[1].questions.forEach((v, i) => {
            //     obj.data.areas[1].questions[i].contents[0].prepareseconds = '1';
            //     obj.data.areas[1].questions[i].contents[0].answerseconds = '1';
            // });
            // console.log(obj);
            this.props.initPaperData(obj.data, obj.path);
            this.props.changeRightSideType('ready');
            socket.destroyPaperServer();
            socket.send('16', {
                Status: parseInt(1031, 16),
                AreaIndex: 0,
                QuestionIndex: 0,
                ContentIndex: 0,
                Behavior: 0
            });
        });
        EventEmitter.addListener('startExam', () => {
            // 初始化学生答案
            console.log('开始考试');
            const paperData = this.props.paperData;
            // this.props.changePaperAnswer({
            //     studentno: this.props.No,
            //     paperguid: paperData.guid,
            //     papername: paperData.name,
            //     recordguid: []
            // });
            this.props.changeRightSideType('count');
            this.reduceSecond();
            socket.send('16', {
                Status: parseInt(4001, 16),
                AreaIndex: 0,
                QuestionIndex: 0,
                ContentIndex: 0,
                Behavior: 0
            });
            // this.props.changeRightSideType('exam');
            // this.exam();
        });
        EventEmitter.addListener('resetApp', () => {
            console.log('重置登录');
            this.clearComponent();
            EventEmitter.removeAllListeners();
            this.props.changeLoginType('ready');
            this.props.navJump({ routeName: 'login' });
        });
        EventEmitter.addListener('endExam', () => {
            console.log('结束考试');
            // 已经上传了
            if (this.ifUploaded) {
                this.clearComponent();
                EventEmitter.removeAllListeners();
                this.props.changeLoginType('ready');
                this.props.navJump({ routeName: 'login' });
            } else {
                this.clearComponent();
                this.props.changeRightSideType('complete');
                console.log(this.props.paperAnswer);
                socket.connectPaperServer(this.props.ip);
                this.ifJump = true;
            }
        });
        EventEmitter.addListener('uploadSuccess', () => {
            console.log('上传成功');
            this.props.changeRightSideType('success');
            this.ifUploaded = true;
            socket.destroyPaperServer();
            // 中断考试，上传完成后立即跳到登录页
            if (this.ifJump) {
                EventEmitter.removeAllListeners();
                this.props.changeRightSideType('checking');
                this.props.navJump({ routeName: 'login' });
            }
        });
        if (!ifInit) {
            ifInit = true;
        }
    }
    clearComponent() {
        this.Timer && BackgroundTimer.clearInterval(this.Timer);
        this.myTimer && BackgroundTimer.clearInterval(this.myTimer);
        canAnimateResolve = false;
        this.state.soundCurrentDuration.stopAnimation();
        soundComponent.reset();
        record.stopRecord();
        this.props.changeRightSideType('checking');
        this.props.resetQuestion();
        this.props.resetArea();
        this.props.setContentIndex(0);
    }
    reloadART = () => {
        const d = new ART.Path();
        ARTArr = [];
        this.setState({
            path: d
        });
    }
    checkDeviceRecord = () => {
        this.setState({
            checkType: 'recording'
        });
        this.startRecord('deviceTest', 5, this.endDeviceRecord);
    }

    endDeviceRecord = () => {
        console.log('ARTArr', ARTArr);
        let ifOK = false;
        ARTArr.forEach(v => {
            if (v > 1000) {
                ifOK = true;
            }
        });
        if (ifOK) {
            this.setState({
                checkType: 'listenMyAudio',
                bottomType: 'endRecord'
            });
        } else {
            this.setState({
                checkType: 'rePlay',
                bottomType: 'free'
            });
            this.props.modalOpen('modal');
        }
    }

    render() {
        const { paperData, areaIndex, questionIndex } = this.props;
        let checkTip = (
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 15 * SCALE1 }}>点击</Text>
                <Text style={{ fontSize: 15 * SCALE1, marginHorizontal: 3 * SCALE1, color: '#0b9740' }}>播放原音</Text>
                <Text style={{ fontSize: 15 * SCALE1 }}>按钮，试听下面的句子。</Text>
            </View>
        );
        let checkDeviceButton = null;
        switch (this.state.checkType) {
            case 'ifClear':
                checkTip = (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 15 * SCALE1 }}>如能清晰听到声音，请点击</Text>
                        <Text style={{ fontSize: 15 * SCALE1, marginHorizontal: 3 * SCALE1, color: '#ff7f34' }}>清晰</Text>
                        <Text style={{ fontSize: 15 * SCALE1 }}>按钮，完成试音；如不清晰，点击</Text>
                        <Text style={{ fontSize: 15 * SCALE1, marginHorizontal: 3 * SCALE1, color: '#0b9740' }}>不清晰</Text>
                        <Text style={{ fontSize: 15 * SCALE1 }}>按钮，重新试音。</Text>
                    </View>
                );
                checkDeviceButton = (
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <components.Button
                            text="不清晰"
                            onPress={() => {
                                this.setState({ checkType: 'rePlay', bottomType: 'free' });
                            }}
                            containerStyle={{ width: 120 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                            textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                        />
                        <components.Button
                            text="清晰"
                            onPress={() => {
                                console.log(this.props.ip);
                                socket.send('16', {
                                    Status: parseInt(1021, 16),
                                    AreaIndex: 0,
                                    QuestionIndex: 0,
                                    ContentIndex: 0,
                                    Behavior: 0
                                });
                                socket.connectPaperServer(this.props.ip);
                                this.props.changeRightSideType('downloading');
                            }
                            }
                            containerStyle={{ borderColor: '#ff7831', backgroundColor: '#ff7831', width: 120 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                            textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                        />
                    </View>
                );
                break;
            case 'rePlay':
                checkTip = (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 15 * SCALE1 }}>点击</Text>
                        <Text style={{ fontSize: 15 * SCALE1, marginHorizontal: 3 * SCALE1, color: '#ff7f34' }}>开始录音</Text>
                        <Text style={{ fontSize: 15 * SCALE1 }}>按钮，朗读下面的句子；或点击</Text>
                        <Text style={{ fontSize: 15 * SCALE1, marginHorizontal: 3 * SCALE1, color: '#0b9740' }}>重新播放</Text>
                        <Text style={{ fontSize: 15 * SCALE1 }}>按钮，重新试听。</Text>
                    </View>
                );
                checkDeviceButton = (
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <components.Button
                            text="重新播放"
                            onPress={() => {
                                this.setState({ checkType: '' });
                                this.promiseListenAudio('test.wav', 'listenTest').then(() => {
                                    this.setState({ checkType: 'rePlay', bottomType: 'free' });
                                });
                            }}
                            containerStyle={{ width: 120 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                            textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                        />
                        <components.Button
                            text="开始录音"
                            onPress={this.checkDeviceRecord}
                            containerStyle={{ borderColor: '#ff7831', backgroundColor: '#ff7831', width: 120 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                            textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                        />
                    </View>
                );
                break;
            case 'canPlay':
                checkDeviceButton = (
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <components.Button
                            text="播放原音"
                            onPress={() => {
                                this.setState({ checkType: '' });
                                this.promiseListenAudio('test.wav', 'listenTest').then(() => {
                                    this.setState({ checkType: 'rePlay', bottomType: 'free' });
                                });
                            }}
                            containerStyle={{ width: 120 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                            textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                        />
                    </View>
                );
                break;
            case 'recording':
                checkTip = (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 15 * SCALE1 }}>点击</Text>
                        <Text style={{ fontSize: 15 * SCALE1, marginHorizontal: 3 * SCALE1, color: '#ff7f34' }}>结束录音</Text>
                        <Text style={{ fontSize: 15 * SCALE1 }}>按钮，结束录音。</Text>
                    </View>
                );
                checkDeviceButton = (
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <components.Button
                            text="结束录音"
                            onPress={() => {
                                record.stopRecord();
                                BackgroundTimer.clearInterval(this.Timer);
                                this.endDeviceRecord();
                            }}
                            containerStyle={{ borderColor: '#ff7831', backgroundColor: '#ff7831', width: 120 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                            textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                        />
                    </View>
                );
                break;
            case 'listenMyAudio':
                checkTip = (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 15 * SCALE1 }}>点击</Text>
                        <Text style={{ fontSize: 15 * SCALE1, marginHorizontal: 3 * SCALE1, color: '#0b9740' }}>回放</Text>
                        <Text style={{ fontSize: 15 * SCALE1 }}>按钮，系统将播放您的录音。</Text>
                    </View>
                );
                checkDeviceButton = (
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <components.Button
                            text="回放"
                            onPress={() => {
                                this.setState({ checkType: '' });
                                this.promiseListenAudio(this.myAudio, 'listenMyAudio').then(() => {
                                    this.setState({ checkType: 'ifClear', bottomType: 'select' });
                                });
                            }}
                            containerStyle={{ width: 120 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                            textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                        />
                    </View>
                );
                break;
        }
        switch (this.props.rightSideType) {
            case 'downloading':
                return <prompt.Downloading></prompt.Downloading>;
            case 'ready':
                return <prompt.ExamReady></prompt.ExamReady>;
            case 'count':
                return <prompt.CountDown title={this.props.paperData.name} number={this.state.number}></prompt.CountDown>;
            case 'complete':
                return <prompt.Complete></prompt.Complete>;
            case 'success':
                return <prompt.UploadSuccess></prompt.UploadSuccess>;
            case 'downloadError':
                return <prompt.DownloadError
                    isTrain={false}
                    buttonEvent={() => {
                        socket.connectPaperServer(this.props.ip);
                        this.props.changeRightSideType('downloading');
                    }}
                ></prompt.DownloadError>;
            case 'uploadError':
                return <prompt.UploadError
                    isTrain={false}
                    buttonEvent={() => {
                        socket.connectPaperServer(this.props.ip);
                        this.props.changeRightSideType('complete');
                    }}
                ></prompt.UploadError>;
            case 'checking':
                return (
                    <View style={{ flex: 1, backgroundColor: '#eee' }}>
                        <View style={{ flex: 1, paddingHorizontal: 25 * SCALE1, paddingVertical: 25 * SCALE1 }}>
                            <View>
                                <Text style={{ fontSize: 18 * SCALE1, color: '#333' }}>Step1：请按图示指示正确佩戴耳麦</Text>
                            </View>
                            <View style={{ alignItems: 'center', marginTop: 15 * SCALE1, paddingHorizontal: 18 * SCALE1, paddingVertical: 10 * SCALE1, backgroundColor: 'white', borderRadius: 3 * SCALE1 }}>
                                <Image style={{ width: 555 * SCALE1, height: 150 * SCALE1, resizeMode: 'stretch' }}
                                    source={require('../../../resource/img/pic.jpg')}
                                >
                                </Image>
                            </View>
                            {/* <RecordView ref="nativeRecordView" CanvasColor={processColor('red')} PaintColor={processColor('white')} width={300} height={50} StrokeWidth={1} XPoint={this.state.xPoint} Volum={this.state.yPoint}></RecordView> */}
                            <View style={{ marginTop: 10 * SCALE1, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18 * SCALE1, color: '#333' }}>Step2：放音录音设备测试</Text>
                            </View>
                            <View style={{ paddingHorizontal: 31 * SCALE1, paddingVertical: 10 * SCALE1, backgroundColor: 'white', borderRadius: 3 * SCALE1, marginTop: 10 * SCALE1 }}>
                                {checkTip}
                                <View style={{ marginTop: 10 * SCALE1 }}>
                                    <View>
                                        <Image style={{ width: 705 * SCALE1, height: 5 * SCALE2 }}
                                            source={require('../../../resource/img/longdotline.png')}>
                                        </Image>
                                    </View>
                                </View>
                                <View>
                                    <Text>I believe，I can do my best!</Text>
                                </View>
                            </View>
                            {checkDeviceButton}
                        </View>
                        {this.getBottom()}
                    </View >
                );
            case 'exam': {
                const area = paperData.areas[areaIndex];
                const AreaComponent = areaComponents[`Area${area.type}`];
                return (
                    <View style={{ flex: 1, backgroundColor: '#eee' }}>
                        <AreaComponent ref="areaComponent" {...area} questionIndex={questionIndex}></AreaComponent>
                        {this.getBottom()}
                    </View >
                )
            };
            default: return null;
        }
    }
}
const styles = StyleSheet.create({
    bar: {
        width: barWidth,
        backgroundColor: COLOR.theme,
        borderRadius: 10 * SCALE2,
        height: 10 * SCALE2,
        marginLeft: 1 * SCALE2
    },
    barWrap: {
        justifyContent: 'center',
        width: 250 * SCALE2,
        borderWidth: 1 * SCALE2,
        borderColor: '#bbb',
        borderRadius: 10 * SCALE2,
        height: 14 * SCALE2,
        marginHorizontal: 8 * SCALE2,
    },
    recordWrap: {
        justifyContent: 'center',
        width: chartWidth,
        height: chartHeight,
        marginHorizontal: 8 * SCALE2,
    },
    bottomView: {
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1 * SCALE2,
        borderRadius: 3 * SCALE2,
        borderColor: '#dedede',
        padding: 5 * SCALE2,
        marginVertical: 5 * SCALE2,
        marginHorizontal: 15 * SCALE2
    }
})

function mapStateToProps(state) {
    const { paperData, areaIndex, questionIndex, contentIndex, audioPath, paperAnswer, listenGuide } = state.paper;
    const { rightSideType, ip, loginType } = state.global;
    const { soundDuration, whoosh } = state.sound;
    const { No } = state.user.userData;
    const nav = state.nav;
    return {
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
        nav,
        ip,
        listenGuide,
        loginType
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Main);