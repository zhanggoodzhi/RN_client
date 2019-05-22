import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE2, SCALE1 } from '../utils'
// 情景问答
class Area extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    changeContentSelected = (i, si) => {
        const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
        const newPaperData = { ...paperData };
        newPaperData.areas[areaIndex].questions[questionIndex].contents[i].selected = si;
        this.props.changePaperData(newPaperData);
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
            let source;
            if (this.props.listenQustion && i === contentIndex) {
                source = require('../../../resource/img/yinping.gif');
            } else if (!this.props.listenQustion && i === contentIndex) {
                console.log('进入当前题目，不在听题,听指导？', this.props.listenGuide);
                if (this.props.listenGuide) {
                    source = require('../../../resource/img/yinpin1.png');
                } else {
                    source = require('../../../resource/img/yinpin.png');
                }
            } else {
                source = require('../../../resource/img/yinpin1.png');
            }
            return (
                <View key={i} style={{
                    flexDirection: 'row', padding: 10 * SCALE2, borderWidth: 1,
                    borderColor: !this.props.listenGuide && i === contentIndex ? COLOR.theme : 'white', borderRadius: 6 * SCALE1,
                    marginVertical: 5 * SCALE1
                }}>
                    <Text style={{ fontSize: 10 * SCALE2, marginRight: 5 * SCALE2, color: '#333' }}>{v.index}.</Text>
                    <Image style={{ width: 20 * SCALE1, height: 25 * SCALE1, marginLeft: 5 * SCALE1 }}
                        source={source}
                    ></Image>
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
                        paddingVertical: 20 * SCALE1,
                        paddingHorizontal: 20 * SCALE1
                    }}>
                        <Text style={{ fontSize: 15 * SCALE1, color: '#333' }}>{question.text}</Text>
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
    const { audioPath, paperData, questionIndex, areaIndex, contentIndex, listenGuide, listenQustion } = state.paper;
    const { soundSrc } = state.global;
    return {
        audioPath,
        paperData,
        questionIndex,
        contentIndex,
        areaIndex,
        soundSrc,
        listenGuide,
        listenQustion
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Area);

