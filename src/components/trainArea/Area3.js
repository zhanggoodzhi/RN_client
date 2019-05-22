import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
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
    render() {
        const area = this.props.paperData.areas[this.props.renderAreaIndex];
        const question = area.questions[this.props.renderQuestionIndex];
        const result = question.contents[this.props.renderContentIndex].recordResult;
        const percent = result && (result.overall / result.rank);
        let colorText = null;
        let contentsCount = 0;
        let scoreCount = 0;
        area.questions.forEach(v => {
            scoreCount += Number(v.score);
            v.contents.forEach(sv => {
                contentsCount++;
            })
        });
        const scoreText = area.questions.length === 1 ? '计' + question.score + '分' : `共${contentsCount}小题;满分${scoreCount}分`;
        if (result) {
            let arrs = [];
            let preLastWord = '';
            console.log('测试',result);
            result.details.forEach((v, i) => {
                const mark = v.text[v.text.length - 1];
                v.words.forEach((sv, si) => {
                    let text = sv.text;
                    if (i === 0 && si === 0) {
                        text = text[0].toUpperCase() + text.slice(1);
                    } else if ((preLastWord === '?' || preLastWord === '.') && si === 0) {
                        text = text[0].toUpperCase() + text.slice(1);
                    }
                    arrs.push(<Text key={i.toString() + si.toString()} style={{ fontSize: 10 * SCALE2, color: getAnswerColor4(sv.score), lineHeight: 33 * SCALE }}>{si === 0 ? ' ' : ''}{text}{si === v.words.length - 1 ? '' : ' '}</Text>);
                });
                arrs.push(<Text key={i + '-'} style={{ fontSize: 10 * SCALE2, lineHeight: 33 * SCALE }}>{mark}</Text>);
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
            )
        } else {
            colorText = <Text style={{ fontSize: 10 * SCALE2, lineHeight: 33 * SCALE }}>{question.contents[0].text}</Text>
        }
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 60 * SCALE, alignItems: 'center', borderBottomColor: '#e8e8e8', borderBottomWidth: 1 * SCALE, paddingHorizontal: 27 * SCALE, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 20 * SCALE }}>{area.title}（{scoreText}）</Text>
                    {this.props.areaCount}
                </View>
                <View style={{ paddingHorizontal: 27 * SCALE, paddingVertical: 15 * SCALE, flex: 1 }}>
                    <Text style={{ fontSize: 15 * SCALE, }}>{area.prompt}</Text>
                    <View style={{
                        marginVertical: 15 * SCALE1,
                        borderRadius: 3 * SCALE2, backgroundColor: 'white', flex: 1
                    }}>
                        <ScrollView showsVerticalScrollIndicator={true}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ width: 40 * SCALE }}>
                                    <Text style={{ fontSize: 20 * SCALE , lineHeight: 33 * SCALE }}>Q{question.index}.</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    {colorText}
                                    {
                                        result ?
                                            (
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 10 * SCALE1 }}>
                                                    <View>
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
                                                        <View style={{ flexDirection: 'row', height: 30 * SCALE1, marginTop: 20 * SCALE }}>
                                                            <Text style={{ fontSize: 26 * SCALE1, color: '#fd3736', textAlignVertical: 'bottom' }}>{Number(percent * question.score).toFixed(1)}</Text>
                                                            <Text style={{ fontSize: 12 * SCALE1, color: '#999', textAlignVertical: 'bottom', marginBottom: 5 * SCALE1 }}>/总分：{question.score}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            ) : null
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    </View>
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
    const { audioPath, paperData } = state.paper;
    const { soundSrc } = state.global;
    return {
        audioPath,
        paperData,
        soundSrc
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Area);
