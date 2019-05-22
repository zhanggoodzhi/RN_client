import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { getObj, COLOR, SCALE, SCALE2, SCALE1, getAnswerColor4, getAnswerColorText4 } from '../utils'
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
        const area = this.props.paperData.areas[this.props.renderAreaIndex];
        const question = area.questions[this.props.renderQuestionIndex];
        // const answerPath = require('../../../resource/audio/test.mp3');
        const answerPath = this.props.audioPath + question.contents[this.props.contentIndex].audio;
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
            const result = v.recordResult;
            const percent = result && (result.overall / result.rank);
            const scoreView = result ? (
                <View style={{ flexDirection: 'row', height: 33 * SCALE1, marginRight: 10 * SCALE }}>
                    <Text style={{ fontSize: 26 * SCALE1, color: '#fd3736', textAlignVertical: 'bottom' }}>{Number(percent * getObj(v.score).content).toFixed(1)}</Text>
                    <Text style={{ fontSize: 12 * SCALE1, color: '#999', textAlignVertical: 'bottom', marginBottom: 5 * SCALE1 }}>/总分：{getObj(v.score).content}</Text>
                </View>
            ) : null
            const ifCurrent = i === this.props.contentIndex;
            let soundBtn = i === this.props.contentIndex ? (
                <TouchableOpacity
                    onPress={() => {
                        if (this.props.trainRecordState !== 'recording') {
                            this.playAudio(answerPath);
                        } else {
                            this.props.openStopRadioModal();
                        }
                     }}
                    activeOpacity={0.5}>
                    <Image style={{ width: 20 * SCALE1, height: 25 * SCALE1, marginLeft: 5 * SCALE1 }}
                        source={this.props.soundSrc == answerPath ? require('../../../resource/img/yinping.gif') : require('../../../resource/img/yinpin.png')}
                    ></Image>
                </TouchableOpacity>
            ) : (
                    <Image style={{ width: 20 * SCALE1, height: 25 * SCALE1, marginLeft: 5 * SCALE1 }}
                        source={require('../../../resource/img/yinpin1.png')}
                    ></Image>
                )
            if (!question.contents[this.props.contentIndex].audio) {
                soundBtn = null;
            }
            return (
                <TouchableOpacity
                    onPress={() => {
                        if (!ifCurrent) {
                            this.props.setContentIndex(i);
                            this.props.cancelRecord();
                            this.props.resetSound();
                        }
                    }}
                    activeOpacity={0.5} key={i} style={{ width: 1190 * SCALE }}>
                    <Image
                        style={{ width: 1190 * SCALE, height: 14 * SCALE, opacity: ifCurrent ? 1 : 0 }}
                        source={require('../../../resource/img/tx_border_top.png')}>
                    </Image>
                    <ImageBackground
                        resizeMode={Image.resizeMode.stretch}
                        fadeDuration={0}
                        style={{ width: 1190 * SCALE, }}
                        source={ifCurrent ? require('../../../resource/img/tx_border_middle.png') : null}>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 20 * SCALE, marginVertical: 5 * SCALE, height: 40 * SCALE, alignItems: 'center' }}>
                            <Text style={{ width: 38 * SCALE, fontSize: 20 * SCALE }}>
                                Q{v.index}.
                                </Text>
                            {soundBtn}
                            <Text style={{ flex: 1, fontSize: 20 * SCALE }} numberOfLines={20}>
                                {v.text}
                            </Text>
                            {scoreView}
                        </View>
                    </ImageBackground>
                    <Image
                        style={{ width: 1190 * SCALE, height: 14 * SCALE, opacity: ifCurrent ? 1 : 0 }}
                        source={require('../../../resource/img/tx_border_bottom.png')}>
                    </Image>
                </TouchableOpacity>
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
                        borderRadius: 3 * SCALE2, backgroundColor: 'white', flex: 1
                    }}>
                        {
                            question.prompt || question.text ? (
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 16 * SCALE, paddingHorizontal: 11 * SCALE, marginBottom: 21 * SCALE, borderRadius: 2 * SCALE, lineHeight: 36 * SCALE }}>{question.prompt || question.text}</Text>
                                </View>
                            ) : null
                        }
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
    }
})
function mapStateToProps(state) {
    const { audioPath, paperData, paperAnswer, contentIndex } = state.paper;
    const { soundSrc, trainRecordState } = state.global;
    return {
        audioPath,
        paperData,
        soundSrc,
        paperAnswer,
        trainRecordState,
        contentIndex
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Area);
