import React from 'react'
import { StyleSheet, Text, ActivityIndicator, View, Image } from 'react-native'
import * as components from '../ui';
import { COLOR, SCALE, SCALE2, SCALE1 } from '../utils'
const borderWidth = 320 * SCALE2;
const borderHeight = 40 * SCALE2;
export default ({ isTrain, buttonEvent }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    style={{ height: 60 * SCALE2, resizeMode: Image.resizeMode.contain }}
                    source={require('../../../resource/img/cry.png')}
                >
                </Image>
            </View>
            <View style={styles.title}>
                <Text style={{ fontSize: 24 * SCALE, fontWeight: 'bold', color: '#666', marginTop: 10 * SCALE }}>试卷下载失败</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 * SCALE }}>
                <components.Button
                    text="重新下载"
                    onPress={() => {
                        buttonEvent();
                    }}
                    containerStyle={{ borderColor: '#ff7831', backgroundColor: '#ff7831', width: 130 * SCALE, height: 44 * SCALE, borderRadius: 3 * SCALE }}
                    textStyle={{ color: "white", fontSize: 20 * SCALE }}
                />
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
