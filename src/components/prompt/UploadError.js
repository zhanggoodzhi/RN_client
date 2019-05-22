import React from 'react'
import { StyleSheet, Text, ActivityIndicator, View, Image } from 'react-native'
import * as components from '../ui';
import { COLOR, SCALE2, SCALE1 } from '../utils'
const borderWidth = 320 * SCALE2;
const borderHeight = 40 * SCALE2;
export default ({ isTrain, buttonEvent }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    style={{ height: 60 * SCALE2, resizeMode: Image.resizeMode.contain }}
                    source={require('../../../resource/img/cry.png')}
                >
                </Image>
            </View>
            <View style={styles.title}>
                <Text style={{ fontSize: 15 * SCALE2, fontWeight: 'bold', color: '#656565' }}>{isTrain ? '练习结果' : '答案'}上传失败</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <components.Button
                    text="重新上传"
                    onPress={() => {
                        buttonEvent();
                    }}
                    containerStyle={{ borderColor: '#ff7831', backgroundColor: '#ff7831', width: 120 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                    textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        marginTop:5 * SCALE2,
        marginBottom: 8 * SCALE2
    },
    border: {
        height: borderHeight,
        width: borderWidth,
        resizeMode: Image.resizeMode.stretch,
        paddingVertical: 5 * SCALE2,
    }
})
