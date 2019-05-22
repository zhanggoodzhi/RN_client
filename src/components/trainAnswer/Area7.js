import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE, SCALE2, SCALE1, getAnswerColor4, getAnswerColorText4, getObj } from '../utils'
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
        const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
        const area = paperData.areas[areaIndex];
        const question = area.questions[questionIndex];
        // if (!result) {
        //     return null;
        // }
        let contentsCount = 0;
        let scoreCount = 0;
        area.questions.forEach(v => {
            scoreCount += Number(v.score);
            v.contents.forEach(sv => {
                contentsCount++;
            })
        });
        const scoreText = area.questions.length === 1 ? '计' + question.score + '分' : `共${contentsCount}小题;满分${scoreCount}分`;
        const contents = question.contents.map((v, i) => {
            const answerPath = this.props.audioPath + v.audio;
            const result = v.recordResult;
            const percent = result && (result.overall / result.rank);
            const myPath = v.stuRadioFilePath;
            const answers = v.answers.answer.map((sv, si) => {
                return (
                    <View key={si} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 8 * SCALE, color: '#555', marginRight: 3 * SCALE }}>●</Text>
                        <Text style={{ fontSize: 18 * SCALE, color: '#555' }}>{sv.content}</Text>
                    </View>
                );
            });
            let soundBtn = (
                <TouchableOpacity
                    onPress={() => { this.playAudio(answerPath) }}
                    activeOpacity={0.5}>
                    <Image style={{ width: 20 * SCALE1, height: 25 * SCALE1, marginLeft: 5 * SCALE1 }}
                        source={this.props.soundSrc == answerPath ? require('../../../resource/img/yinping.gif') : require('../../../resource/img/yinpin.png')}
                    ></Image>
                </TouchableOpacity>
            );
            if (!v.audio) {
                soundBtn = null;
            }
            return (
                <View key={i}>
                    <View style={{ width: 1190 * SCALE, flexDirection: 'row', paddingBottom: 15 * SCALE, marginVertical: 5 * SCALE }}>
                        <Text style={{ width: 38 * SCALE, fontSize: 20 * SCALE }}>
                            Q{v.index}.
                        </Text>
                        {soundBtn}
                        <Text style={{ fontSize: 20 * SCALE }} numberOfLines={10}>
                            {v.text}
                        </Text>
                    </View>
                    <View style={{ borderWidth: 1 * SCALE1, borderRadius: 3 * SCALE1, backgroundColor: '#f9f9f9', borderColor: '#e9e9e9', paddingHorizontal: 23 * SCALE, paddingVertical: 26 * SCALE, marginBottom: 15 * SCALE }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={styles.imgItem}
                                source={require('../../../resource/img/ck.png')}
                            ></Image>
                            <Text style={styles.nFont}>参考答案：</Text>
                        </View>
                        <View style={{ marginVertical: 5 * SCALE }}>
                            {answers}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={styles.imgItem}
                                source={require('../../../resource/img/people.png')}
                            ></Image>
                            <Text style={styles.nFont}>我的答案:</Text>
                            {
                                result ? (
                                    <TouchableOpacity
                                        style={{ padding: 11 * SCALE }}
                                        onPress={() => { this.playAudio(myPath) }}
                                        activeOpacity={0.5}>
                                        <Image style={{ width: 26 * SCALE, height: 20 * SCALE }}
                                            source={this.props.soundSrc == myPath ? require('../../../resource/img/labagif.gif') : require('../../../resource/img/cklxjg_play.png')}
                                        ></Image>
                                    </TouchableOpacity>
                                ) : (
                                        <Text style={{ marginLeft: 5 * SCALE, color: '#fd3736', fontSize: 20 * SCALE }}>未答题</Text>
                                    )
                            }
                        </View>
                        {
                            result ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 * SCALE }}>
                                    <Image style={styles.imgItem}
                                        source={require('../../../resource/img/score.png')}
                                    ></Image>
                                    <Text style={styles.nFont}>得分：</Text>
                                    <View style={{ flexDirection: 'row', height: 33 * SCALE1 }}>
                                        <Text style={{ fontSize: 26 * SCALE1, color: '#fd3736', textAlignVertical: 'bottom' }}>{Number(percent * getObj(v.score).content).toFixed(1)}</Text>
                                        <Text style={{ fontSize: 12 * SCALE1, color: '#999', textAlignVertical: 'bottom', marginBottom: 5 * SCALE1 }}>/总分：{getObj(v.score).content}</Text>
                                    </View>
                                </View>
                            ) : null
                        }
                    </View>
                </View>
            );
        });
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: '#f5f5f5', padding: 24 * SCALE }}>
                    <Text style={{ fontSize: 20 * SCALE }}>{area.title}（{scoreText}）</Text>
                    <Text style={{ fontSize: 16 * SCALE, marginTop: 32 * SCALE }}>{area.prompt}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 45 * SCALE, paddingTop: 20 * SCALE }}>
                    {
                        question.audio ? (
                            <View>
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
                            </View>
                        ) : null
                    }
                    <Text style={{ fontSize: 20 * SCALE, marginTop: 15 * SCALE, lineHeight: 33 * SCALE }}>{question.prompt || question.text}</Text>
                    <Image style={{ width: 1214 * SCALE, height: 2 * SCALE, marginVertical: 20 * SCALE }}
                        source={require('../../../resource/img/tx_dajx_line.png')}
                    ></Image>
                    {contents}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    status: {
        width: 6 * SCALE1,
        height: 6 * SCALE1,
        marginLeft: 4 * SCALE1
    },
    imgItem: {
        width: 20 * SCALE,
        height: 20 * SCALE,
        marginRight: 7 * SCALE1,
    },
    nFont: {
        fontSize: 15 * SCALE1,
        color: 'black'
    }
})

function mapStateToProps(state) {
    const { audioPath, paperData, questionIndex, contentIndex, areaIndex } = state.paper;
    const { soundSrc } = state.global;
    return {
        audioPath,
        paperData,
        questionIndex,
        areaIndex,
        contentIndex,
        soundSrc
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Area);

