import React, { Component } from 'react';
import { Slider, NativeModules, StyleSheet, View, InteractionManager, Text, TextInput, Image, ListView, Button, Animated, ScrollView, ToastAndroid, StatusBar, TouchableOpacity } from 'react-native';
import { COLOR, SCALE, SCALE2, SCALE1, EventEmitter, throttle, toast } from '../../components/utils';
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'
import Modal from "react-native-modalbox";
import * as socket from '../../components/native/socket';
import { downloadPaper } from '../../components/native/ftp';
import * as components from '../../components/ui';
import * as soundComponent from '../../components/sound';
import * as scoreModule from '../../components/native/score';
import ProgressCircle from 'react-native-progress-circle'
import * as lodash from 'lodash';
import BackgroundTimer from 'react-native-background-timer';
// import Slider from "react-native-slider";
// let audioPath =  '/storage/emulated/0/test111.aac';
let ifsetVolume = false;// 防止滑条设置音量后，系统监听音量又设置滑条
let listenVolumeCount = 0; //音量键监听会返回3次
let DrawerHeight = 0;
class Train extends React.Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            scoreCheckingState: 'checking',
            soundCheckingState: 'wait',
            percent: 0,
            drawerVisible: false,
            drawerHeight: new Animated.Value(-DrawerHeight),
            systemVolume: 0,
            dataSource: ds.cloneWithRows([{
                PaperID: '1',
                PaperName: 'xxx试卷',
            }])
        }
        this.paperList = null;
        this.savedDataSource = [];
        this.timer = null;
    }
    handleDiskVolumeChange = (volume) => {
        if (!ifsetVolume) {
            console.log('设置volume');
            this.setState({ systemVolume: volume });
        }
        listenVolumeCount++;
        if (listenVolumeCount === 3) {
            listenVolumeCount = 0;
            ifsetVolume = false;
        }
    }
    componentDidMount() {
        if (this.props.nav.routes[this.props.nav.routes.length - 1].routeName !== 'train') {
            return;
        }
        // this.refs.setVolumeModal.open();
        soundComponent.getSystemVolume((volume) => {
            this.setState({
                systemVolume: volume
            });
        });
        this.checkingSystem();
        EventEmitter.addListener('getPaperList', (data) => {
            console.log('试卷列表', data);
            this.paperList = data.PaperList;
            if (data.PaperList.length === 1) {
                // socket.connectPaperServer(this.props.ip);
                this.props.changeSelectedPaper(data.PaperList[0]);
                downloadPaper(this.props.ip, data.PaperList[0].PaperPathForFTP, data.PaperList[0].PaperID, data.PaperList[0].LMDic);
                this.props.changeTrainType('downloading');
                socket.send('16', {
                    Status: parseInt(1021, 16),
                    AreaIndex: 0,
                    QuestionIndex: 0,
                    ContentIndex: 0,
                    Behavior: 0
                });
            } else {
                if (data.PaperList.length < 5) {
                    DrawerHeight = (106 + data.PaperList.length * 106) * SCALE;
                } else {
                    DrawerHeight = 580 * SCALE;
                }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows([...data.PaperList])
                });
                this.savedDataSource = data.PaperList;
                this.showDrawer();
            }
        });
        EventEmitter.addListener('resetApp', this.resetApp);
        EventEmitter.addListener('CurrentVolum', this.handleDiskVolumeChange);
    }
    resetApp = () => {
        this.clearComponent();
    }
    componentWillUnmount() {
        console.log('checkingSystem卸载');
        EventEmitter.removeAllListeners('getPaperList');
        EventEmitter.removeAllListeners('CurrentVolum');
    }
    clearComponent() {

    }
    showDrawer() {
        this.setState({
            drawerVisible: true
        }, () => {
            Animated.timing(          // Uses easing functions
                this.state.drawerHeight,    // The value to drive
                {
                    toValue: 0,
                    duration: 500,
                },           // Configuration
            ).start();
        });
    }
    closeDrawer() {
        Animated.timing(          // Uses easing functions
            this.state.drawerHeight,    // The value to drive
            {
                toValue: -DrawerHeight,
                duration: 500,
            },           // Configuration
        ).start(() => {
            this.setState({
                drawerVisible: false
            });
        });
    }
    async checkingSystem() {
        // this.timer = BackgroundTimer.setInterval(() => {
        //     if (this.state.percent > 45) {
        //         return;
        //     }
        //     this.setState((state) => {
        //         return {
        //             percent: state.percent + 3
        //         }
        //     });
        // }, 300);
        await this.checkScore();
        // BackgroundTimer.clearInterval(this.timer);

        // this.timer = BackgroundTimer.setInterval(() => {
        //     if (this.state.percent > 95) {
        //         return;
        //     }
        //     this.setState((state) => {
        //         return {
        //             percent: state.percent + 1
        //         }
        //     });
        // }, 20);
        await this.checkSound();
        // BackgroundTimer.clearInterval(this.timer);

    }
    addPercent() {
        this.setState((state) => {
            let newPercent;
            if (state.percent !== 66) {
                newPercent = state.percent + 33;
            } else {
                newPercent = 100;
            }
            return {
                percent: newPercent
            }
        });
    }
    checkScore() {
        return new Promise((resolve) => {
            console.log('解压评分资源');
            const { MarkAppKey, MarkSecret, MarkProvision } = this.props.userData;
            scoreModule.loadAllResOncce(MarkAppKey, MarkSecret, MarkProvision,(ifLoadSourceSuccess) => {
                // ifLoadSourceSuccess = false;
                if (!ifLoadSourceSuccess) {
                    resolve();
                    this.setState({
                        scoreCheckingState: 'fail',
                        soundCheckingState: 'checking',
                    });
                    return;
                }
                console.log('解压完毕，初始化评分引擎');
                this.addPercent();
                let nativecoretypes = ["en_pred_score"]; // 创建本地评分数组
                scoreModule.initAIEngine(
                    nativecoretypes,
                    (ifInitSuccess) => {
                    // ifInitSuccess = false;
                    if (!ifInitSuccess) {
                        resolve();
                        this.setState({
                            scoreCheckingState: 'fail',
                            soundCheckingState: 'checking',
                        });
                        return;
                    }
                    console.log('评分引擎初始化完毕');
                    resolve();
                    this.setState({
                        scoreCheckingState: 'success',
                        soundCheckingState: 'checking',
                    });
                    this.addPercent();
                });
            });
            // resolve();
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
    checkSound() {
        return new Promise((resolve) => {
            soundComponent.getSystemVolume((volume) => {
                console.log('音量', volume);
                if (volume < 0.3) {
                    console.log('音量过小');
                    this.setState({
                        soundCheckingState: 'fail'
                    });
                } else {
                    console.log('音量合适');
                    this.setState({
                        soundCheckingState: 'success',
                    });
                    this.addPercent();
                }
                resolve();
            });
        });
    }
    render() {
        const { scoreCheckingState, soundCheckingState } = this.state;
        let scoreView;
        let scoreTip;
        let soundView;
        let soundTip;
        let lastView = (
            <View style={{ backgroundColor: '#a1a1a1', justifyContent: 'center', alignItems: 'center', width: 59 * SCALE, height: 59 * SCALE, borderRadius: 30 * SCALE }}>
                <View style={{ backgroundColor: '#f6f6f7', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderRadius: 30 * SCALE, }}>
                    <Image style={{ width: 14 * SCALE, height: 14 * SCALE }}
                        source={require('../../../resource/img/close2.png')}
                    ></Image>
                </View>
            </View>
        );
        switch (scoreCheckingState) {
            case 'checking':
                scoreView = (
                    <View style={{ backgroundColor: '#15b670', justifyContent: 'center', alignItems: 'center', width: 59 * SCALE, height: 59 * SCALE, borderRadius: 30 * SCALE }}>
                        <View style={{ backgroundColor: '#dcfaec', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderRadius: 30 * SCALE, }}>
                            <Text style={{ fontSize: 28 * SCALE, color: '#15b670' }}>1</Text>
                        </View>
                    </View>
                );
                scoreTip = (
                    <View>
                        <View style={{ marginBottom: 6 * SCALE, width: 310 * SCALE, height: 3 * SCALE, backgroundColor: '#92ebc3', marginTop: 25 * SCALE }}></View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ marginRight: 4 * SCALE, width: 20 * SCALE, height: 20 * SCALE }}
                                source={require('../../../resource/img/loading1.gif')}
                            ></Image>
                            <Text style={{ fontSize: 18 * SCALE, color: '#828282' }}>正在检测</Text>
                        </View>
                    </View>
                );
                break;
            case 'success':
                scoreView = (
                    <View style={{ backgroundColor: '#15b670', justifyContent: 'center', alignItems: 'center', width: 59 * SCALE, height: 59 * SCALE, borderRadius: 30 * SCALE }}>
                        <View style={{ backgroundColor: '#dcfaec', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderRadius: 30 * SCALE, }}>
                            <Text style={{ fontSize: 28 * SCALE, color: '#15b670' }}>1</Text>
                        </View>
                    </View>
                );
                scoreTip = (
                    <View>
                        <View style={{ marginBottom: 6 * SCALE, width: 310 * SCALE, height: 3 * SCALE, backgroundColor: '#92ebc3', marginTop: 25 * SCALE }}></View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ marginRight: 4 * SCALE, width: 15 * SCALE, height: 11 * SCALE }}
                                source={require('../../../resource/img/right.png')}
                            ></Image>
                            <Text style={{ fontSize: 18 * SCALE, color: '#00a728' }}>检测成功</Text>
                        </View>
                    </View>
                ); break;
            case 'fail':
                scoreView = (
                    <View style={{ backgroundColor: '#ff0000', justifyContent: 'center', alignItems: 'center', width: 59 * SCALE, height: 59 * SCALE, borderRadius: 30 * SCALE }}>
                        <View style={{ backgroundColor: '#ffecec', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderRadius: 30 * SCALE, }}>
                            <Text style={{ fontSize: 28 * SCALE, color: '#f00' }}>1</Text>
                        </View>
                    </View>
                );
                scoreTip = (
                    <View>
                        <View style={{ marginBottom: 6 * SCALE, width: 310 * SCALE, height: 3 * SCALE, backgroundColor: '#feb8b8', marginTop: 25 * SCALE }}></View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ marginRight: 4 * SCALE, width: 18 * SCALE, height: 16 * SCALE }}
                                source={require('../../../resource/img/gantan.png')}
                            ></Image>
                            <Text style={{ fontSize: 18 * SCALE, color: '#f00' }}>评分测试出现异常，请联系监考教师</Text>
                        </View>
                    </View>
                );
                lastView = (
                    <View style={{ backgroundColor: '#ff0000', justifyContent: 'center', alignItems: 'center', width: 59 * SCALE, height: 59 * SCALE, borderRadius: 30 * SCALE }}>
                        <View style={{ backgroundColor: '#ffecec', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderRadius: 30 * SCALE, }}>
                            <Image style={{ width: 14 * SCALE, height: 14 * SCALE }}
                                source={require('../../../resource/img/x.png')}
                            ></Image>
                        </View>
                    </View>
                ); break;
        }
        switch (soundCheckingState) {
            case 'wait':
                soundView = (
                    <View style={{ backgroundColor: '#a1a1a1', justifyContent: 'center', alignItems: 'center', width: 59 * SCALE, height: 59 * SCALE, borderRadius: 30 * SCALE }}>
                        <View style={{ backgroundColor: '#f6f6f7', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderRadius: 30 * SCALE, }}>
                            <Text style={{ fontSize: 28 * SCALE, color: '#a1a1a1' }}>2</Text>
                        </View>
                    </View>
                );
                soundTip = (
                    <View>
                        <View style={{ marginBottom: 6 * SCALE, width: 310 * SCALE, height: 3 * SCALE, backgroundColor: '#cbcbcb', marginTop: 25 * SCALE }}></View>
                    </View>
                );
                break;
            case 'checking':
                soundView = (
                    <View style={{ backgroundColor: '#15b670', justifyContent: 'center', alignItems: 'center', width: 59 * SCALE, height: 59 * SCALE, borderRadius: 30 * SCALE }}>
                        <View style={{ backgroundColor: '#dcfaec', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderRadius: 30 * SCALE, }}>
                            <Text style={{ fontSize: 28 * SCALE, color: '#15b670' }}>2</Text>
                        </View>
                    </View>
                );
                soundTip = (
                    <View>
                        <View style={{ marginBottom: 6 * SCALE, width: 310 * SCALE, height: 3 * SCALE, backgroundColor: '#92ebc3', marginTop: 25 * SCALE }}></View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ marginRight: 4 * SCALE, width: 18 * SCALE, height: 16 * SCALE }}
                                source={require('../../../resource/img/loading1.gif')}
                            ></Image>
                            <Text style={{ fontSize: 18 * SCALE, color: '#828282' }}>正在检测</Text>
                        </View>
                    </View>
                );
                break;
            case 'success':
                soundView = (
                    <View style={{ backgroundColor: '#15b670', justifyContent: 'center', alignItems: 'center', width: 59 * SCALE, height: 59 * SCALE, borderRadius: 30 * SCALE }}>
                        <View style={{ backgroundColor: '#dcfaec', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderRadius: 30 * SCALE, }}>
                            <Text style={{ fontSize: 28 * SCALE, color: '#15b670' }}>2</Text>
                        </View>
                    </View>
                    // <View style={{ backgroundColor: '#dcfaec', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderColor: '#15b670', borderRadius: 30 * SCALE, borderWidth: 2 * SCALE }}>
                    //     <Text style={{ fontSize: 28 * SCALE, color: '#15b670' }}>2</Text>
                    // </View>
                );
                soundTip = (
                    <View>
                        <View style={{ marginBottom: 6 * SCALE, width: 310 * SCALE, height: 3 * SCALE, backgroundColor: '#92ebc3', marginTop: 25 * SCALE }}></View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ marginRight: 4 * SCALE, width: 15 * SCALE, height: 11 * SCALE }}
                                source={require('../../../resource/img/right.png')}
                            ></Image>
                            <Text style={{ fontSize: 18 * SCALE, color: '#00a728' }}>正常</Text>
                        </View>
                    </View>
                );
                break;
            case 'fail':
                soundView = (
                    <View style={{ backgroundColor: '#ff0000', justifyContent: 'center', alignItems: 'center', width: 59 * SCALE, height: 59 * SCALE, borderRadius: 30 * SCALE }}>
                        <View style={{ backgroundColor: '#ffecec', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderRadius: 30 * SCALE, }}>
                            <Text style={{ fontSize: 28 * SCALE, color: '#f00' }}>2</Text>
                        </View>
                    </View>
                );
                soundTip = (
                    <View>
                        <View style={{ marginBottom: 6 * SCALE, width: 310 * SCALE, height: 3 * SCALE, backgroundColor: '#feb8b8', marginTop: 25 * SCALE }}></View>
                        <View>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => {
                                    this.refs.setVolumeModal.open();
                                }}
                                activeOpacity={0.5}>
                                <Image style={{ marginRight: 4 * SCALE, width: 18 * SCALE, height: 16 * SCALE }}
                                    source={require('../../../resource/img/gantan.png')}
                                ></Image>
                                <Text style={{ textDecorationLine: 'underline', fontSize: 18 * SCALE, color: '#f00' }}>耳机音量过小</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
                lastView = (
                    <View style={{ backgroundColor: '#ff0000', justifyContent: 'center', alignItems: 'center', width: 59 * SCALE, height: 59 * SCALE, borderRadius: 30 * SCALE }}>
                        <View style={{ backgroundColor: '#ffecec', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderRadius: 30 * SCALE, }}>
                            <Image style={{ width: 14 * SCALE, height: 14 * SCALE }}
                                source={require('../../../resource/img/x.png')}
                            ></Image>
                        </View>
                    </View>
                ); break;
        }
        if (scoreCheckingState === 'success' && soundCheckingState === 'success') {
            lastView = (
                <View style={{ backgroundColor: '#15b670', justifyContent: 'center', alignItems: 'center', width: 59 * SCALE, height: 59 * SCALE, borderRadius: 30 * SCALE }}>
                    <View style={{ backgroundColor: '#dcfaec', justifyContent: 'center', alignItems: 'center', width: 55 * SCALE, height: 55 * SCALE, borderRadius: 30 * SCALE, }}>
                        <Image style={{ width: 28 * SCALE, height: 20 * SCALE }}
                            source={require('../../../resource/img/right.png')}
                        ></Image>
                    </View>
                </View>
            );
        }
        let button;
        if (scoreCheckingState === 'success' && soundCheckingState === 'success') {
            button = (
                <View style={{ alignItems: 'center', marginTop: 50 * SCALE }}>
                    <components.Button
                        text="开始练习"
                        onPress={() => {
                            socket.send(45, {
                                EmptyValue: 1
                            });
                        }}
                        containerStyle={{ borderRadius: 4 * SCALE, backgroundColor: '#ff7831', borderColor: "#ff7831", width: 130 * SCALE, height: 44 * SCALE }}
                        textStyle={{ fontSize: 20 * SCALE }}>1</components.Button>
                </View>
            );
        } else if (soundCheckingState === 'fail' || scoreCheckingState === 'fail') {
            button = (
                <View style={{ alignItems: 'center', marginTop: 50 * SCALE }}>
                    <components.Button
                        onPress={() => {
                            this.setState({
                                percent: 0,
                                scoreCheckingState: 'checking',
                                soundCheckingState: 'wait',
                            }, () => {
                                this.checkingSystem();
                            });
                        }}
                        text="重新检测"
                        containerStyle={{ borderRadius: 4 * SCALE, backgroundColor: '#ff7831', borderColor: "#ff7831", width: 130 * SCALE, height: 44 * SCALE }}
                        textStyle={{ fontSize: 20 * SCALE }}>1</components.Button>
                </View>
            );
        } else {
            button = null;
        }
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ marginTop: 83 * SCALE }}>
                    <View style={{ alignItems: 'center' }}>
                        {/* <View style={{ alignItems: 'center', justifyContent: 'center', width: 160 * SCALE, height: 160 * SCALE, borderColor: COLOR.theme, borderWidth: 8 * SCALE, borderRadius: 80 * SCALE }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 52 * SCALE, color: '#333' }}>100</Text>
                                <Text style={{ fontSize: 40 * SCALE, color: '#333' }}>%</Text>
                            </View>
                        </View> */}
                        <ProgressCircle borderWidth={8 * SCALE} radius={80 * SCALE} percent={this.state.percent} bgColor="#fff" shadowColor="#e4e6e6" color={COLOR.theme}>
                            <Text style={{ fontSize: 50 * SCALE, color: '#333' }}>{this.state.percent + '%'}</Text>
                        </ProgressCircle>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 31 * SCALE }}>
                        <Text style={{ fontSize: 22 * SCALE }}>系统检测</Text>
                    </View>
                    <View style={{ justifyContent: 'center', marginTop: 62 * SCALE, flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center', width: 90 * SCALE }}>
                            {scoreView}
                            <Text style={{ fontSize: 22 * SCALE, color: '#333', marginTop: 20 * SCALE }}>评分引擎</Text>
                        </View>
                        {scoreTip}
                        <View style={{ alignItems: 'center', width: 90 * SCALE }}>
                            {soundView}
                            <Text style={{ fontSize: 22 * SCALE, color: '#333', marginTop: 20 * SCALE }}>耳机</Text>
                        </View>
                        {soundTip}
                        <View style={{ alignItems: 'center', width: 90 * SCALE }}>
                            {lastView}
                            <Text style={{ fontSize: 22 * SCALE, color: '#333', marginTop: 20 * SCALE }}>
                                {soundCheckingState === 'fail' || scoreCheckingState === 'fail' ? '失败' : '完成'}
                            </Text>
                        </View>
                    </View>
                </View>
                {button}
                <Modal backdropPressToClose={false}
                    animationDuration={0}
                    style={{ alignItems: 'center', width: 500 * SCALE, height: 370 * SCALE, backgroundColor: 'white', borderRadius: 3 * SCALE2 }} ref="setVolumeModal" swipeToClose={false}>
                    <View style={{
                        width: 500 * SCALE, borderBottomWidth: 1 * SCALE, borderColor: '#e1e1e1', backgroundColor: '#f3f1f2', padding: 14 * SCALE, borderTopLeftRadius: 3 * SCALE2, borderTopRightRadius: 3 * SCALE2
                    }}>
                        <Text style={{ fontSize: 22 * SCALE }}>耳机音量调节</Text>
                    </View>
                    <View style={{ flexDirection: 'row', padding: 10 * SCALE2 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ width: 18 * SCALE, height: 18 * SCALE }}
                                    source={require('../../../resource/img/ts.png')}
                                >
                                </Image>
                                <Text style={{ fontSize: 16 * SCALE, marginLeft: 7 * SCALE, color: '#383838' }}>系统检测到耳机音量过小，请确认是否已经调整到合适值！</Text>
                            </View>
                            <View style={{ alignItems: 'center', marginTop: 32 * SCALE }}>
                                <View style={{ paddingLeft: 33 * SCALE, paddingTop: 17 * SCALE, width: 371 * SCALE, height: 121 * SCALE, borderWidth: 1 * SCALE, borderColor: '#e1e1e1', backgroundColor: '#f8f8f8' }}>
                                    <Text style={{ fontSize: 16 * SCALE }}>耳机音量调节</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', left: 32 * SCALE, top: 15 * SCALE }}>
                                        <Image style={{ width: 19 * SCALE, height: 17 * SCALE }}
                                            source={this.state.systemVolume === 0 ?
                                                require('../../../resource/img/earphone2.png')
                                                : require('../../../resource/img/earphone1.png')}
                                        >
                                        </Image>
                                        <Slider value={this.state.systemVolume}
                                            style={{ width: 260 * SCALE, height: 100 * SCALE, zIndex: 9 }}
                                            minimumTrackTintColor="#63776e"
                                            maximumTrackTintColor="#c8caca"
                                            thumbTintColor="#ff7831"
                                            onValueChange={this.changeSoundSlider}
                                        ></Slider>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 40 * SCALE }}>
                                        <View style={{ alignItems: 'center', marginLeft: 32 * SCALE }}>
                                            <View style={{ width: 3 * SCALE, height: 7 * SCALE, backgroundColor: '#b7b7b7' }}></View>
                                            <Text style={{ fontSize: 16 * SCALE, color: '#888', marginTop: 2 * SCALE }}>小</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', marginLeft: 124 * SCALE }}>
                                            <Image style={{ width: 9 * SCALE, height: 9 * SCALE }}
                                                source={require('../../../resource/img/img_shape1.png')}
                                            >
                                            </Image>
                                            <Text style={{ fontSize: 16 * SCALE, color: '#888' }}>正常</Text>
                                        </View>
                                        <View style={{ alignItems: 'center', marginLeft: 45 * SCALE }}>
                                            <View style={{ width: 3 * SCALE, height: 7 * SCALE, backgroundColor: '#b7b7b7' }}></View>
                                            <Text style={{ fontSize: 16 * SCALE, color: '#888', marginTop: 2 * SCALE }}>大</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <components.Button
                                    text="调节好了，重新检测耳机状态"
                                    onPress={() => {
                                        this.setState({
                                            soundCheckingState: 'wait',
                                        }, () => {
                                            this.checkSound();
                                        });
                                        this.refs.setVolumeModal.close();
                                    }}
                                    containerStyle={{ width: 250 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                                    textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
                {
                    this.state.drawerVisible ? (
                        <View style={{ position: 'absolute', left: 0, right: 0, top: 0 * SCALE, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 9 }}>
                            <Animated.View style={{ transform: ([{ translateY: this.state.drawerHeight }]), width: 1280 * SCALE, height: DrawerHeight, backgroundColor: 'white' }}>
                                <Text style={[styles.item, { paddingHorizontal: 45 * SCALE }]}>选择试卷</Text>
                                <ListView
                                    showsVerticalScrollIndicator={true}
                                    dataSource={this.state.dataSource}
                                    renderRow={(rowData, sectionID, rowID, highlightRow) => {
                                        return (
                                            <TouchableOpacity
                                                key={rowID}
                                                onPress={() => {
                                                    this.savedDataSource.forEach((v, i) => {
                                                        this.savedDataSource[i].selected = false;
                                                        if (v.PaperID === rowData.PaperID) {
                                                            this.savedDataSource[i].selected = true;
                                                        }
                                                    });
                                                    console.log(this.savedDataSource);
                                                    this.setState({
                                                        dataSource: this.state.dataSource.cloneWithRows(JSON.parse(JSON.stringify(this.savedDataSource)))
                                                    });
                                                    this.props.changeSelectedPaper(rowData);
                                                }}
                                                activeOpacity={this.props.listenGuide ? 1 : 0.5}>
                                                <View style={{
                                                    borderBottomWidth: 1 * SCALE,
                                                    borderColor: '#d6d6d6',
                                                    paddingVertical: 25 * SCALE,
                                                    marginHorizontal: 45 * SCALE,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text
                                                        style={
                                                            {
                                                                fontSize: 20 * SCALE,
                                                                color: rowData.selected ? '#26a556' : '#333'
                                                            }}
                                                    >
                                                        {rowData.PaperName}
                                                    </Text>
                                                    {
                                                        rowData.selected ? (
                                                            <Image style={{ width: 19.5 * SCALE, height: 14.3 * SCALE }}
                                                                source={require('../../../resource/img/right.png')}
                                                            ></Image>
                                                        ) : null
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <components.Button
                                        text="确认"
                                        onPress={() => {
                                            if (!this.props.selectedPaper) {
                                                toast('请先选择试卷');
                                                return;
                                            }
                                            this.props.changeTrainType('downloading');
                                            socket.send('16', {
                                                Status: parseInt(1021, 16),
                                                AreaIndex: 0,
                                                QuestionIndex: 0,
                                                ContentIndex: 0,
                                                Behavior: 0
                                            });
                                            // socket.connectPaperServer(this.props.ip);
                                            downloadPaper(this.props.ip, this.props.selectedPaper.PaperPathForFTP, this.props.selectedPaper.PaperID, this.props.selectedPaper.LMDic);
                                            this.closeDrawer();
                                        }}
                                        containerStyle={{ width: 136 * SCALE, height: 44 * SCALE, marginLeft: 0, marginRight: 25 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                                        textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                                    />
                                </View>
                            </Animated.View>
                        </View>
                    ) : null
                }
            </View >
        )
    }
}
const styles = StyleSheet.create({
    item: {
        fontSize: 20 * SCALE,
        borderBottomWidth: 1 * SCALE,
        borderColor: '#d6d6d6',
        paddingVertical: 25 * SCALE
    }
})

function mapStateToProps(state) {
    const { trainType, ip } = state.global;
    const { userData } = state.user;
    const { soundValue } = state.sound;
    const nav = state.nav;
    const { areaIndex, questionIndex, contentIndex, paperData, selectedPaper } = state.paper;
    return {
        trainType,
        userData,
        soundValue,
        areaIndex,
        questionIndex,
        contentIndex,
        paperData,
        ip,
        selectedPaper,
        nav
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Train);