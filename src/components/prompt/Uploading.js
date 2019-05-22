import React from 'react'
import { StyleSheet, Text, ActivityIndicator, View, Image } from 'react-native'
import { COLOR, SCALE2 } from '../utils'
const borderWidth = 320 * SCALE2;
const borderHeight = 40 * SCALE2;
export default ({ isTrain }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "white" }}>
            <View style={{ alignItems: 'center', marginBottom: 10 * SCALE2 }}>
                <Image
                    style={{ height: 60 * SCALE2, resizeMode: Image.resizeMode.contain }}
                    source={require('../../../resource/img/dtwc.png')}
                >
                </Image>
            </View>
            <View style={styles.title}>
                <Text style={{ fontSize: 15 * SCALE2, fontWeight: 'bold', color: '#1db970' }}>{isTrain ? '练习结束' : '答题完成'}</Text>
            </View>
            <View style={{ width: borderWidth }}>
                <Image
                    source={require('../../../resource/img/dot-border.png')}
                    style={styles.border}>
                </Image>
                <View style={{ position: 'absolute', height: borderHeight, paddingVertical: 5 * SCALE2, width: borderWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        style={{ width: 30 * SCALE2, height: 30 * SCALE2, marginRight: 5 * SCALE2 }}
                        source={require('../../../resource/img/loading.gif')}
                    >
                    </Image>
                    <Text style={{ fontSize: 10 * SCALE2 }}>正在上传本次{isTrain ? '练习结果' : '考试答案'}，请耐心等待...</Text>
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
