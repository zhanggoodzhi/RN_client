import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE, SCALE2, SCALE1, getAnswerColor4, getAnswerColorText4, getObj } from '../utils'
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

    ValidateScore(score) {
        return score == 1 || score == 2 || score == 3 || score == 4;
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
        const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
        const area = paperData.areas[areaIndex];
        const question = area.questions[questionIndex];
        const lastContent = question.contents[question.contents.length - 1];
        const result = lastContent.recordResult;
        // if (!result) {
        //     return null;
        // }
        const lastAnswers = lastContent.answers.answer.map((v, i) => {
            return (
                <View key={i} style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 8 * SCALE, color: '#555', marginRight: 3 * SCALE, marginTop: 7 * SCALE }}>●</Text>
                    <Text style={{ fontSize: 18 * SCALE, color: '#555' }}>{v.content}</Text>
                </View>
            );
        });
        const contents = question.contents.map((v, i) => {
            if (i !== question.contents.length - 1) {
                const result = v.recordResult;
                const percent = result && (result.overall / result.rank);
                let answers;
                if (v.answers.answer.length) {
                    answers = v.answers.answer.map((sv, si) => {
                        return sv.content;
                    }).join(' / ');
                } else {
                    answers = v.answers.answer.content;
                }
                let ifCorrect = this.ifCorrectAnswer(v.currentAnswer, v.answers.answer);
                return (
                    <View key={i}>
                        <View style={{ width: 1190 * SCALE, flexDirection: 'row', paddingBottom: 15 * SCALE, marginVertical: 5 * SCALE }}>
                            <ImageBackground style={{ justifyContent: 'center', width: 39 * SCALE, height: 26 * SCALE }}
                                source={require('../../../resource/img/tx_cklxjg_arrow.png')}>
                                <Text style={{ paddingLeft: 10 * SCALE, fontSize: 20 * SCALE }}>
                                    {v.index}
                                </Text>
                            </ImageBackground>
                            <View style={{ marginLeft: 20 * SCALE }}>
                                <Text style={{ flex: 1, fontSize: 20 * SCALE, color: ifCorrect ? '#18b06c' : '#ff0000', paddingHorizontal: 30 * SCALE }}>
                                    {v.currentAnswer}
                                </Text>
                                <View style={{ height: 1 * SCALE, backgroundColor: ifCorrect ? '#a6a6a6' : '#ff0000' }}></View>
                            </View>
                        </View>
                        <View style={{ borderWidth: 1 * SCALE1, borderRadius: 3 * SCALE1, backgroundColor: '#f9f9f9', borderColor: '#e9e9e9', paddingVertical: 15 * SCALE, marginBottom: 15 * SCALE }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 23 * SCALE }}>
                                <Image
                                    style={styles.imgItem}
                                    source={require('../../../resource/img/ck.png')}
                                ></Image>
                                <Text style={styles.nFont}>参考答案：</Text>
                            </View>
                            <View style={{ marginVertical: 5 * SCALE, paddingHorizontal: 23 * SCALE }}>
                                <Text>{answers}</Text>
                            </View>
                            <Image style={{ width: 1214 * SCALE, height: 2 * SCALE, marginVertical: 15 * SCALE }}
                                source={require('../../../resource/img/tx_dajx_line.png')}
                            ></Image>
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 23 * SCALE }}>
                                <Text style={styles.nFont}>得分：</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 26 * SCALE1, color: '#fd3736', textAlignVertical: 'bottom' }}>{ifCorrect ? Number(getObj(v.score).content).toFixed(1) : "0.0"}</Text>
                                    <Text style={{ fontSize: 12 * SCALE1, color: '#999', textAlignVertical: 'bottom', marginBottom: 5 * SCALE1 }}>/总分：{getObj(v.score).content}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            }
        });
        const percent = result && (result.overall / result.rank);
        const answerPath = this.props.audioPath + question.audio;
        const myPath = this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents[question.contents.length - 1].stuRadioFilePath;
        let colorText = null;
        let preLastWord = '';
        let contentsCount = 0;
        let scoreCount = 0;
        area.questions.forEach(v => {
            scoreCount += Number(v.score);
            v.contents.forEach(sv => {
                contentsCount++;
                // scoreCount = scoreCount +sv.
            })
        });
        const imageUrl = "file://" + this.props.audioPath + question.image;
        const section2Score = getObj(question.contents[question.contents.length - 1].score).content;
        const scoreText = area.questions.length === 1 ? '计' + question.score + '分' : `共${contentsCount}小题;满分${scoreCount}分`;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: '#f5f5f5', padding: 24 * SCALE }}>
                    <Text style={{ fontSize: 20 * SCALE }}>{area.title}（{scoreText}）</Text>
                    <Text style={{ fontSize: 16 * SCALE, marginTop: 32 * SCALE }}>{area.prompt}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 45 * SCALE, paddingTop: 10 * SCALE }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 * SCALE }}>【听力原文】</Text>
                        <TouchableOpacity
                            style={{ padding: 11 * SCALE }}
                            onPress={() => { this.playAudio(answerPath) }}
                            activeOpacity={0.5}>
                            <Image style={{ width: 26 * SCALE, height: 20 * SCALE }}
                                source={this.props.soundSrc == answerPath ? require('../../../resource/img/labagif.gif') : require('../../../resource/img/cklxjg_play.png')}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 20 * SCALE, lineHeight: 33 * SCALE }}>
                        {question.audiotext}
                    </Text>
                    <Image style={{ width: 1214 * SCALE, height: 2 * SCALE, marginVertical: 20 * SCALE }}
                        source={require('../../../resource/img/tx_dajx_line.png')}
                    ></Image>
                    {
                        this.props.ifSection2 ? (
                            <Text style={{ fontSize: 20 * SCALE }}>第二节 信息转述</Text>
                        ) :
                            (
                                <Text style={{ fontSize: 20 * SCALE }}>第一节 填空题</Text>
                            )
                    }
                    <View style={{ alignItems: 'center', marginVertical: 15 * SCALE }}>
                        <FixedWidthImage width={752 * SCALE} imageUrl={imageUrl}>
                        </FixedWidthImage>
                    </View>
                    {
                        this.props.ifSection2 ? (
                            <View style={{ marginBottom: 30 * SCALE, alignItems: 'center' }}>
                                <Text style={{ fontSize: 16 * SCALE1, width: 752 * SCALE }}>{lastContent.tips}</Text>
                            </View>
                        ) : null
                    }
                    {
                        this.props.ifSection2 ? (
                            <View>
                                <View style={{ width: 1190 * SCALE, paddingBottom: 15 * SCALE, marginVertical: 5 * SCALE }}>
                                    <Text style={{ fontSize: 20 * SCALE }} numberOfLines={10}>
                                        {lastContent.text}
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
                                        {lastAnswers}
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={styles.imgItem}
                                            source={require('../../../resource/img/people.png')}
                                        ></Image>
                                        <Text style={styles.nFont}>我的答案:</Text>
                                        <TouchableOpacity
                                            style={{ padding: 11 * SCALE }}
                                            onPress={() => { this.playAudio(myPath) }}
                                            activeOpacity={0.5}>
                                            <Image style={{ width: 26 * SCALE, height: 20 * SCALE }}
                                                source={this.props.soundSrc == myPath ? require('../../../resource/img/labagif.gif') : require('../../../resource/img/cklxjg_play.png')}
                                            ></Image>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 * SCALE }}>
                                        <Image style={styles.imgItem}
                                            source={require('../../../resource/img/score.png')}
                                        ></Image>
                                        <Text style={styles.nFont}>得分：</Text>
                                        <View style={{ flexDirection: 'row', height: 33 * SCALE1 }}>
                                            <Text style={{ fontSize: 26 * SCALE1, color: '#fd3736', textAlignVertical: 'bottom' }}>{Number(percent * section2Score).toFixed(1)}</Text>
                                            <Text style={{ fontSize: 12 * SCALE1, color: '#999', textAlignVertical: 'bottom', marginBottom: 5 * SCALE1 }}>/总分：{section2Score}</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        marginLeft: 21 * SCALE1, borderColor: '#ededed', borderRadius: 3 * SCALE1, borderWidth: 1 * SCALE1, width: 500 * SCALE1,
                                        paddingHorizontal: 24 * SCALE1, paddingVertical: 12 * SCALE1, backgroundColor: 'white'
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 16 * SCALE }}>语义完整度：</Text>
                                            <Text style={{ fontSize: 16 * SCALE, color: getAnswerColor4(result.details.semcmp) }}>{getAnswerColorText4(result.details.semcmp)}</Text>
                                            <Text style={{ fontSize: 16 * SCALE, marginLeft: 20 * SCALE1 }}>流利度：</Text>
                                            <Text style={{ fontSize: 16 * SCALE, color: getAnswerColor4(result.details.fluency.score) }}>{getAnswerColorText4(result.details.fluency.score)}</Text>
                                            <Text style={{ fontSize: 16 * SCALE, marginLeft: 20 * SCALE1 }}>停顿次数：</Text>
                                            <Text style={{ fontSize: 16 * SCALE }}><Text style={{}}>{result.details.fluency.max_bt_wrds}</Text> 次</Text>
                                            <Text style={{ fontSize: 16 * SCALE, marginLeft: 20 * SCALE1 }}>语速：</Text>
                                            <Text style={{ fontSize: 16 * SCALE }}><Text style={{}}>{result.details.fluency.speed}</Text> 词/分钟</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ) : contents
                    }
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
    const { audioPath, paperData, questionIndex, contentIndex, areaIndex, ifSection2 } = state.paper;
    const { soundSrc } = state.global;
    return {
        audioPath,
        paperData,
        questionIndex,
        areaIndex,
        contentIndex,
        soundSrc,
        ifSection2
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Area);

