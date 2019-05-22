import React, { Component } from 'react';
import { ScrollView, Slider, StyleSheet, View, Text, TextInput, Image, Button, ART, Path, processColor, PanResponder, ViewPagerAndroid, TouchableOpacity, Animated, StatusBar, ImageBackground } from 'react-native';
import { NoDoublePress, COLOR, SCALE, SCALE2, SCALE1, EventEmitter, getObj, formatAreaType, WIDTH, HEIGHT, ifSwitchQuestion } from '../../components/utils';
import { bindActionCreators } from 'redux'
import Modal from "react-native-modalbox";
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'
import Collapsible from 'react-native-collapsible';
import * as answerComponents from '../../components/totalAnswer';
import * as soundComponent from '../../components/sound';
class TotalAnswer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bigImage: null,
        }
    }
    componentDidMount() {
        // this.refs.imageModal.open();
        this.props.paperData.areas.forEach((v, i) => {
            const obj = {};
            obj[`collapsed${i}`] = true;
            this.setState(obj);
        });
    }

    openImageModal(image) {
        this.setState({
            bigImage: image
        });
        this.refs.imageModal.open();
    }

    ifFillCorrectAnswer(currentAnswer, answers) {
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
    ifCorrect = (area, question, content) => {
        if (formatAreaType(area.type) === 'speak') {
            if (content.recordResult && content.recordResult.overall !== 0) {
                return true;
            }
        } else if (formatAreaType(area.type) === 'listen') {
            if (content.selected === content.answers.answer.content) {
                return true;
            }
        } else {
            if ((content.index !== question.contents[question.contents.length - 1].index&&area.type=='25')||area.type!=='25'){
                if (this.ifFillCorrectAnswer(content.currentAnswer, content.answers.answer)) {
                    return true;
                }
            } else {
                if (content.recordResult && content.recordResult.overall !== 0) {
                    return true;
                }
            }
        }
        return false;
    }
    getContentScore = (area, question, content) => {
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
            if((content.index !== question.contents[question.contents.length - 1].index&&area.type=='25')||area.type!=='25') {
                if (this.ifFillCorrectAnswer(content.currentAnswer, content.answers.answer)) {
                    return getObj(content.score).content;
                }
            } else {
                if (content.recordResult) {
                    const result = content.recordResult;
                    const percent = result && (result.overall / result.rank);
                    return Number(getObj(content.score).content * percent).toFixed(1);
                }
            }
        }
        return 0;
    }
    // 若未答题返回'未答题'
    getContentScoreStr = (area, question, content) => {
        if (formatAreaType(area.type) === 'speak') {
            if (content.recordResult) {
                const result = content.recordResult;
                const percent = result && (result.overall / result.rank);
                return Number(getObj(content.score).content * percent).toFixed(1);
            } else {
                return '未答题';
            }
        } else if (formatAreaType(area.type) === 'listen') {
            if (content.selected) {
                if (content.selected === content.answers.answer.content) {
                    return Number(getObj(content.score).content).toFixed(1);;
                }
            } else {
                return '未答题';
            }
        } else {
            if ((content.index !== question.contents[question.contents.length - 1].index&&area.type=='25')||area.type!=='25') {
                if (content.currentAnswer !== undefined) {
                    if (this.ifFillCorrectAnswer(content.currentAnswer, content.answers.answer)) {
                        return Number(getObj(content.score).content).toFixed(1);
                    }
                } else {
                    return '未答题';
                }
            } else {
                if (content.recordResult) {
                    const result = content.recordResult;
                    const percent = result && (result.overall / result.rank);
                    return Number(getObj(content.score).content * percent).toFixed(1);
                } else {
                    return '未答题';
                }
            }
        }
        return '0.0';
    }
    closeImageModal() {
        this.refs.imageModal.close();
    }
    render() {
        const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
        const listenAreas = [];
        const speakAndFillAreas = [];
        let listenScore = 0;
        let listenAllScore = 0;
        let speakAndFillScore = 0;
        let speakAndFillAllScore = 0;
        paperData.areas.forEach((v, i) => {
            let contentCount = 0;
            const indexItems = [];
            const iconItems = [];
            let areaScore = 0;
            let areaAllScore = 0;
            v.questions.forEach((sv, si) => {
                sv.contents.forEach((ssv, ssi) => {
                    contentCount++;
                    indexItems.push(
                        <View key={i + '-' + si + '-' + ssi} style={styles.items}>
                            <Text style={{ fontSize: 18 * SCALE }}>{ssv.index}</Text>
                        </View>
                    );
                    let ifCorrect = this.ifCorrect(v, sv, ssv);
                    const contentScore = this.getContentScore(v, sv, ssv);
                    areaScore += Number(contentScore);
                    areaAllScore += Number(getObj(ssv.score).content);
                    console.log(123, formatAreaType(v) === 'listen');
                    if (formatAreaType(v.type) === 'speak' ||(v.type === '25' && ssi === sv.contents.length - 1)) {
                        iconItems.push(
                            <View key={i + '-' + si + '-' + ssi} style={styles.items}>
                                <Text style={{ color: ifCorrect ? '#00b514' : '#ff0300' }}>{Number(contentScore)}</Text>
                            </View>
                        );
                    } else {
                        if (ifCorrect) {
                            iconItems.push(
                                <View key={i + '-' + si + '-' + ssi} style={styles.items}>
                                    <Image
                                        style={{ width: 20 * SCALE, height: 15 * SCALE }}
                                        source={require('../../../resource/img/xzsj_ico_right.png')}>
                                    </Image>
                                </View>
                            );
                        } else {
                            iconItems.push(
                                <View key={i + '-' + si + '-' + ssi} style={styles.items}>
                                    <Image
                                        style={{ width: 16 * SCALE, height: 17 * SCALE }}
                                        source={require('../../../resource/img/x.png')}>
                                    </Image>
                                </View>
                            );
                        }
                    }
                });
            });

            const lineCount = Math.ceil(contentCount / 5);
            const el = (
                <View key={i} style={{ flexDirection: 'row' }}>
                    <View style={[styles.column1, {}]}>
                        <Text style={{ fontSize: 20 * SCALE, }}>{v.title}</Text>
                    </View>
                    <View style={[styles.column2, {}]}>
                        <Text style={{ fontSize: 20 * SCALE }}>{areaAllScore}</Text>
                    </View>
                    <View style={[styles.column3, {}]}>
                        <Text style={{ fontSize: 20 * SCALE, color: '#ff0000', }}>{areaScore}</Text>
                    </View>
                    <View style={[styles.column4, {}]}>
                        {
                            new Array(lineCount).fill('').map((e, si) => {
                                return (
                                    <View key={si}>
                                        <View style={{ backgroundColor: '#f5f5f5', height: 50 * SCALE, flexDirection: 'row' }}>
                                            <View style={styles.items}>
                                                <Text style={{ fontSize: 18 * SCALE }}>题号</Text>
                                            </View>
                                            {indexItems.filter((ssv, ssi) => (ssi >= 5 * si && ssi < 5 * (si + 1)))}
                                            {/* <View style={styles.items}>
                                                <Text style={{ fontSize: 18 * SCALE }}>1</Text>
                                            </View> */}
                                        </View>
                                        <View style={{ height: 50 * SCALE, flexDirection: 'row' }}>
                                            <View style={styles.items}>
                                                <Text style={{ fontSize: 18 * SCALE }}>答案</Text>
                                            </View>
                                            {iconItems.filter((ssv, ssi) => (ssi >= 5 * si && ssi < 5 * (si + 1)))}
                                            {/* <View style={styles.items}> */}
                                            {/* <Image
                                                        style={{ width: 20 * SCALE, height: 15 * SCALE }}
                                                        source={require('../../../resource/img/xzsj_ico_right.png')}>
                                                    </Image> */}
                                            {/* </View> */}
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            )
            if (formatAreaType(v.type) === 'listen'|| v.type ==  27 ) {
                listenScore += Number(areaScore);
                listenAllScore += Number(areaAllScore);
                listenAreas.push(el);
            } else {
                speakAndFillScore += Number(areaScore);
                speakAndFillAllScore += Number(areaAllScore);
                speakAndFillAreas.push(el);
            }
        });
        listenScore = listenScore.toFixed(1);
        speakAndFillScore = speakAndFillScore.toFixed(1);
        const listenPanels = [];
        const speakAndFillPanels = [];
        paperData.areas.forEach((v, i) => {
            // const AnswerComponent = answerComponents[`Area${v.type}`];
            let contentCount = 0;
            let allScore = 0;
            let partOneCount = 0;
            let partOneScore = 0;
            let partTwoScore = 0;
            v.questions.forEach(sv => {
                allScore += Number(sv.score);
                sv.contents.forEach((ssv, ssi) => {
                    if (v.type === '25') {
                        if (ssi !== sv.contents.length - 1) {
                            partOneCount++;
                            partOneScore += Number(getObj(ssv.score).content);
                        } else {
                            partTwoScore += Number(getObj(ssv.score).content)
                        }
                    }
                    contentCount++;
                });
            });
            const AnswerComponent = answerComponents[`Area${v.type}`];
            let scoreText = `（共${contentCount}小题,满分${allScore}分）`;
            if (v.type === '25') {
                scoreText = `(总分${allScore}分，第一节${partOneScore}分，第二节${partTwoScore}分)`;
            }
            const el = (
                <View key={i} style={{}}>
                    <View style={{ paddingHorizontal: 15 * SCALE, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 * SCALE, borderTopWidth: 2 * SCALE, borderColor: '#1cb870', height: 54 * SCALE, backgroundColor: '#f0f0f0' }}>
                        <Text style={{ fontSize: 20 * SCALE }}>{v.title}{scoreText}</Text>
                        <TouchableOpacity
                            style={{ width: 154 * SCALE, height: 36 * SCALE, borderWidth: 1 * SCALE, borderColor: '#c2c2c2', borderRadius: 3 * SCALE, backgroundColor: '#dbdbdb', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {
                                const obj = {};
                                obj[`collapsed${i}`] = !this.state[`collapsed${i}`];
                                this.setState(obj);
                            }}
                            activeOpacity={0.5}>
                            <Text>{this.state[`collapsed${i}`] ? '展开' : '收起'}</Text>
                            <Image style={{ marginLeft: 5 * SCALE, width: 16 * SCALE, height: 9 * SCALE }}
                                source={this.state[`collapsed${i}`] ? require('../../../resource/img/cklxjg_open.png') : require('../../../resource/img/cklxjg_close.png')}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                    <Collapsible collapsed={!!this.state[`collapsed${i}`]}>
                        <View>
                            <AnswerComponent area={v} getContentScore={this.getContentScore} getContentScoreStr={this.getContentScoreStr} openImageModal={(image) => { this.openImageModal(image); }}></AnswerComponent>
                        </View>
                    </Collapsible>
                </View>
            )
            if (formatAreaType(v.type) === 'listen'||v.type == 27) {
                listenPanels.push(el);
            } else {
                speakAndFillPanels.push(el);
            }
        });
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    translucent={true}
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <View style={{ alignItems: 'center', height: 74 * SCALE, paddingTop: 20 * SCALE, justifyContent: 'center', borderBottomWidth: 1 * SCALE, borderBottomColor: '#b3b3b3' }}>
                    <Text style={{ fontSize: 24 * SCALE, color: 'black' }}>查看结果</Text>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                            this.props.changeTrainType('uploadSuccess');
                            this.props.resetSound();
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
                    <ScrollView showsVerticalScrollIndicator={true} style={{ paddingHorizontal: 20 * SCALE }}>
                        <View style={{ paddingVertical: 30 * SCALE }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    style={{ width: 13 * SCALE, height: 13 * SCALE }}
                                    source={require('../../../resource/img/cklxjg_ico.png')}>
                                </Image>
                                <Text style={{ fontSize: 20 * SCALE, color: '#000', marginLeft: 3 * SCALE }}>个人信息</Text>
                            </View>
                            <View style={{ marginTop: 18 * SCALE, flexDirection: 'row', borderWidth: 1 * SCALE, borderColor: '#e0e0e0', backgroundColor: '#f5f5f5', paddingHorizontal: 70 * SCALE, paddingVertical: 12 * SCALE }}>
                                <View style={{ width: 200 * SCALE, flexDirection: 'row', alignItems: 'center', borderRightWidth: 1 * SCALE, borderColor: '#e0e0e0' }}>
                                    <Text style={{ fontSize: 79 * SCALE, color: '#ff0000' }}>{Number(listenScore) + Number(speakAndFillScore)}</Text>
                                    <Text style={{ marginLeft: 5 * SCALE, marginTop: 30 * SCALE, color: '#ff0000', fontSize: 28 * SCALE }}>分</Text>
                                </View>
                                <View style={{ marginLeft: 50 * SCALE, flex: 1, marginTop: 10 * SCALE, justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15 * SCALE }}>姓名：</Text>
                                        <Text style={{ fontSize: 28 * SCALE, width: 120 * SCALE }}>{this.props.Name}</Text>
                                        <Text style={{ fontSize: 15 * SCALE, marginLeft: 30 * SCALE }}>学号：</Text>
                                        <Text style={{ fontSize: 15 * SCALE, width: 150 * SCALE }}>{this.props.No}</Text>
                                        <Text style={{ fontSize: 15 * SCALE, marginLeft: 30 * SCALE }}>班级：</Text>
                                        <Text style={{ fontSize: 15 * SCALE, width: 100 * SCALE }}>{this.props.className}</Text>
                                        <Text style={{ fontSize: 15 * SCALE, marginLeft: 30 * SCALE }}>使用试卷：</Text>
                                        <Text style={{ fontSize: 15 * SCALE, width: 170 * SCALE }}>{this.props.paperData.name}</Text>
                                    </View>
                                    {/* <Image style={{ width: 785 * SCALE, height: 1 * SCALE, marginTop: 15 * SCALE }}
                                        source={require('../../../resource/img/dotted_line.png')}>
                                    </Image>
                                    <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 20 * SCALE }}>
                                        <Text style={{ fontSize: 15 * SCALE }}>总体排名：</Text>
                                        <Text style={{ fontSize: 15 * SCALE, color: '#14b403' }}>无</Text>
                                        <Text style={{ fontSize: 15 * SCALE }}> / 无</Text>
                                    </View> */}
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 * SCALE }}>
                                <Image
                                    style={{ width: 13 * SCALE, height: 13 * SCALE }}
                                    source={require('../../../resource/img/cklxjg_ico.png')}>
                                </Image>
                                <Text style={{ fontSize: 20 * SCALE, color: '#000', marginLeft: 3 * SCALE }}>成绩简报</Text>
                            </View>
                            <View style={{ marginTop: 18 * SCALE }}>
                                <View style={{ backgroundColor: '#1cb870', flexDirection: 'row' }}>
                                    <Text style={[styles.column1, { borderColor: '#1cb870', color: 'white', textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>项目</Text>
                                    <Text style={[styles.column2, { borderColor: '#1cb870', color: 'white', textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>满分</Text>
                                    <Text style={[styles.column3, { borderColor: '#1cb870', color: 'white', textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>成绩</Text>
                                    <Text style={[styles.column4, { borderColor: '#1cb870', color: 'white', textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>小题得分</Text>
                                </View>
                                {
                                    listenAreas.length ? (
                                        <View style={{ backgroundColor: '#ebfef5', flexDirection: 'row' }}>
                                            <Text style={[styles.column1, { color: '#19a664', textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>听力部分</Text>
                                            <Text style={[styles.column2, { textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>{listenAllScore}</Text>
                                            <Text style={[styles.column3, { color: '#ff0000', textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>{listenScore}</Text>
                                            <Text style={[styles.column4, { textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}></Text>
                                        </View>
                                    ) : null
                                }
                                {listenAreas}
                                {
                                    speakAndFillAreas.length ? (
                                        <View style={{ backgroundColor: '#ebfef5', flexDirection: 'row' }}>
                                            <Text style={[styles.column1, { color: '#19a664', textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>口语部分</Text>
                                            <Text style={[styles.column2, { textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>{speakAndFillAllScore}</Text>
                                            <Text style={[styles.column3, { color: '#ff0000', textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>{speakAndFillScore}</Text>
                                            <Text style={[styles.column4, { textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}></Text>
                                        </View>
                                    ) : null
                                }
                                {speakAndFillAreas}
                                <View style={{ backgroundColor: '#ebfef5', flexDirection: 'row' }}>
                                    <Text style={[styles.column1, { color: '#19a664', textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>总成绩</Text>
                                    <Text style={[styles.column2, { textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>{listenAllScore + speakAndFillAllScore}</Text>
                                    <Text style={[styles.column3, { color: '#ff0000', textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}>{Number(listenScore) + Number(speakAndFillScore)}</Text>
                                    <Text style={[styles.column4, { textAlign: 'center', height: 50 * SCALE, lineHeight: 50 * SCALE }]}></Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 * SCALE }}>
                                <Image
                                    style={{ width: 13 * SCALE, height: 13 * SCALE }}
                                    source={require('../../../resource/img/cklxjg_ico.png')}>
                                </Image>
                                <Text style={{ fontSize: 20 * SCALE, color: '#000', marginLeft: 3 * SCALE }}>试卷解析</Text>
                            </View>
                            {
                                listenPanels.length ? (
                                    <ImageBackground style={{ marginTop: 18 * SCALE, justifyContent: 'center', width: 1240 * SCALE, height: 52 * SCALE }}
                                        source={require('../../../resource/img/cklxjg_border.png')}>
                                        <Text style={{ paddingLeft: 15 * SCALE, fontSize: 20 * SCALE, color: '#e46e40' }}>
                                            听力部分（满分{listenAllScore}分，得分{listenScore}分）
                                </Text>
                                    </ImageBackground>
                                ) : null
                            }
                            {listenPanels}
                            {
                                speakAndFillPanels.length ? (
                                    <ImageBackground style={{ marginTop: 18 * SCALE, justifyContent: 'center', width: 1240 * SCALE, height: 52 * SCALE }}
                                        source={require('../../../resource/img/cklxjg_border.png')}>
                                        <Text style={{ paddingLeft: 15 * SCALE, fontSize: 20 * SCALE, color: '#e46e40' }}>
                                            口语部分（满分{speakAndFillAllScore}分，得分{speakAndFillScore}分）
                                </Text>
                                    </ImageBackground>
                                ) : null
                            }
                            {speakAndFillPanels}
                        </View>
                    </ScrollView>
                </View>
                <Modal
                    backdropPressToClose={true}
                    style={{ backgroundColor: 'transparent' }}
                    animationDuration={0} ref="imageModal" swipeToClose={false}>
                    {/* <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={true} > */}
                    <View style={{ height: 752 * SCALE, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{ position: 'absolute', zIndex: 20, top: 10 * SCALE, right: 20 * SCALE }}
                            onPress={() => {
                                this.closeImageModal();
                            }}
                        >
                            <Text style={{ fontSize: 100 * SCALE, color: 'white' }}>×</Text>
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
    column1: {
        width: 300 * SCALE,
        borderLeftWidth: 1 * SCALE,
        borderRightWidth: 1 * SCALE,
        borderBottomWidth: 1 * SCALE,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#e8e8e8'
    },
    column2: {
        width: 140 * SCALE,
        borderRightWidth: 1 * SCALE,
        borderBottomWidth: 1 * SCALE,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#e8e8e8'
    },
    column3: {
        width: 140 * SCALE,
        borderRightWidth: 1 * SCALE,
        borderBottomWidth: 1 * SCALE,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#e8e8e8'
    },
    column4: {
        flex: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e8e8e8'
    },
    items: {
        width: 110 * SCALE,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1 * SCALE,
        borderColor: '#e8e8e8'
    }
})

function mapStateToProps(state) {
    const { paperData, areaIndex, questionIndex, contentIndex, audioPath, paperAnswer, ifSection2 } = state.paper;
    const { rightSideType, checkAnswerState, trainRecordState } = state.global;
    const { soundDuration, whoosh } = state.sound;
    const { No, Name, className } = state.user.userData;
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
        className,
        checkAnswerState,
        trainRecordState,
        nav,
        ifSection2,
        Name
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, null)(TotalAnswer);