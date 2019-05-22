import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE2, SCALE1 } from '../utils'
// 朗读短文
class Area extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
        const area = paperData.areas[areaIndex];
        const question = area.questions[questionIndex];
        return (
            <View style={{ flex: 1 }}>
                <View style={{ padding: 15 * SCALE2 }}>
                    <View>
                        <Text style={{ fontSize: 12 * SCALE2, fontWeight: 'bold' }}>{area.title}（共{area.questions.length}小题;满分{question.score * area.questions.length}分）</Text>
                        <Text style={{ fontSize: 10 * SCALE2, }}>{area.prompt}</Text>
                    </View>
                    <View style={{ paddingVertical: 15 * SCALE1 }}>
                        <View style={{
                            flexDirection: 'row', padding: 15 * SCALE2, borderWidth: 1 * SCALE2, borderColor: COLOR.theme, borderRadius: 3 * SCALE2, backgroundColor: 'white',
                        }}>
                            <Text style={{ fontSize: 10 * SCALE2 }}>{questionIndex + 1}. {question.contents[0].text}</Text>
                        </View>
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

