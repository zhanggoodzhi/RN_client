import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import { COLOR, SCALE2, SCALE1 } from '../utils'
import Video from 'react-native-video'
// 快速应答
class Area extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifPause: true
        };
        this.player = null;
    }
    startVideo() {
        console.log('触发state');
        this.player.seek(0);
        this.setState({
            ifPause: false
        });
    }
    endVideo() {
        this.player.seek(0);
        this.setState({
            ifPause: true
        });
    }
    render() {
        const { paperData, questionIndex, areaIndex, contentIndex } = this.props;
        const area = paperData.areas[areaIndex];
        const question = area.questions[questionIndex];
        const content = question.contents[0];
        return (
            <View style={{ flex: 1 }}>
                <View style={{ padding: 15 * SCALE2, flex: 1 }}>
                    <View>
                        <Text style={{ fontSize: 12 * SCALE2, fontWeight: 'bold' }}>{area.title}（共{area.questions.length}小题;满分{question.score * area.questions.length}分）</Text>
                        <Text style={{ fontSize: 10 * SCALE2, }}>{area.prompt}</Text>
                    </View>
                    <View style={{ paddingVertical: 15 * SCALE1, flex: 1 }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row', padding: 15 * SCALE2, borderWidth: 1 * SCALE2, borderColor: !this.props.listenGuide ? COLOR.theme : 'white', borderRadius: 3 * SCALE2, backgroundColor: 'white',
                        }}>
                            <Video source={{ uri: this.props.audioPath + content.video }}   // Can be a URL or a local file.
                                // poster="https://baconmockup.com/300/200/" // uri to an image to display until the video plays
                                ref={(ref) => {
                                    this.player = ref
                                }}                                      // Store reference
                                rate={1.0}                              // 0 is paused, 1 is normal.
                                volume={1.0}                            // 0 is muted, 1 is normal.
                                muted={false}                           // Mutes the audio entirely.
                                paused={this.state.ifPause}                          // Pauses playback entirely.
                                resizeMode="contain"                      // Fill the whole screen at aspect ratio.*
                                repeat={false}                           // Repeat forever.
                                playInBackground={true}                // Audio continues to play when app entering background.
                                // onLoadStart={this.loadStart}            // Callback when video starts to load
                                // onLoad={this.setDuration}               // Callback when video loads
                                // onProgress={this.setTime}               // Callback every ~250ms with currentTime
                                // onEnd={this.onEnd}                      // Callback when playback finishes
                                // onError={this.videoError}               // Callback when video cannot be loaded
                                // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                // onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
                                style={{ flex: 1 }} />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

})

function mapStateToProps(state) {
    const { audioPath, paperData, questionIndex, areaIndex, contentIndex, listenGuide, paperAnswer } = state.paper;
    const { soundSrc } = state.global;
    return {
        audioPath,
        paperAnswer,
        paperData,
        questionIndex,
        contentIndex,
        areaIndex,
        soundSrc,
        listenGuide
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Area);


