import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { COLOR, SCALE2, SCALE1, SCALE } from '../utils'
import LinearGradient from 'react-native-linear-gradient'
export default ({ disabled, text, onPress, containerStyle, textStyle, type, gradient }) => {
    let { fontSize } = StyleSheet.flatten(textStyle || styles.text)

    return gradient ? (
        <TouchableOpacity
            activeOpacity={0.6}
            onPress={onPress}
            disabled={disabled}
        >
            <LinearGradient
                colors={gradient || ['#4c669f', '#3b5998', '#192f6a']}
                style={[styles.container, { padding: Math.round(fontSize / 2) },
                { backgroundColor: type === 'flat' ? 'transparent' : COLOR.theme }, containerStyle]}>
                <Text style={[styles.text, { color: type === 'flat' ? COLOR.theme : 'white' }, textStyle]}>{text}</Text>
            </LinearGradient>
        </TouchableOpacity >
    ) : (
            (
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={onPress}
                    disabled={disabled}
                    style={[styles.container, { padding: Math.round(fontSize / 2) },
                    { backgroundColor: type === 'flat' ? 'transparent' : COLOR.theme }, containerStyle]}
                >
                    <Text style={[styles.text, { color: type === 'flat' ? COLOR.theme : 'white' }, textStyle]}>{text}</Text>
                </TouchableOpacity>
            )
        )
}

const styles = StyleSheet.create({
    container: {
        padding: 20 * SCALE,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1 * SCALE,
        borderColor: COLOR.theme,
        // borderRadius: 3 * SCALE
    },
    text: {
        color: COLOR.theme,
        fontSize: 20 * SCALE
    }
})
