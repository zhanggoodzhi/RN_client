import React from 'react'
import { StyleSheet, Text, ActivityIndicator, View, Image, ImageBackground } from 'react-native'
import { COLOR, SCALE2 } from '../utils'
const borderWidth = 250 * SCALE2;
const borderHeight = 40 * SCALE2;
export default ({ isTrain }) => {
    console.log('尺寸', require('../../../resource/img/smile.png'));
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }}>
            <View style={{ alignItems: 'center', marginBottom: 10 * SCALE2 }}>
                <Image
                    style={{ height: 60 * SCALE2, resizeMode: Image.resizeMode.contain }}
                    source={require('../../../resource/img/download.png')}
                >
                </Image>
            </View>
            <View style={{ width: borderWidth, backgroundColor: 'white' }}>
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
                    <Text style={{ fontSize: 10 * SCALE2 }}>正在下载{isTrain ? '练习内容' : '试卷'}，请稍后……</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    border: {
        height: borderHeight,
        width: borderWidth,
        resizeMode: Image.resizeMode.stretch,
        paddingVertical: 5 * SCALE2,
    }
})
