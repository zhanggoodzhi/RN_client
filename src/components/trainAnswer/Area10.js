import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE, SCALE2, SCALE1, getAnswerColor4, getAnswerColorText4, getObj } from '../utils'
import * as components from '../../components/ui';
import * as soundComponent from '../../components/sound';
import FixedWidthImage from '../trainArea/FixedWidthImage';
// 话题简述
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

    GetComment(integrity, fluency, pron) {
        let comment = "";
        if (integrity < 1) integrity = 1;
        if (fluency < 1) fluency = 1;
        if (pron < 1) pron = 1;
        if (integrity > 4) integrity = 4;
        if (fluency > 4) fluency = 4;
        if (pron > 4) pron = 4;

        if (!(this.ValidateScore(integrity) || this.ValidateScore(fluency) || this.ValidateScore(pron))) return "";

        comment += this.Integrity(integrity);

        if (integrity == 1 || integrity == 2) {
            if (fluency == 1 || fluency == 2) {
                comment += "，并且" + this.Fluency(fluency);
            }
            else {
                comment += "，但是" + this.Fluency(fluency);
            }
        }
        else {
            if (fluency == 1 || fluency == 2) {
                comment += "，但是" + this.Fluency(fluency);
            }
            else {
                comment += "，并且" + this.Fluency(fluency);
            }
        }

        if (fluency == 1 || fluency == 2) {
            if (pron == 1 || pron == 2) {
                comment += "，" + this.pron1(pron);
            }
            else {
                comment += "，" + this.pron2(pron);
            }
        }
        else {
            if (pron == 1 || pron == 2) {
                comment += "，" + this.pron2(pron);
            }
            else {
                comment += "，" + this.pron1(pron);
            }
        }

        return comment;
    }

    ValidateScore(score) {
        return score == 1 || score == 2 || score == 3 || score == 4;
    }

    /// <summary>
    /// 完整度
    /// </summary>
    /// <param name="score"></param>
    /// <returns></returns>
    Integrity(score) {
        let comment = "";
        switch (score) {
            case 1:
                comment = "只能读出少数的句子和词汇";
                break;
            case 2:
                comment = "只能读出部分的句子和词汇";
                break;
            case 3:
                comment = "能读出大多数句子";
                break;
            case 4:
                comment = "能完整地朗读短文";
                break;
        }

        return comment;
    }

    /// <summary>
    /// 流利度
    /// </summary>
    /// <param name="score"></param>
    /// <returns></returns>

    Fluency(score) {
        let comment = "";
        switch (score) {
            case 1:
                comment = "朗读不连贯，影响意思表达";
                break;
            case 2:
                comment = "朗读不够连贯，错误较多";
                break;
            case 3:
                comment = "朗读比较自然流利";
                break;
            case 4:
                comment = "朗读自然流利，语速适中，有节奏感";
                break;
        }

        return comment;
    }

    /// <summary>
    /// 发音
    /// </summary>
    /// <param name="score"></param>
    /// <returns></returns>
    pron1(score) {
        let comment = "";
        switch (score) {
            case 1:
                comment = "发音错误也很多";
                break;
            case 2:
                comment = "发音也不够准确";
                break;
            case 3:
                comment = "发音也基本准确，只有少量错误";
                break;
            case 4:
                comment = "发音也特别棒";
                break;
        }

        return comment;
    }

    pron2(score) {
        let comment = "";
        switch (score) {
            case 1:
                comment = "发音错误却很多";
                break;
            case 2:
                comment = "发音却不够准确";
                break;
            case 3:
                comment = "发音却基本准确，只有少量错误";
                break;
            case 4:
                comment = "发音也特别棒";
                break;
        }

        return comment;
    }

    /// <summary>
    /// 音律
    /// </summary>
    /// <param name="score"></param>
    /// <returns></returns>
    rhythm(score) {
        let comment = "";
        switch (score) {
            case 1:
                comment = "";
                break;
            case 2:
                comment = "";
                break;
            case 3:
                comment = "";
                break;
            case 4:
                comment = "";
                break;
        }

        return comment;
    }

    render() {
        const { paperData, areaIndex, questionIndex, contentIndex } = this.props;
        const area = paperData.areas[areaIndex];
        const question = area.questions[questionIndex];
        const result = question.contents[contentIndex].recordResult;
        const content = question.contents[0];
        if (!result) {
            return null;
        }
        const percent = result && (result.overall / result.rank);
        console.log(this.props.audioPath);
        const answerPath = this.props.audioPath + this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents[0].audio;
        const myPath = this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents[contentIndex].stuRadioFilePath;
        let arrs = [];
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
        const scoreText = area.questions.length === 1 ? '计' + question.score + '分' : `共${contentsCount}小题;满分${scoreCount}分`;
        const answers = content.answers.answer.map((sv, si) => {
            return (
                <View key={si} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 8 * SCALE, color: '#555', marginRight: 3 * SCALE }}>●</Text>
                    <Text style={{ fontSize: 18 * SCALE, color: '#555' }}>{sv.content}</Text>
                </View>
            );
        });
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: '#f5f5f5', padding: 24 * SCALE }}>
                    <Text style={{ fontSize: 20 * SCALE }}>{area.title}（{scoreText}）</Text>
                    <Text style={{ fontSize: 16 * SCALE, marginTop: 32 * SCALE }}>{area.prompt}</Text>
                </View>
                <View style={{ paddingLeft: 24 * SCALE }}>
                    <Text style={{ fontSize: 15 * SCALE, lineHeight: 33 * SCALE }}>{content.text}</Text>
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
                            <View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 * SCALE }}>
                                    <Image style={styles.imgItem}
                                        source={require('../../../resource/img/score.png')}
                                    ></Image>
                                    <Text style={styles.nFont}>得分：</Text>
                                    <View style={{ flexDirection: 'row', height: 33 * SCALE1 }}>
                                        <Text style={{ fontSize: 26 * SCALE1, color: '#fd3736', textAlignVertical: 'bottom' }}>{Number(percent * getObj(content.score).content).toFixed(1)}</Text>
                                        <Text style={{ fontSize: 12 * SCALE1, color: '#999', textAlignVertical: 'bottom', marginBottom: 5 * SCALE1 }}>/总分：{getObj(content.score).content}</Text>
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
                        ) : null
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

