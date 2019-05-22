import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE, SCALE2, SCALE1, getAnswerColor4, getAnswerColorText4 } from '../utils'
import * as components from '../../components/ui';
import * as soundComponent from '../../components/sound';
import FixedWidthImage from '../trainArea/FixedWidthImage';
// 听后记录并转述信息
class Area extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    playAudio = (path) => {
        if (this.props.soundSrc == path) {
            this.props.resetSound();
            return;
        }
        soundComponent.playAudio(path, () => {
            this.props.changeSoundSrc('');
        });
        this.props.changeSoundSrc(path);
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
    render() {
        const area = this.props.area;
        const questionList = area.questions.map((v, i) => {
            console.log(v.contents);
            const fillContentList = v.contents.map((sv, si) => {
                if (si !== v.contents.length - 1) {
                    const myPath = sv.stuRadioFilePath;
                    // const myPath = require('../../../resource/audio/test.mp3');
                    const contentScore = this.props.getContentScoreStr(area, v, sv);
                    let contentScoreEl;
                    if (contentScore === '0.0') {
                        contentScoreEl = (
                            <Text style={{ fontSize: 26 * SCALE1, color: '#ff0101', textAlignVertical: 'bottom' }}>{contentScore}</Text>
                        );
                    } else if (contentScore === '未答题') {
                        contentScoreEl = (
                            <Text style={{ fontSize: 20 * SCALE, color: '#ff0101', textAlignVertical: 'bottom' }}>{contentScore}</Text>
                        );
                    } else {
                        contentScoreEl = (
                            <Text style={{ fontSize: 26 * SCALE1, color: '#14b403', textAlignVertical: 'bottom' }}>{contentScore}</Text>
                        );
                    }
                    let ifCorrect = this.ifCorrectAnswer(sv.currentAnswer, sv.answers.answer);
                    let answers;
                    if (sv.answers.answer.length) {
                        answers = sv.answers.answer.map((ssv, ssi) => {
                            return ssv.content;
                        }).join(' / ');
                    } else {
                        answers = sv.answers.answer.content;
                    }
                    return (
                        <View key={i + '-' + si} style={{ marginVertical: 30 * SCALE }}>
                            <View style={{ flexDirection: 'row' }}>
                                <ImageBackground style={{ justifyContent: 'center', width: 39 * SCALE, height: 26 * SCALE }}
                                    source={require('../../../resource/img/tx_cklxjg_arrow.png')}>
                                    <Text style={{ paddingLeft: 10 * SCALE, fontSize: 20 * SCALE }}>
                                        {sv.index}
                                    </Text>
                                </ImageBackground>
                                <View style={{ marginLeft: 20 * SCALE }}>
                                    <Text style={{ flex: 1, fontSize: 20 * SCALE, color: ifCorrect ? '#18b06c' : '#ff0000', paddingHorizontal: 30 * SCALE }}>
                                        {sv.currentAnswer}
                                    </Text>
                                    <View style={{ height: 1 * SCALE, backgroundColor: ifCorrect ? '#a6a6a6' : '#ff0000' }}></View>
                                </View>
                            </View>
                            <View style={{ marginTop: 23 * SCALE, backgroundColor: '#f9f9f9', paddingVertical: 18 * SCALE, marginBottom: 15 * SCALE }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 23 * SCALE }}>
                                    <Image
                                        style={{ width: 16 * SCALE, height: 18 * SCALE, marginRight: 9 * SCALE }}
                                        source={require('../../../resource/img/cklxjg_ckda.png')}
                                    ></Image>
                                    <Text style={styles.nFont}>参考答案：</Text>
                                </View>
                                <View style={{ marginVertical: 5 * SCALE, paddingHorizontal: 23 * SCALE }}>
                                    <Text>{answers}</Text>
                                </View>
                                <Image style={{ width: 1200 * SCALE, height: 1 * SCALE, marginTop: 15 * SCALE }}
                                    source={require('../../../resource/img/cklxjg_line2.png')}
                                ></Image>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 13 * SCALE, paddingHorizontal: 23 * SCALE }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.nFont}>得分：</Text>
                                        {contentScoreEl}
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                }
            })

            const speakContentList = v.contents.map((sv, si) => {
                if (si === v.contents.length - 1) {
                    const myPath = sv.stuRadioFilePath;
                    // const myPath = require('../../../resource/audio/test.mp3');
                    const contentScore = this.props.getContentScoreStr(area, v, sv);
                    let contentScoreEl;
                    if (contentScore === '0.0') {
                        contentScoreEl = (
                            <Text style={{ fontSize: 26 * SCALE1, color: '#ff0101', textAlignVertical: 'bottom' }}>{contentScore}</Text>
                        );
                    } else if (contentScore === '未答题') {
                        contentScoreEl = (
                            <Text style={{ fontSize: 20 * SCALE, color: '#ff0101', textAlignVertical: 'bottom' }}>{contentScore}</Text>
                        );
                    } else {
                        contentScoreEl = (
                            <Text style={{ fontSize: 26 * SCALE1, color: '#14b403', textAlignVertical: 'bottom' }}>{contentScore}</Text>
                        );
                    }
                    let longAnswers;
                    if (sv.answers.answer.length) {
                        answers = sv.answers.answer.map((ssv, ssi) => {
                            return ssv.content;
                        }).join(' / ');
                        longAnswers = sv.answers.answer.map((ssv, ssi) => {
                            return (
                                <View key={i + '-' + si + '-' + ssi} style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 8 * SCALE, color: '#555', marginRight: 3 * SCALE, marginTop: 7 * SCALE }}>●</Text>
                                    <Text style={{ fontSize: 18 * SCALE, color: '#555' }}>{ssv.content}</Text>
                                </View>
                            );
                        })
                    } else {
                        answers = sv.answers.answer.content;
                        longAnswers = <Text>{sv.answers.answer.content}</Text>
                    }
                    return (
                        <View key={i + '-' + si} style={{ marginVertical: 30 * SCALE }}>
                            <View style={{ width: 1190 * SCALE, paddingBottom: 15 * SCALE, marginVertical: 5 * SCALE }}>
                                <Text style={{ fontSize: 20 * SCALE }} numberOfLines={10}>
                                    {v.tips}
                                </Text>
                                <Text>{sv.tips}</Text>
                            </View>
                            <View style={{ marginTop: 23 * SCALE, backgroundColor: '#f9f9f9', paddingVertical: 18 * SCALE, marginBottom: 15 * SCALE }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 23 * SCALE }}>
                                    <Image
                                        style={{ width: 16 * SCALE, height: 18 * SCALE, marginRight: 9 * SCALE }}
                                        source={require('../../../resource/img/cklxjg_ckda.png')}
                                    ></Image>
                                    <Text style={styles.nFont}>参考答案：</Text>
                                </View>
                                <View style={{ marginVertical: 5 * SCALE, paddingHorizontal: 23 * SCALE }}>
                                    {longAnswers}
                                </View>
                                <Image style={{ width: 1200 * SCALE, height: 1 * SCALE, marginTop: 15 * SCALE }}
                                    source={require('../../../resource/img/cklxjg_line2.png')}
                                ></Image>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 13 * SCALE, paddingHorizontal: 23 * SCALE }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.nFont}>得分：</Text>
                                        {contentScoreEl}
                                    </View>
                                    {
                                        myPath ? (
                                            <TouchableOpacity
                                                style={{ width: 154 * SCALE, height: 36 * SCALE, borderRadius: 3 * SCALE, backgroundColor: this.props.soundSrc == myPath ? '#ff7831' : '#1cb870', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                                                onPress={() => {
                                                    this.playAudio(myPath);
                                                }}
                                                activeOpacity={0.5}>
                                                <Image style={{ marginRight: 8 * SCALE, width: 20 * SCALE, height: 20 * SCALE }}
                                                    source={this.props.soundSrc == myPath ? require('../../../resource/img/cklxjg_stop.png') : require('../../../resource/img/cklxjg_play2.png')}
                                                ></Image>
                                                <Text style={{ color: 'white' }}>{this.props.soundSrc == myPath ? '停止播放' : '考生答案'}</Text>
                                            </TouchableOpacity>
                                        ) : null
                                    }
                                </View>
                            </View>
                        </View>
                    );
                }
            });
            // const answerPath = require('../../../resource/audio/test.mp3');
            const answerPath = this.props.audioPath + v.audio;
            const imageUrl = "file://" + this.props.audioPath + v.image;
            // const imageUrl = 'http://gss0.bdstatic.com/5foIcy0a2gI2n2jgoY3K/static/fisp_static/common/img/sidebar/report_02cdef2.png';
            return (
                <View key={i} style={{ paddingHorizontal: 14 * SCALE }}>
                    <Text style={{ marginTop: 25 * SCALE }}>{v.prompt}</Text>
                    <View style={{ backgroundColor: '#ebfef5', padding: 27 * SCALE, marginTop: 20 * SCALE }}>
                        <View
                            style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ marginRight: 8 * SCALE, width: 15 * SCALE, height: 18 * SCALE }}
                                source={require('../../../resource/img/cklxjg_lyyw.png')}
                            ></Image>
                            <Text style={{ color: '#000', marginRight: 5 * SCALE }}>录音原文</Text>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => {
                                    this.playAudio(answerPath)
                                }}
                            >
                                <Image style={{ marginRight: 8 * SCALE, width: 26 * SCALE, height: 20 * SCALE }}
                                    source={this.props.soundSrc == answerPath ? require('../../../resource/img/labagif.gif') : require('../../../resource/img/cklxjg_play.png')}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 20 * SCALE, marginTop: 15 * SCALE }}>{v.audiotext}</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginVertical: 15 * SCALE }}>
                        <FixedWidthImage width={752 * SCALE} imageUrl={imageUrl}>
                        </FixedWidthImage>
                    </View>
                    {fillContentList}
                    {speakContentList}
                </View>
            )
        });
        return (
            <View style={{ borderWidth: 1 * SCALE, borderColor: '#e1e1e1', borderTopWidth: 0 }}>
                <Text style={{ fontSize: 16 * SCALE, padding: 15 * SCALE }}>{area.prompt}</Text>
                <Image style={{ width: 1238 * SCALE, height: 1 * SCALE }}
                    source={require('../../../resource/img/cklxjg_line2.png')}
                ></Image>
                {questionList}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    status: {
        width: 6 * SCALE1,
        height: 6 * SCALE1,
        marginLeft: 4 * SCALE1
    }
})
function mapStateToProps(state) {
    const { audioPath, paperData, paperAnswer, questionIndex, contentIndex, areaIndex } = state.paper;
    const { soundSrc } = state.global;
    return {
        audioPath,
        paperData,
        soundSrc,
        paperAnswer,
        questionIndex,
        areaIndex,
        contentIndex
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Area);
