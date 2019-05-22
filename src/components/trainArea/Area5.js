import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE, SCALE2, SCALE1, getAnswerColor4, getAnswerColorText4, getContentScore } from '../utils'
import * as components from '../../components/ui';
import * as soundComponent from '../../components/sound';
// 银川听力选图
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
    changeContentSelected = (i, si, id) => {
        const { paperData, renderQuestionIndex, renderAreaIndex } = this.props;
        const contents = paperData.areas[renderAreaIndex].questions[renderQuestionIndex].contents;
        const newPaperData = { ...paperData };
        newPaperData.areas[renderAreaIndex].questions[renderQuestionIndex].contents[i].selected = id;
        this.props.changePaperData(newPaperData);
        setTimeout(() => {
            const newAnswer = { ...this.props.paperAnswer };
            const question = this.props.paperData.areas[renderAreaIndex].questions[renderQuestionIndex];
            let content = question.contents[i];
            // 是否已经选过
            let ifSame = false;
            newAnswer.recordguid.forEach((v, ssi) => {
                if (v.guid === contents[i].guid) {
                    newAnswer.recordguid[ssi].answer = contents[i].options.option[si].guid;
                    newAnswer.recordguid[ssi].score = getContentScore( this.props.paperData.areas[renderAreaIndex], question, content)
                    ifSame = true;
                }
            });
            if (!ifSame) {
                newAnswer.recordguid.push({
                    guid: contents[i].guid,
                    answer: contents[i].options.option[si].guid || '',
                    score: getContentScore( this.props.paperData.areas[renderAreaIndex], question, content)
                });
            }
            this.props.changePaperAnswer(newAnswer);
        }, 0);
    }
    render() {
        const area = this.props.paperData.areas[this.props.renderAreaIndex];
        const question = area.questions[this.props.renderQuestionIndex];
        const result = question.contents[this.props.renderContentIndex].recordResult;
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
            const answerPath = this.props.audioPath + v.audio;
            return (
                <View key={v.guid} style={{ marginTop: 30 * SCALE }}>

                    <View style={{ height: 44 * SCALE }}>
                        <TouchableOpacity
                            style={{ borderRadius: 3 * SCALE, width: 130 * SCALE, height: 44 * SCALE, backgroundColor: '#f5f5f5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1 * SCALE, borderColor: '#ddd' }}
                            onPress={() => {
                                console.log('answerPath====',answerPath);
                                this.playAudio(answerPath)
                            }}
                            activeOpacity={0.5}>
                            <Image style={{ marginRight: 8 * SCALE, width: 26 * SCALE, height: 20 * SCALE }}
                                   source={this.props.soundSrc == answerPath ? require('../../../resource/img/labagif.gif') : require('../../../resource/img/cklxjg_play.png')}
                            ></Image>
                            <Text style={{ fontSize: 18 * SCALE }}>原文播放</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        question.prompt || question.text ? (
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 16 * SCALE, backgroundColor: '#f5f5f5', paddingHorizontal: 11 * SCALE, marginTop: 21 * SCALE, borderRadius: 2 * SCALE, height: 36 * SCALE, lineHeight: 36 * SCALE }}>{question.prompt || question.text}</Text>
                            </View>
                        ) : null
                    }

                    <Text style={{ fontSize: 20 * SCALE }}>Q{v.index}. {v.text}</Text>
                    <View style={{flexDirection:'row'}}>
                        {
                            v.options.option.sort((a,b)=>{return Number(a.index)-Number(b.index)}).map((sv, si) => {
                                let circleColor = "#cccccc";
                                let icon = null;
                                let imageUrl = "file://" + this.props.audioPath + sv.content;
                                if (v.selected) {// 开始做题
                                    if (sv.guid == v.selected) {// 选中项
                                        if (sv.guid === v.answers.answer.content) {// 正确答案
                                            circleColor = '#1cb870';
                                            icon = (
                                                <Image style={{ marginLeft: 10 * SCALE, width: 23 * SCALE, height: 15 * SCALE }}
                                                       source={require('../../../resource/img/tx_right.png')}
                                                ></Image>
                                            );
                                        } else {// 选中的错误答案
                                            circleColor = '#ff0000';
                                            icon = (
                                                <Image style={{ marginLeft: 10 * SCALE, width: 18 * SCALE, height: 18 * SCALE }}
                                                       source={require('../../../resource/img/tx_fault.png')}
                                                ></Image>
                                            );
                                        }
                                    }
                                }
                                return (
                                    <View key={sv.guid} style={{ marginTop: 20 * SCALE,flex:1 }}>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                            onPress={() => {
                                                this.changeContentSelected(i, si, sv.guid);
                                            }}
                                            activeOpacity={0.5}>
                                            <View style={{ width: 40 * SCALE, height: 40 * SCALE, borderRadius: 20 * SCALE, backgroundColor: circleColor, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 20 * SCALE, color: '#fff' }}>{String.fromCharCode((si+1).toString().charCodeAt() + 16)}</Text>
                                            </View>
                                            {/*<Text style={{ fontSize: 18 * SCALE, marginLeft: 12 * SCALE }}>{imageUrl}</Text>*/}
                                            <Image
                                                style={styles.img}
                                                source={{uri:imageUrl}}
                                            />


                                            {icon}
                                        </TouchableOpacity>
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
                <View style={{ height: 60 * SCALE, alignItems: 'center', borderBottomColor: '#e8e8e8', borderBottomWidth: 1 * SCALE, paddingHorizontal: 27 * SCALE, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 20 * SCALE }}>{area.title}（{scoreText}）</Text>
                    {this.props.areaCount}
                </View>
                <ScrollView showsVerticalScrollIndicator={true} style={{ paddingHorizontal: 27 * SCALE, paddingVertical: 15 * SCALE, flex: 1 }}>
                    <Text style={{ fontSize: 15 * SCALE, }}>{area.prompt}</Text>
                    <View style={{
                        marginVertical: 15 * SCALE1,
                        paddingBottom: 30 * SCALE,
                        borderRadius: 3 * SCALE2, backgroundColor: 'white', flex: 1
                    }}>
                        {/*<View style={{ height: 44 * SCALE }}>*/}
                            {/*<TouchableOpacity*/}
                                {/*style={{ borderRadius: 3 * SCALE, width: 130 * SCALE, height: 44 * SCALE, backgroundColor: '#f5f5f5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1 * SCALE, borderColor: '#ddd' }}*/}
                                {/*onPress={() => {*/}
                                    {/*console.log('answerPath====',answerPath);*/}
                                    {/*this.playAudio(answerPath)*/}
                                {/*}}*/}
                                {/*activeOpacity={0.5}>*/}
                                {/*<Image style={{ marginRight: 8 * SCALE, width: 26 * SCALE, height: 20 * SCALE }}*/}
                                    {/*source={this.props.soundSrc == answerPath ? require('../../../resource/img/labagif.gif') : require('../../../resource/img/cklxjg_play.png')}*/}
                                {/*></Image>*/}
                                {/*<Text style={{ fontSize: 18 * SCALE }}>原文播放</Text>*/}
                            {/*</TouchableOpacity>*/}
                        {/*</View>*/}
                        {/*{*/}
                            {/*question.prompt || question.text ? (*/}
                                {/*<View style={{ flexDirection: 'row' }}>*/}
                                    {/*<Text style={{ fontSize: 16 * SCALE, backgroundColor: '#f5f5f5', paddingHorizontal: 11 * SCALE, marginTop: 21 * SCALE, borderRadius: 2 * SCALE, height: 36 * SCALE, lineHeight: 36 * SCALE }}>{question.prompt || question.text}</Text>*/}
                                {/*</View>*/}
                            {/*) : null*/}
                        {/*}*/}
                        {contents}
                    </View>
                </ScrollView>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    status: {
        width: 6 * SCALE1,
        height: 6 * SCALE1,
        marginLeft: 4 * SCALE1
    },
    img:{
        marginLeft: 12 * SCALE,
        height:200*SCALE,
        width:200*SCALE,
    }
})
function mapStateToProps(state) {
    const { audioPath, paperData, paperAnswer } = state.paper;
    const { soundSrc } = state.global;
    return {
        audioPath,
        paperData,
        soundSrc,
        paperAnswer
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Area);
