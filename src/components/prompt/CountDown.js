import React from 'react'
import { StyleSheet, Text, ActivityIndicator, View, Image } from 'react-native'
import { COLOR, SCALE2 } from '../utils'
export default ({ title, number }) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{
                    width: 100 * SCALE2, height: 100 * SCALE2, borderColor: '#f3b7b6', borderRadius: 100 * SCALE2, borderWidth: 5 * SCALE2, alignItems: 'center', justifyContent: 'center',
                }}>
                    <Text style={styles.text}>{number}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        alignItems: 'center',
        height: 50 * SCALE2,
        marginTop: 30 * SCALE2,
    },
    text: {
        flexDirection: 'row',
        fontSize: 50 * SCALE2,
        color: '#f34747'
    }
})
