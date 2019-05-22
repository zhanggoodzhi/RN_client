import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE, SCALE2, SCALE1, getAnswerColor4, getAnswerColorText4 } from '../utils'
import * as components from '../../components/ui';
import * as soundComponent from '../../components/sound';
// 听短文答题
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
            const contentList = v.contents.map((sv, si) => {
                const answerPath = this.props.audioPath + sv.audio;
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
                return (
                    <View key={i + '-' + si} style={{ marginVertical: 30 * SCALE }}>

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
                            <Text style={{ fontSize: 20 * SCALE, marginTop: 15 * SCALE }}>{sv.audiotext}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <ImageBackground style={{ justifyContent: 'center', width: 39 * SCALE, height: 26 * SCALE }}
                                source={require('../../../resource/img/tx_cklxjg_arrow.png')}>
                                <Text style={{ paddingLeft: 10 * SCALE, fontSize: 20 * SCALE }}>
                                    {sv.index}
                                </Text>
                            </ImageBackground>
                            <Text style={{ fontSize: 20 * SCALE, marginLeft: 10 * SCALE }}>{sv.text}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 51 * SCALE }}>
                            {
                                sv.options.option.sort((a,b)=>{return Number(a.index)-Number(b.index)}).map((ssv, ssi) => {
                                    let circleColor = "#cccccc";
                                    icon = null;
                                    if (ssv.guid === sv.answers.answer.content) {// 正确答案
                                        circleColor = '#1cb870';
                                        icon = (
                                            <Image style={{ marginLeft: 10 * SCALE, width: 23 * SCALE, height: 15 * SCALE }}
                                                source={require('../../../resource/img/tx_right.png')}
                                            ></Image>
                                        );
                                    } else if (ssv.guid == sv.selected && ssv.guid !== sv.answers.answer.content) {// 选中的错误答案
                                        circleColor = '#ff0000';
                                        icon = (
                                            <Image style={{ marginLeft: 10 * SCALE, width: 18 * SCALE, height: 18 * SCALE }}
                                                source={require('../../../resource/img/tx_fault.png')}
                                            ></Image>
                                        );
                                    }
                                    return (
                                        <View key={ssv + '-' + ssi} style={{ marginRight: ssi === sv.options.option.length - 1 ? 0 : 70 * SCALE, marginTop: 15 * SCALE }}>
                                            <View
                                                style={{ flexDirection: 'row', alignItems: 'center' }}
                                                activeOpacity={0.5}>
                                                <View style={{ width: 40 * SCALE, height: 40 * SCALE, borderRadius: 20 * SCALE, backgroundColor: circleColor, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: 20 * SCALE, color: '#fff' }}>{String.fromCharCode((ssi+1).toString().charCodeAt() + 16)}</Text>
                                                </View>
                                                <Text style={{ fontSize: 18 * SCALE, marginLeft: 12 * SCALE }}>{ssv.content}</Text>
                                                {icon}
                                            </View>
                                        </View>
                                    );
                                })
                            }
                        </View>
                        <View style={{ marginTop: 20 * SCALE, paddingLeft: 14 * SCALE, flexDirection: 'row', backgroundColor: '#f2f2f2', height: 50 * SCALE, alignItems: 'center' }}>
                            <Text style={{ fontSize: 18 * SCALE }}>得分：</Text>
                            {contentScoreEl}
                        </View>
                    </View>
                );
            })
            // const answerPath = require('../../../resource/audio/test.mp3');
            // const answerPath = this.props.audioPath + v.audio;
            return (
                <View key={i} style={{ paddingHorizontal: 14 * SCALE }}>
                    {
                        v.prompt ? <Text>{v.prompt}</Text> : null
                    }


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
