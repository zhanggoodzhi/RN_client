import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE2, SCALE1 } from '../utils'
// 听后记录并转述信息
class Area extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    updatePaperAnswer() {
        const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
        const contents = paperData.areas[areaIndex].questions[questionIndex].contents;
        const newAnswer = { ...this.props.paperAnswer };
        contents.forEach((v, i) => {
            if (i !== contents.length - 1) {
                newAnswer.recordguid.push({
                    guid: contents[i].guid,
                    answer: this.state['text' + i] || '',
                    score: '0'
                });
            }
        });
        this.props.changePaperAnswer(newAnswer);
        contents.forEach((v, i) => {
            let obj = {};
            if (i !== contents.length - 1) {
                obj['text' + i] = '';
                this.setState({
                    obj
                });
            }
        });
    }
    render() {
        const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
        const area = paperData.areas[areaIndex];
        const question = area.questions[questionIndex];
        const items = question.contents.map((v, i) => {
            if (i !== question.contents.length - 1) {
                if (this.props.listenGuide) {
                    return (
                        <View key={i} style={{ flexDirection: 'row', marginLeft: 8 * SCALE1 }}>
                            <Text style={{ width: 22 * SCALE1, height: 28 * SCALE1, fontSize: 16 * SCALE1, textAlign: 'center', lineHeight: 28 * SCALE1, color: '#333', borderWidth: 1 * SCALE1, borderColor: '#d0d0d0' }}>{i + 1}</Text>
                            <View style={{ width: 107 * SCALE1, height: 28 * SCALE1, borderWidth: 1 * SCALE1, borderLeftWidth: 0, borderColor: '#d0d0d0' }}></View>
                        </View>
                    );
                } else {
                    const obj = {};
                    return (
                        <View key={i} style={{ flexDirection: 'row', marginLeft: 8 * SCALE1 }}>
                            <Text style={{ width: 22 * SCALE1, height: 28 * SCALE1, fontSize: 16 * SCALE1, textAlign: 'center', lineHeight: 28 * SCALE1, color: 'white', backgroundColor: '#1cb870' }}>{i + 1}</Text>
                            <TextInput
                                keyboardType="email-address"
                                underlineColorAndroid="transparent"
                                maxLength={30}
                                style={{ width: 107 * SCALE1, height: 28 * SCALE1, borderWidth: 1 * SCALE1, borderColor: '#1cb870', padding: 5 * SCALE1, fontSize: 12 * SCALE1 }}
                                onChangeText={(text) => {
                                    const str = 'text' + i;
                                    obj[str] = text.replace(/[\W|\_]/g, '');
                                    this.setState(obj)
                                }}
                                value={this.state['text' + i] || ''}
                            />
                        </View>
                    );
                }
            }
        });
        return (
            <View style={{ flex: 1 }}>
                <View style={{ padding: 10 * SCALE2, flex: 1 }}>
                    <View style={{ marginBottom: 15 * SCALE1 }}>
                        <Text style={{ fontSize: 12 * SCALE2, fontWeight: 'bold' }}>{area.title}</Text>
                        <Text style={{ fontSize: 10 * SCALE2, }}>{area.prompt}</Text>
                    </View>
                    <View style={{
                        paddingVertical: 10 * SCALE1,
                        paddingHorizontal: 10 * SCALE1,
                        flex: 1
                    }}>
                        <View style={{
                            borderColor: !this.props.listenGuide ? COLOR.theme : 'white',
                            borderRadius: 6 * SCALE1, borderWidth: 1 * SCALE1,
                            padding: 10 * SCALE1,
                            backgroundColor: 'white',
                            flex: 1,
                        }}>
                            <Text style={{ fontSize: 15 * SCALE1, color: '#333' }}>{this.props.ifSection2 ? question.tips : question.prompt}</Text>
                            <View style={{ alignItems: 'center', marginTop: 10 * SCALE1 }}>
                                <Image style={{ width: 518 * SCALE1, height: 170 * SCALE1, resizeMode: 'contain' }}
                                    // source={{ uri: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=532985540,133652669&fm=173&app=25&f=JPEG?w=218&h=146&s=E1B48F70D89C6CDCC50DB9070100A0C0' }}>
                                    source={{ uri: "file://" + this.props.audioPath + question.image }}>
                                </Image>
                            </View>
                            {this.props.ifSection2 ?
                                (
                                    <View style={{ marginTop: 5 * SCALE1, flex: 1 }}>
                                        <ScrollView>
                                            <Text style={{ fontSize: 16 * SCALE1 }}>{question.contents[question.contents.length - 1].tips}</Text>
                                        </ScrollView>
                                    </View>
                                ) :
                                (
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 * SCALE1 }}>
                                        {items}
                                    </View>
                                )
                            }

                        </View>
                    </View>
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({

})

function mapStateToProps(state) {
    const { audioPath, paperData, questionIndex, areaIndex, contentIndex, listenGuide, listenQustion, ifSection2, paperAnswer } = state.paper;
    const { soundSrc } = state.global;
    return {
        audioPath,
        paperData,
        paperAnswer,
        questionIndex,
        contentIndex,
        areaIndex,
        soundSrc,
        listenGuide,
        listenQustion,
        ifSection2
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Area);

