import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { COLOR, SCALE2, SCALE1, getAnswerColor100 } from '../utils'
// 单词音标认读
export default (area) => {
    let allScore = 0;
    area.questions.forEach((v) => {
        allScore += Number(v.score);
    });
    const question = area.questions[area.questionIndex];
    const result = question.contents[area.contentIndex].recordResult;
    const percent = result && (result.overall / result.rank);
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 10 * SCALE2, flex: 1 }}>
                <View>
                    <Text style={{ fontSize: 12 * SCALE2, fontWeight: 'bold' }}>{area.title}(共{area.questions.length}小题;满分{allScore}分)</Text>
                    <Text style={{ fontSize: 10 * SCALE2, }}>{area.prompt}</Text>
                </View>
                <View style={{ paddingVertical: 10 * SCALE2, backgroundColor: 'white', marginTop: 15 * SCALE1, flex: 1, borderRadius: 6 * SCALE1 }}>
                    <Text style={{ position: 'absolute', top: 12 * SCALE1, fontSize: 18 * SCALE1, paddingLeft: 10 * SCALE1 }}>{area.questionIndex + 1}.</Text>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 150 * SCALE1 }}>
                        <Text style={{ fontSize: 20 * SCALE1, color: getAnswerColor100(percent) }}>{question.contents[0].text}</Text>
                    </View>
                    {
                        result ?
                            <View style={{ position: 'absolute', top: 160 * SCALE1, right: 50 * SCALE1 }}>
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
                                <View style={{ flexDirection: 'row', height: 30 * SCALE1 }}>
                                    <Text style={{ fontSize: 26 * SCALE1, color: '#fd3736', textAlignVertical: 'bottom' }}>{Number(percent * question.score).toFixed(1)}</Text>
                                    <Text style={{ fontSize: 12 * SCALE1, color: '#999', textAlignVertical: 'bottom', marginBottom: 5 * SCALE1 }}>/总分：{question.score}</Text>
                                </View>
                            </View>
                            : null
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    status: {
        width: 6 * SCALE1,
        height: 6 * SCALE1,
        marginLeft: 4 * SCALE1
    }
})
