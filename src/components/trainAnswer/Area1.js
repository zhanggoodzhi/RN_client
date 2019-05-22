import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
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
        const area = this.props.paperData.areas[this.props.areaIndex];
        const question = area.questions[this.props.questionIndex];
        const result = question.contents[this.props.contentIndex].recordResult;
        // const answerPath = require('../../../resource/audio/test.mp3');
        const answerPath = this.props.audioPath + question.contents[0].audio;
        // const answerPath = require('../../../resource/audio/test.mp3');
        let contentsCount = 0;
        let scoreCount = 0;
        area.questions.forEach(v => {
            scoreCount += Number(v.score);
            v.contents.forEach(sv => {
                contentsCount++;
                // scoreCount = scoreCount +sv.
            })
        });
        const scoreText = area.questions.length === 1 ? '计' + question.score + '分' : `共${contentsCount}小题;满分${scoreCount}分`;
        const contents = question.contents.map((v, i) => {
            return (
                <View key={i} style={{ marginTop: 36 * SCALE }}>
                    <Text style={{ fontSize: 20 * SCALE }}>Q{v.index}. {v.text}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                            v.options.option.sort((a,b)=>{return Number(a.index)-Number(b.index)}).map((sv, si) => {
                                let circleColor = "#cccccc";
                                icon = null;
                                if (sv.guid === v.answers.answer.content) {// 正确答案
                                    circleColor = '#1cb870';
                                    icon = (
                                        <Image style={{ marginLeft: 10 * SCALE, width: 23 * SCALE, height: 15 * SCALE }}
                                            source={require('../../../resource/img/tx_right.png')}
                                        ></Image>
                                    );
                                } else if (sv.guid == v.selected && sv.guid !== v.answers.answer.content) {// 选中的错误答案
                                    circleColor = '#ff0000';
                                    icon = (
                                        <Image style={{ marginLeft: 10 * SCALE, width: 18 * SCALE, height: 18 * SCALE }}
                                            source={require('../../../resource/img/tx_fault.png')}
                                        ></Image>
                                    );
                                }
                                return (
                                    <View key={sv + '-' + si} style={{ marginRight: si === v.options.option.length - 1 ? 0 : 65 * SCALE, marginTop: 20 * SCALE }}>
                                        <View
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                            activeOpacity={0.5}>
                                            <View style={{ width: 40 * SCALE, height: 40 * SCALE, borderRadius: 20 * SCALE, backgroundColor: circleColor, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 20 * SCALE, color: '#fff' }}>{String.fromCharCode((si+1).toString().charCodeAt() + 16)}</Text>
                                            </View>
                                            <Text style={{ fontSize: 18 * SCALE, marginLeft: 12 * SCALE }}>{sv.content}</Text>
                                            {icon}
                                        </View>
                                    </View>
                                );
                            })
                        }
                    </View>
                </View>
            );
        });
        return (
            <View style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 27 * SCALE, paddingVertical: 15 * SCALE, backgroundColor: '#f5f5f5', borderBottomColor: '#e8e8e8', borderBottomWidth: 1 * SCALE, paddingHorizontal: 27 * SCALE, paddingVertical: 23 * SCALE, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 20 * SCALE }}>{area.title}（{scoreText}）</Text>
                    {this.props.areaCount}
                </View>
                <Text style={{ fontSize: 15 * SCALE, paddingHorizontal: 27 * SCALE, paddingVertical: 15 * SCALE, backgroundColor: '#f5f5f5' }}>{area.prompt}</Text>
                <View style={{
                    padding: 30 * SCALE,
                    backgroundColor: 'white',
                    borderRadius: 3 * SCALE2, flex: 1
                }}>
                    <View
                        style={{ borderRadius: 3 * SCALE, width: 130 * SCALE, height: 20 * SCALE, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18 * SCALE }}>【听力原文】</Text>
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
                    <Text style={{ fontSize: 20 * SCALE, marginTop: 15 * SCALE, lineHeight: 33 * SCALE }}>{question.audiotext}</Text>
                    <Image style={{ width: 1214 * SCALE, height: 2 * SCALE, marginTop: 26 * SCALE }}
                        source={require('../../../resource/img/tx_dajx_line.png')}
                    ></Image>
                    {contents}
                    {/* <View style={{ marginVertical: 30 * SCALE }}>
                            <Text style={{ fontSize: 20 * SCALE }}>Q1 . What does the woman think of the subway?</Text>
                            <View style={{ marginTop: 26 * SCALE }}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {

                                    }}
                                    activeOpacity={0.5}>
                                    <View style={{ width: 40 * SCALE, height: 40 * SCALE, borderRadius: 20 * SCALE, backgroundColor: '#ccc', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 20 * SCALE, color: '#fff' }}>A</Text>
                                    </View>
                                    <Text style={{ fontSize: 18 * SCALE, marginLeft: 12 * SCALE }}>To paint her front door.</Text>
                                    <Image style={{ marginLeft: 10 * SCALE, width: 23 * SCALE, height: 15 * SCALE }}
                                        source={require('../../../resource/img/tx_right.png')}
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                        </View> */}
                    {/* <Text style={{ fontSize: 20 * SCALE }}>Q{this.props.renderContentIndex + 1}.</Text> */}
                </View>
            </View >
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
