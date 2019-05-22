import React from 'react'
import { StyleSheet, Text, ActivityIndicator, View, Image } from 'react-native'
import { COLOR, SCALE2, SCALE1, SCALE } from '../utils'
import * as components from '../ui';
const borderWidth = 320 * SCALE2;
const borderHeight = 40 * SCALE2;
export default ({ isTrain, buttonEvent }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    style={{ height: 60 * SCALE2, resizeMode: Image.resizeMode.contain }}
                    source={require('../../../resource/img/smile.png')}
                >
                </Image>
            </View>
            <View style={styles.title}>
                <Text style={{ fontSize: 15 * SCALE2, fontWeight: 'bold', color: '#1db970' }}>{isTrain ? '练习结果' : '答案'}上传成功</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                <components.Button
                    text="查看练习结果"
                    onPress={() => {
                        buttonEvent();
                    }}
                    containerStyle={{ borderColor: '#ff7831', backgroundColor: '#ff7831', width: 120 * SCALE1, height: 40 * SCALE1,marginBottom: 20 * SCALE1, borderRadius: 3 * SCALE1 }}
                    textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                />
            </View>
            <View style={{ width: borderWidth, backgroundColor: 'white', }}>
                <Image
                    source={require('../../../resource/img/dot-border.png')}
                    style={styles.border}>
                </Image>
                <View style={{ position: 'absolute', height: borderHeight, paddingVertical: 5 * SCALE2, width: borderWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 10 * SCALE2 }}>{isTrain ? '练习结束' : '考试完成'}，请保持安静，等待离开指令！</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        marginBottom: 10 * SCALE2
    },
    border: {
        height: borderHeight,
        width: borderWidth,
        resizeMode: Image.resizeMode.stretch,
        paddingVertical: 5 * SCALE2,
    }
})
