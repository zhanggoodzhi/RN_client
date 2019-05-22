import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE2, SCALE1, getAnswerColor100 } from '../utils'
import * as components from '../../components/ui';
import * as soundComponent from '../../components/sound';
// 单词音标认读
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
        const { area, questionIndex, backEvent, contentIndex } = this.props;
        const question = area.questions[questionIndex];
        const result = question.contents[contentIndex].recordResult;
        const percent = result && (result.overall / result.rank);
        const pronPercent = result && (result.pron / result.rank);
        const answerPath = this.props.audioPath + this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents[0].audio;
        const myPath = this.props.paperData.areas[this.props.areaIndex].questions[this.props.questionIndex].contents[contentIndex].stuRadioFilePath;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ padding: 10 * SCALE2, flex: 1 }}>
                    <View>
                        <Text style={{ fontSize: 12 * SCALE2, fontWeight: 'bold' }}>{area.title}（共{area.questions.length}小题;满分{question.score * area.questions.length}分）</Text>
                        <Text style={{ fontSize: 10 * SCALE2, }}>{area.prompt}</Text>
                    </View>
                    <View style={{ flex: 1, borderRadius: 6 * SCALE1, borderColor: '#ddd', borderWidth: 1 * SCALE1, marginTop: 10 * SCALE1 }}>
                        <Text style={{
                            borderTopLeftRadius: 6 * SCALE1,
                            borderTopRightRadius: 6 * SCALE1,
                            fontSize: 16 * SCALE1, color: '#333',
                            backgroundColor: '#ededed',
                            paddingVertical: 8 * SCALE1,
                            paddingHorizontal: 13 * SCALE1
                        }}>答案解析</Text>
                        <View style={{ flex: 1, backgroundColor: 'white', padding: 24 * SCALE1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 15 * SCALE1 }}>[参考音频]}</Text>
                                <TouchableOpacity
                                    onPress={() => { this.playAudio(answerPath) }}
                                    activeOpacity={0.5}>
                                    <Image style={{ width: 16 * SCALE1, height: 13 * SCALE1, marginLeft: 5 * SCALE1 }}
                                        source={this.props.soundSrc == answerPath ? require('../../../resource/img/labag.gif') : require('../../../resource/img/laba.png')}
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 * SCALE1 }}>
                                <View style={{ flexDirection: 'row', marginRight: 3 * SCALE1 }}>
                                    <Text style={{ fontSize: 16 * SCALE1 }}>{questionIndex + 1}.</Text>
                                    <Text style={{ fontSize: 16 * SCALE1, color: getAnswerColor100(percent) }}> {question.contents[0].text}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={[styles.status, { backgroundColor: '#1cb870' }]}></View>
                                    <Text style={{ fontSize: 12 * SCALE1, marginLeft: 4 * SCALE1 }}>优</Text>
                                    <View style={[styles.status, { backgroundColor: '#fd8d06' }]}></View>
                                    <Text style={{ fontSize: 12 * SCALE1, marginLeft: 4 * SCALE1 }}>良</Text>
                                    <View style={[styles.status, { backgroundColor: '#457daf' }]}></View>
                                    <Text style={{ fontSize: 12 * SCALE1, marginLeft: 4 * SCALE1 }}>中</Text>
                                    <View style={[styles.status, { backgroundColor: '#fb2401' }]}></View>
                                    <Text style={{ fontSize: 12 * SCALE1, marginLeft: 4 * SCALE1 }}>差</Text>
                                </View>
                            </View>
                            <View style={{ borderWidth: 1 * SCALE1, borderRadius: 3 * SCALE1, borderColor: '#e9e9e9', padding: 20 * SCALE1, marginTop: 20 * SCALE1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        style={styles.imgItem}
                                        source={require('../../../resource/img/ck.png')}
                                    ></Image>
                                    <Text style={styles.nFont}>参考答案：</Text>
                                    <Text style={{ color: '#555', fontSize: 16 * SCALE1 }}>{question.contents[0].audiotext}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 * SCALE1 }}>
                                    <Image style={styles.imgItem}
                                        source={require('../../../resource/img/people.png')}
                                    ></Image>
                                    <Text style={styles.nFont}>我的答案：</Text>
                                    <TouchableOpacity
                                        onPress={() => { this.playAudio(myPath) }}
                                        activeOpacity={0.5}>
                                        <Image style={{ width: 16 * SCALE1, height: 13 * SCALE1, marginLeft: 5 * SCALE1 }}
                                            source={this.props.soundSrc == myPath ? require('../../../resource/img/labag.gif') : require('../../../resource/img/laba.png')}
                                        ></Image>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 * SCALE1 }}>
                                    <Image style={styles.imgItem}
                                        source={require('../../../resource/img/score.png')}
                                    ></Image>
                                    <Text style={styles.nFont}>得分：</Text>
                                    <View style={{ flexDirection: 'row', height: 33 * SCALE1 }}>
                                        <Text style={{ fontSize: 26 * SCALE1, color: '#fd3736', textAlignVertical: 'bottom' }}>{Number(percent * question.score).toFixed(1)}</Text>
                                        <Text style={{ fontSize: 12 * SCALE1, color: '#999', textAlignVertical: 'bottom', marginBottom: 5 * SCALE1 }}>/总分：{question.score}</Text>
                                    </View>
                                </View>
                                <View style={{
                                    marginLeft: 24 * SCALE1, borderColor: '#ededed', borderRadius: 3 * SCALE1, borderWidth: 1 * SCALE1, width: 374 * SCALE1,
                                    paddingHorizontal: 24 * SCALE1, paddingVertical: 12 * SCALE1
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: '#333', fontSize: 14 * SCALE1 }}>准确度</Text>
                                        <Text style={{ color: '#999', fontSize: 12 * SCALE1 }}>(单词发音的准确程度)</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <View style={{
                                            height: 4 * SCALE1,
                                            width: 290 * SCALE1, backgroundColor: '#cacaca'
                                        }}>
                                            <View style={{ flex: 1, backgroundColor: '#fd8d06', width: 290 * pronPercent * SCALE1 }}>

                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 14 * SCALE1, color: '#333', marginLeft: 6 * SCALE1 }}>{result.pron}分</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={backEvent}
                                style={{ position: 'absolute', right: 24 * SCALE1, bottom: 24 * SCALE1 }}
                                activeOpacity={0.5}>
                                <Image resizeMode='stretch' style={{ width: 94 * SCALE1, height: 28 * SCALE1 }}
                                    source={require('../../../resource/img/back1.png')}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        width: 14 * SCALE1,
        height: 14 * SCALE1,
        marginRight: 7 * SCALE1,
    },
    nFont: {
        fontSize: 15 * SCALE1,
        color: 'black'
    }
})

function mapStateToProps(state) {
    const { audioPath, paperData, questionIndex, areaIndex } = state.paper;
    const { soundSrc } = state.global;
    return {
        audioPath,
        paperData,
        questionIndex,
        areaIndex,
        soundSrc
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Area);
