import React from "react";
import * as soundComponent from "../sound";
import { Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAnswerColor4, getObj, SCALE, SCALE1, SCALE2 } from "../utils";
import { bindActionCreators } from "redux";
import * as actions from "../../redux/actions";
import connect from "react-redux/es/connect/connect";
import FixedWidthImage from "./FixedWidthImage";
//听对话填空
class Area extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgHeight: 0,
            canTurnBig: true
        };
    }
    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _keyboardDidShow = () => {
        console.log('show');
        this.setState({
            canTurnBig: false
        });
    }
    _keyboardDidHide = () => {
        console.log('hide');
        this.setState({
            canTurnBig: true
        });
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
    ifFillCorrectAnswer = (currentAnswer, answers) => {
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
    submitAnswer() {
        console.log('提交答案');

        const area = this.props.paperData.areas[this.props.renderAreaIndex];
        const question = area.questions[this.props.renderQuestionIndex];
        const newPaperData = { ...this.props.paperData };
        const newAnswer = { ...this.props.paperAnswer };

        console.log('newPaperData', newPaperData);

        console.log('newAnswer', newAnswer);

        question.contents.map((v, i) => {
            // if (i !== question.contents.length - 1) {
            newPaperData.areas[this.props.renderAreaIndex].questions[this.props.renderQuestionIndex].contents[i].currentAnswer = this.state['text' + i] || '';
            // 记录到答案上
            let ifAlready = false;
            newAnswer.recordguid.forEach((sv, si) => {
                if (sv.guid === v.guid) {
                    newAnswer.recordguid[si].answer = this.state['text' + i] || '';
                    newAnswer.recordguid[si].score = this.ifFillCorrectAnswer(this.state['text' + i] || '', v.answers.answer) ? getObj(v.score).content : 0
                    ifAlready = true;
                }
            });
            if (!ifAlready) {
                newAnswer.recordguid.push({
                    guid: v.guid,
                    answer: this.state['text' + i] || '',
                    score: this.ifFillCorrectAnswer(this.state['text' + i] || '', v.answers.answer) ? getObj(v.score).content : 0
                });
            }
            // }
        });
        this.props.changePaperData(newPaperData);
        this.props.changePaperAnswer(newAnswer);
    }
    ifCorrectAnswer(currentAnswer, answers) {
        console.log('currentAnswer', currentAnswer);
        console.log('answers', answers);
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
        const area = this.props.paperData.areas[this.props.renderAreaIndex];
        const question = area.questions[this.props.renderQuestionIndex];
        const result = question.contents[question.contents.length - 1].recordResult;
        // const ifSection2 = this.props.ifSection2;
        const percent = result && (result.overall / result.rank);
        // const answerPath = require('../../../resource/audio/test.mp3');
        const answerPath = this.props.audioPath + question.audio;
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
        let section1Score = 0;
        let section1AllScore = 0;
        const items = question.contents.map((v, i) => {
            // if (i !== question.contents.length - 1) {
            const obj = {};
            section1AllScore += Number(getObj(v.score).content);
            let ifWrong = false;
            if (v.currentAnswer !== undefined && !this.ifCorrectAnswer(v.currentAnswer, v.answers.answer)) {
                ifWrong = true;
            }
            if (!ifWrong) {
                section1Score += Number(getObj(v.score).content);
            }
            // const already = this.props.paperAnswer.recordguid.filter(sv => {
            //     return v.guid === sv.guid;
            // });
            // if (already.length && !this.ifCorrectAnswer(already[0].answer, v.answers.answer)) {
            //     ifWrong = true;
            // }
            let borderColor;
            let backgroundColor;
            // if (ifSection2) {
            //     borderColor = '#d4d4d4';
            //     backgroundColor = '#f6f6f7';
            // } else
                if (ifWrong) {
                borderColor = '#ff0000';
                backgroundColor = '#ffecec';
            } else {
                borderColor = '#1cb870';
                backgroundColor = '#d8f5e7';

            }
            return (
                <View key={i} style={{ flexDirection: 'row', marginLeft: i === 0 ? 0 : 49 * SCALE, borderWidth: 1 * SCALE1, borderColor: borderColor }}>
                    <Text style={{ width: 44 * SCALE, height: 44 * SCALE, fontSize: 16 * SCALE1, textAlign: 'center', lineHeight: 44 * SCALE, borderRightWidth: 1 * SCALE, borderColor: borderColor, backgroundColor: backgroundColor }}>{i + 1}</Text>
                    <TextInput
                        editable={true}
                        ref={'text' + i}
                        keyboardType="email-address"
                        underlineColorAndroid="transparent"
                        returnKeyLabel={i !== question.contents.length - 1 ? '下一题' : '完成'}
                        returnKeyType={i !== question.contents.length - 1 ? 'next' : 'done'}
                        maxLength={30}
                        style={{ width: 151 * SCALE, height: 44 * SCALE, padding: 5 * SCALE1, fontSize: 12 * SCALE1 }}
                        onSubmitEditing={() => {
                            if (i !== question.contents.length - 1) {
                                this.refs['text' + (i + 1)].focus();
                            } else {

                            }
                        }}
                        onChangeText={(text) => {
                            const str = 'text' + i;
                            // obj[str] = text.replace(/[^\w|\s]/g, '');
                            obj[str] = text;
                            this.setState(obj)
                        }}
                        value={this.state['text' + i] || ''}
                    />
                </View>
            );
            // }
        });

        const imageUrl = "file://" + this.props.audioPath + question.image;
        // const imageUrl ="http://gss0.bdstatic.com/5foIcy0a2gI2n2jgoY3K/static/fisp_static/common/img/sidebar/report_02cdef2.png",
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 60 * SCALE, alignItems: 'center', borderBottomColor: '#e8e8e8', borderBottomWidth: 1 * SCALE, paddingHorizontal: 27 * SCALE, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 20 * SCALE }}>{area.title}（{scoreText}）</Text>
                    {this.props.areaCount}
                </View>
                <ScrollView showsVerticalScrollIndicator={true} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={true} style={{ paddingHorizontal: 27 * SCALE, paddingVertical: 15 * SCALE, flex: 1 }}>
                    <Text style={{ fontSize: 15 * SCALE, }}>{area.prompt}</Text>
                    <View style={{
                        marginVertical: 15 * SCALE1,
                        borderRadius: 3 * SCALE2, backgroundColor: 'white', flex: 1
                    }}>
                        <View style={{ marginTop: 10 * SCALE, width: 1184 * SCALE, width: 1184 * SCALE, borderRadius: 4 * SCALE, borderWidth: 1 * SCALE, borderColor: '#1cb870' }}>
                            <TouchableOpacity
                                style={{ position: 'absolute', left: 10 * SCALE, top: 10 * SCALE, borderRadius: 3 * SCALE, width: 130 * SCALE, height: 44 * SCALE, backgroundColor: '#f5f5f5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1 * SCALE, borderColor: '#ddd' }}
                                onPress={() => {
                                    if (this.props.trainRecordState !== 'recording') {
                                        this.playAudio(answerPath);
                                    } else {
                                        this.props.openStopRadioModal();
                                    }
                                }}
                                activeOpacity={0.5}>
                                <Image style={{ marginRight: 8 * SCALE, width: 26 * SCALE, height: 20 * SCALE }}
                                    source={this.props.soundSrc == answerPath ? require('../../../resource/img/labagif.gif') : require('../../../resource/img/cklxjg_play.png')}
                                ></Image>
                                <Text style={{ fontSize: 18 * SCALE }}>原文播放</Text>
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center', marginVertical: 15 * SCALE }}>
                                <TouchableOpacity
                                    disabled={!this.state.canTurnBig}
                                    onPress={() => {
                                        this.props.openImageModal(imageUrl);
                                    }}
                                    activeOpacity={0.5}>
                                    <FixedWidthImage width={752 * SCALE} imageUrl={imageUrl}>
                                    </FixedWidthImage>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 25 * SCALE, marginBottom: !this.props.ifHasAnswer ? 30 * SCALE : 0 }}>
                    {items}
                </View>

                {
                    this.props.ifHasAnswer ? (
                        <View style={{ flexDirection: 'row', height: 30 * SCALE1, marginTop: 20 * SCALE, marginBottom: 10 * SCALE, paddingHorizontal: 27 * SCALE, justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 26 * SCALE1, color: '#fd3736', textAlignVertical: 'bottom' }}>{Number(section1Score).toFixed(1)}</Text>
                            <Text style={{ fontSize: 12 * SCALE1, color: '#999', textAlignVertical: 'bottom', marginBottom: 5 * SCALE1 }}>/总分：{section1AllScore}</Text>
                        </View>
                    ) : null
                }
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
    const { audioPath, paperData, paperAnswer } = state.paper;
    const { soundSrc, trainRecordState } = state.global;
    return {
        audioPath,
        paperData,
        soundSrc,
        paperAnswer,
        // ifSection2,
        trainRecordState
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Area);