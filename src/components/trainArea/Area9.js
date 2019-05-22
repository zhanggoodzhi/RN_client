import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE, SCALE2, SCALE1, getAnswerColor4, getAnswerColorText4 } from '../utils'
import * as components from '../../components/ui';
import FixedWidthImage from '../trainArea/FixedWidthImage';
import * as soundComponent from '../../components/sound';
// 看图说话
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
        const imageUrl = "file://" + this.props.audioPath + question.contents[0].image;
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
        const picture = <FixedWidthImage width={752 * SCALE} imageUrl={imageUrl}>
        </FixedWidthImage>;
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
                            <Text style={{ fontSize: 15 * SCALE,lineHeight: 33 * SCALE }}>{question.contents[0].text}</Text>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ width: 40 * SCALE }}>
                                    <Text style={{ fontSize: 20 * SCALE, lineHeight: 33 * SCALE }}>Q{question.index}.</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    {picture}
                                    {
                                        result ?
                                            (
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 10 * SCALE1 }}>
                                                    <View>
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
