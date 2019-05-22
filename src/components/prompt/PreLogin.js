import React from 'react'
import { StyleSheet, Text, ActivityIndicator, View, Image } from 'react-native'
import { COLOR, SCALE, SCALE2 } from '../utils'
export default () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', marginBottom: 10 * SCALE2,  marginTop: 76 * SCALE }}>
                <Image
                    style={{ height: 138 * SCALE, resizeMode: Image.resizeMode.contain }}
                    source={require('../../../resource/img/wait1.png')}
                >
                </Image>
            </View>
            <View style={styles.title}>
                <Text style={{ fontSize: 40 * SCALE, fontWeight: 'bold', color: '#1db970' }}>考试训练即将开始</Text>
            </View>
            <View style={styles.text}>
                <Text style={{ fontSize: 20 * SCALE }}>请保持安静，等待考试指令</Text>
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
