import React from 'react'
import { StyleSheet, Text, ActivityIndicator, View, Image } from 'react-native'
import { COLOR, SCALE2 } from '../utils'
export default () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }}>
            <View style={{ alignItems: 'center', marginBottom: 10 * SCALE2 }}>
                <Image
                    style={{ height: 60 * SCALE2, resizeMode: Image.resizeMode.contain }}
                    source={require('../../../resource/img/ready.png')}
                >
                </Image>
            </View>
            <View style={styles.title}>
                <Text style={{ fontSize: 14 * SCALE2, fontWeight: 'bold', color: '#1db970' }}>考试准备就绪</Text>
            </View>
            <View style={styles.text}>
                <Text style={{ fontSize: 10 * SCALE2 }}>请不要再动麦克风和耳机，安静等待开始考试指令！</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        alignItems: 'center'
    },
    text: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
