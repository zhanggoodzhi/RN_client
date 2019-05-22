import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE, SCALE2, SCALE1, getAnswerColor4, getAnswerColorText4 } from '../utils'
import * as components from '../../components/ui';
import * as soundComponent from '../../components/sound';
// 情景问答
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
    render() {
        const area = this.props.area;
        const questionList = area.questions.map((v, i) => {
            console.log(v.contents);
            const contentList = v.contents.map((sv, si) => {
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
            console.log(sv.answers.answer);
                const answers = sv.answers.answer.map((ssv, ssi) => {
                    return (
                        <View key={ssi} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 8 * SCALE, color: '#555', marginRight: 3 * SCALE }}>●</Text>
                            <Text style={{ fontSize: 18 * SCALE, color: '#555' }}>{ssv.content}</Text>
                        </View>
                    );
                });
                return (
                    <View key={i + '-' + si} style={{ marginVertical: 30 * SCALE }}>
                        <View style={{ flexDirection: 'row' }}>
                            <ImageBackground style={{ justifyContent: 'center', width: 39 * SCALE, height: 26 * SCALE }}
                                source={require('../../../resource/img/tx_cklxjg_arrow.png')}>
                                <Text style={{ paddingLeft: 10 * SCALE, fontSize: 20 * SCALE }}>
                                    {sv.index}
                                </Text>
                            </ImageBackground>
                            <Text style={{ fontSize: 20 * SCALE, marginLeft: 10 * SCALE }}>{sv.text || sv.audiotext}</Text>
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
                                {answers}
                            </View>
                            < Image style={{ width: 1200 * SCALE, height: 1 * SCALE, marginTop: 15 * SCALE }}
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
            })
            // const answerPath = require('../../../resource/audio/test.mp3');
            const answerPath = this.props.audioPath + v.audio;
            return (
                <View key={i} style={{ paddingHorizontal: 14 * SCALE }}>
                    <View style={{ backgroundColor: '#ebfef5', padding: 27 * SCALE, marginTop: 20 * SCALE }}>
                        <View
                            style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {
                                (v.prompt || v.text) ? <Text style={{ flex: 1 }}>{v.prompt || v.text}</Text> : null
                            }
                            {
                                v.audio ? (
                                <View style={{ flexDirection: 'row',alignItems:'center' }}>
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
                                ) : null
                            }
                        </View>
                    </View>
                    {contentList}
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
