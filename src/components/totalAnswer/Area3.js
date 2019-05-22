import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE, SCALE2, SCALE1, getAnswerColor4, getAnswerColorText4 } from '../utils'
import * as components from '../../components/ui';
import * as soundComponent from '../../components/sound';
// 朗读短文
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
        const area = this.props.area;
        const questionList = area.questions.map((v, i) => {
            console.log(v.contents);
            const contentList = v.contents.map((sv, si) => {
                const result = sv.recordResult;
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
                let arrs = [];
                let colorText;
                let preLastWord = '';
                if (result) {
                    result.details.forEach((v, i) => {
                        const mark = v.text[v.text.length - 1];
                        v.words.forEach((sv, si) => {
                            let text = sv.text;
                            if (i === 0 && si === 0) {
                                text = text[0].toUpperCase() + text.slice(1);
                            } else if ((preLastWord === '?' || preLastWord === '.') && si === 0) {
                                text = text[0].toUpperCase() + text.slice(1);
                            }
                            arrs.push(<Text key={i.toString() + new Date() + si.toString()} style={{ fontSize: 10 * SCALE2, color: getAnswerColor4(sv.score) }}>{si === 0 ? ' ' : ''}{text}{si === v.words.length - 1 ? '' : ' '}</Text>);
                        });
                        arrs.push(<Text key={i} style={{ fontSize: 10 * SCALE2 }}>{mark}</Text>);
                        preLastWord = v.text[v.text.length - 1];
                        // const allText = question.contents[0].text;
                        // const firstIndex = allText.indexOf(v.text);
                        // const lastIndex = allText.indexOf(v.text) + allText.length + 1;
                        // if (allText[lastIndex] === '↵') {
                        //     arrs.push(<Text key={i} style={{ fontSize: 10 * SCALE2 }}>↵</Text>);
                        // }
                    });
                    colorText = (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {arrs}
                        </View>
                    );
                } else {
                    colorText = (
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Text style={{ color: '#ff2626' }}>{sv.text}</Text>
                        </View>
                    );
                }
                return (
                    <View key={i + '-' + si} style={{ marginVertical: 30 * SCALE }}>
                        {colorText}
                        <View style={{ marginTop: 23 * SCALE, backgroundColor: '#f9f9f9', marginBottom: 15 * SCALE }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 * SCALE, paddingHorizontal: 23 * SCALE }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.nFont}>得分：</Text>
                                    {contentScoreEl}
                                    <Text>   |   整体评价: </Text>
                                    {
                                        result ? (
                                            <Text style={{ width: 750* SCALE }}>{this.GetComment(result.integrity, result.fluency, result.pron)}</Text>
                                        ) : null
                                    }
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
