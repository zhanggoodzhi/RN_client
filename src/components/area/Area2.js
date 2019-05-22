import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE2, SCALE1 } from '../utils'
// 听短文答题
class Area extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    changeContentSelected = (i, si) => {
        const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
        const contents = paperData.areas[areaIndex].questions[questionIndex].contents;
        const newPaperData = { ...paperData };
        newPaperData.areas[areaIndex].questions[questionIndex].contents[i].selected = si;
        this.props.changePaperData(newPaperData);
        const newAnswer = { ...this.props.paperAnswer };
        // 是否已经选过
        let ifSame = false;
        for (let v of newAnswer.recordguid) {
            if (v.guid === contents[i].guid) {
                v.answer = contents[i].options.option[si].guid;
                ifSame = true;
                break;
            }
        }
        if (!ifSame) {
            newAnswer.recordguid.push({
                guid: contents[i].guid,
                answer: contents[i].options.option[si].guid || '',
                score: '0'
            });
        }
        this.props.changePaperAnswer(newAnswer);
    }
    render() {
        const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
        const area = paperData.areas[areaIndex];
        const question = area.questions[questionIndex];
        let contentsLength = 0;
        area.questions.forEach(v => {
            contentsLength += v.contents.length;
        });
        const contents = question.contents.map((v, i) => {
            return (
                <View key={i}>
                    <View style={{
                        flexDirection: 'row', padding: 10 * SCALE2
                    }}>
                        <Text style={{ fontSize: 10 * SCALE2, marginRight: 5 * SCALE2, color: '#333' }}>{v.index}.</Text>
                        <Text style={{ fontSize: 10 * SCALE2, color: '#333' }}>{v.text}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 9 * SCALE1 }}>
                        {
                            v.options.option.map((sv, si) => {
                                return (
                                    <TouchableOpacity
                                        key={si}
                                        onPress={() => {
                                            if (this.props.listenGuide) {
                                                return;
                                            }
                                            this.changeContentSelected(i, si);
                                        }}
                                        activeOpacity={this.props.listenGuide ? 1 : 0.5}>
                                        <View style={{ marginLeft: 30 * SCALE1, flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={{
                                                    width: 14 * SCALE1, height: 13 * SCALE1, borderRadius: 13 * SCALE1, borderWidth: 1,
                                                    borderColor: '#b9b9b9', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {v.selected == si ?
                                                        <View style={{ width: 8 * SCALE1, height: 8 * SCALE1, borderRadius: 8 * SCALE1, backgroundColor: '#26a556' }}>
                                                        </View> : null
                                                    }
                                                </View>
                                                <Text style={{ fontSize: 16 * SCALE1, marginLeft: 12 * SCALE1, color: v.selected == si ? '#26a556' : '#333' }}>{sv.content}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
            )
        });
        return (
            <View style={{ flex: 1 }}>
                <View style={{ padding: 10 * SCALE2 }}>
                    <View style={{ marginBottom: 15 * SCALE1 }}>
                        <Text style={{ fontSize: 12 * SCALE2, fontWeight: 'bold' }}>{area.title}（共{contentsLength}小题;满分{question.score * area.questions.length}分）</Text>
                        <Text style={{ fontSize: 10 * SCALE2, }}>{area.prompt}</Text>
                    </View>
                    <View style={{
                        backgroundColor: 'white',
                        paddingVertical: 10 * SCALE1,
                        borderWidth: 1, borderColor: this.props.listenGuide ? 'white' : COLOR.theme, borderRadius: 3 * SCALE2,
                    }}>
                        {contents}
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

})

function mapStateToProps(state) {
    const { audioPath, paperData, questionIndex, areaIndex, contentIndex, listenGuide, paperAnswer } = state.paper;
    const { soundSrc } = state.global;
    return {
        audioPath,
        paperAnswer,
        paperData,
        questionIndex,
        contentIndex,
        areaIndex,
        soundSrc,
        listenGuide
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Area);

