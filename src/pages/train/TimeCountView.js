import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { COLOR, SCALE } from '../../components/utils'
import myTimer from '../../components/utils/timerutil';


class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hour: '',
            minute: '',
            second: '',
        };
        this.saveSystemTime = 0;
        this.trainTimer = null;

    }
    getTime(){
        return this.state.hour + ':' + this.state.minute + ':' + this.state.second
    }
    componentDidMount() {
        this.startTiming();
    }
    startTiming() {
        this.saveSystemTime = new Date().getTime();
        this.trainTimer && myTimer.clearInterval(this.trainTimer);
        this.trainTimer = myTimer.setInterval(() => {
            const currentTime = new Date().getTime();
            const trainTime = currentTime - this.saveSystemTime;
            const timeObj = this.formatDuring(trainTime);
            if (timeObj.hours === this.state.hour && timeObj.minutes === this.state.minute && timeObj.seconds === this.state.second) {
                return;
            }
            this.setState((state) => {
                const newTimeObj = {};
                if (timeObj.hours !== state.hour) {
                    newTimeObj.hour = timeObj.hours;
                }
                if (timeObj.minutes !== state.minute) {
                    newTimeObj.minute = timeObj.minutes;
                }
                if (timeObj.seconds !== state.second) {
                    newTimeObj.second = timeObj.seconds;
                }
                return newTimeObj;
            });
        }, 300);
    }
    formatDuring(mss) {
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((mss % (1000 * 60)) / 1000);
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return {
            hours,
            minutes,
            seconds
        }
    }
    render() {
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                position: 'absolute',
                left: 0,
                top: 25 * SCALE,
                alignItems: 'center',
                bottom: 0,
                right: 0,
                backgroundColor: 'transparent',
                zIndex: 9
            }}>
                <Text style={styles.timeItem}>{this.state.hour}</Text>
                <Text style={{ fontSize: 28 * SCALE, color: '#1ea366', marginHorizontal: 3 * SCALE }}>:</Text>
                <Text style={styles.timeItem}>{this.state.minute}</Text>
                <Text style={{ fontSize: 28 * SCALE, color: '#1ea366', marginHorizontal: 3 * SCALE }}>:</Text>
                <Text style={styles.timeItem}>{this.state.second}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    timeItem: {
        color: 'white',
        width: 43 * SCALE,
        height: 39 * SCALE,
        fontSize: 28 * SCALE,
        borderRadius: 2 * SCALE,
        backgroundColor: '#1ea366',
        textAlign: 'center',
    },
})


export default Component;

