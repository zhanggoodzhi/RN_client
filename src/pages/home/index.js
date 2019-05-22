import React, { Component } from 'react';
import { NativeModules, StyleSheet, View, Text, TextInput, Image, Button, Slider } from 'react-native';
import { COLOR, SCALE2, EventEmitter, SCALE1 } from '../../components/utils';
import { bindActionCreators } from 'redux'
import Modal from "react-native-modalbox";
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'
import orientation from '../../components/orientation';
import * as components from '../../components/ui';
import * as socket from '../../components/native/socket';
import Main from './Main';
import * as soundComponent from '../../components/sound';
// let audioPath =  '/storage/emulated/0/test111.aac';
const defaultSoundVolum = 1;
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ifRecordSlider0: false
    }
  }

  changeSoundSlider = (value) => {
    soundComponent.changeSoundValue(value);
  }
  changeRecordSlider = (value) => {
    if (value === 0) {
      this.setState({
        ifRecordSlider0: true
      });
    } else {
      this.setState({
        ifRecordSlider0: false
      });
    }
  }

  componentDidMount() {
    // soundComponent.changeSoundValue(defaultSoundVolum);
    console.log('home数据', this.props.userData);

    // 下载试卷
    // socket.connectPaperServer(this.props.ip);
    // EventEmitter.addListener('connectPaperServerSuccess', () => {
    //   socket.send(20, {
    //     Index: '0'
    //   });
    // });

    // BackgroundTimer.setTimeout(() => {
    //   this.props.changeRightSideType('ready');
    // }, 2000);

  }

  render() {
    let playButton = null;
    if (!this.props.userData) {
      return null
    }
    const { Name, No, SeatNo, headPic } = this.props.userData;
    if (this.props.ifPlaying) {
      playButton = <components.Button
        text="播放中"
        type=""
        containerStyle={{ borderColor: '#E6A23C', backgroundColor: '#E6A23C', height: 30 * SCALE2, width: 100 * SCALE2, marginLeft: 0, paddingHorizontal: 0 }}
        textStyle={{ color: "white" }}
      />;
    } else {
      playButton = <components.Button
        text="播放"
        type=""
        // onPress={() => { this.playAudio(); }}
        containerStyle={{ height: 30 * SCALE2, width: 100 * SCALE2, marginLeft: 0, paddingHorizontal: 0 }}
        textStyle={{ color: "white" }}
      />;
    }
    const { soundValue } = this.props;
    return (
      <View style={styles.page}>
        <Modal backdropPressToClose={false} animationDuration={0} style={{ alignItems: 'center', width: 250 * SCALE2, height: 120 * SCALE2, backgroundColor: 'white', borderRadius: 3 * SCALE2 }} ref="modal" swipeToClose={false}>
          <View style={{ width: 250 * SCALE2, borderBottomWidth: 1 * SCALE2, borderColor: '#e1e1e1', backgroundColor: '#f3f1f2', padding: 5 * SCALE2, borderTopLeftRadius: 3 * SCALE2, borderTopRightRadius: 3 * SCALE2 }}>
            <Text style={{ fontSize: 12 * SCALE2, fontWeight: 'bold' }}>提示</Text>
          </View>
          <View style={{ flexDirection: 'row', padding: 10 * SCALE2 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ width: 38 * SCALE1, height: 38 * SCALE1 }}
                  source={require('../../../resource/img/ts1.png')}
                >
                </Image>
                <Text style={{ fontSize: 15 * SCALE1, marginLeft: 15 * SCALE1 }}>您的录音音量过小，请重新录音！</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <components.Button
                  text="我知道了"
                  onPress={() => {
                    this.refs.modal.close();
                  }}
                  containerStyle={{ width: 170 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                  textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                />
              </View>
            </View>
          </View>
        </Modal>
        <Modal backdropPressToClose={false} animationDuration={0} style={{ alignItems: 'center', width: 250 * SCALE2, height: 120 * SCALE2, backgroundColor: 'white', borderRadius: 3 * SCALE2 }} ref="setVolumeModal" swipeToClose={false}>
          <View style={{ width: 250 * SCALE2, borderBottomWidth: 1 * SCALE2, borderColor: '#e1e1e1', backgroundColor: '#f3f1f2', padding: 5 * SCALE2, borderTopLeftRadius: 3 * SCALE2, borderTopRightRadius: 3 * SCALE2 }}>
            <Text style={{ fontSize: 12 * SCALE2, fontWeight: 'bold' }}>耳机音量调节</Text>
          </View>
          <View style={{ flexDirection: 'row', padding: 10 * SCALE2 }}>
            <View style={{ flex: 1 }}>
              <View style={{ paddingHorizontal: 25 * SCALE1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ width: 38 * SCALE1, height: 38 * SCALE1 }}
                  source={require('../../../resource/img/ts1.png')}
                >
                </Image>
                <Text style={{ fontSize: 15 * SCALE1, marginLeft: 15 * SCALE1 }}>系统检测到耳机音量过小，请确认是否已经调整到合适值！</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <components.Button
                  text="调整好了，继续"
                  onPress={() => {
                    this.refs.mainComponent.getWrappedInstance().checkingDevice();
                    this.refs.setVolumeModal.close();
                  }}
                  containerStyle={{ width: 170 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                  textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                />
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.header}>
          <Image
            style={{ width: 29 * SCALE1, height: 29 * SCALE1, marginRight: 8 * SCALE1 }}
            source={require('../../../resource/img/logo-ny.png')}>
          </Image>
          <View style={{ flex: 0 }}>
            <Text style={{ color: 'white', fontSize: 21 * SCALE1 }}>驰声英语听说校园版模拟考试训练系统</Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 0, width: 210 * SCALE1, borderColor: '#dedcdf', borderRightWidth: 1, paddingHorizontal: 28 * SCALE1, paddingTop: 10 * SCALE2 }}>
            <View style={styles.dotBorder}>
              <View style={{ width: 5 * SCALE2, height: 10 * SCALE2, backgroundColor: COLOR.theme, marginRight: 5 * SCALE2, borderRadius: 3 * SCALE2 }}></View>
              <View>
                <Text style={{ fontSize: 10 * SCALE2, color: COLOR.theme }}>学生信息</Text>
              </View>
            </View>
            <View>
              <Image style={{ width: 100 * SCALE2, height: 5 * SCALE2 }}
                source={require('../../../resource/img/dotline.png')}>
              </Image>
            </View>
            <View style={{ alignItems: 'center', marginVertical: 20 * SCALE1 }}>
              <Image style={{ width: 100 * SCALE1, height: 132 * SCALE1 }}
                source={headPic.length < 30 ? require('../../../resource/img/default.jpg') : { uri: headPic }}>
              </Image>
            </View>
            <View style={{ marginBottom: 10 * SCALE2 }}>
              <Text style={styles.smallFont}>姓名：{Name}</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.smallFont}>学号：</Text>
                <Text style={{ fontSize: 15 * SCALE1, width: 120 * SCALE1, marginVertical: 2 * SCALE1 }}>{No}</Text>
              </View>
              <Text style={styles.smallFont}>座位号：{SeatNo}</Text>
            </View>
            {/* {
              this.props.rightSideType === 'checking'
                ?
                (
                  <View>
                    <View style={styles.dotBorder}>
                      <View style={{ width: 5 * SCALE2, height: 10 * SCALE2, backgroundColor: COLOR.theme, marginRight: 5 * SCALE2, borderRadius: 3 * SCALE2 }}></View>
                      <View>
                        <Text style={{ fontSize: 10 * SCALE2, color: COLOR.theme }}>耳麦设置</Text>
                      </View>
                    </View>
                    <View>
                      <Image style={{ width: 100 * SCALE2, height: 5 * SCALE2 }}
                        source={require('../../../resource/img/dotline.png')}
                      >
                      </Image>
                    </View> */}
            {/* <View style={{ marginTop: 5 * SCALE2 }}>
              <Text style={styles.smallFont}>耳机音量调节：</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={{ width: 10 * SCALE2, height: 10 * SCALE2 }}
                  source={this.props.soundValue === 0 ?
                    require('../../../resource/img/earphone2.png')
                    : require('../../../resource/img/earphone1.png')}
                >
                </Image>
                <Slider value={defaultSoundVolum} style={{ width: 105 * SCALE2 }} onValueChange={this.changeSoundSlider}></Slider>
              </View>
            </View> */}
            {/* <View style={{ marginTop: 5 * SCALE2 }}>
                      <Text style={styles.smallFont}>麦克风音量调节：</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 10 * SCALE2, height: 10 * SCALE2 }}
                          source={this.state.ifRecordSlider0 ?
                            require('../../../resource/img/microphone2.png')
                            : require('../../../resource/img/microphone1.png')}
                        >
                        </Image>
                        <Slider value={defaultSoundVolum} style={{ width: 105 * SCALE2 }} onValueChange={this.changeRecordSlider}></Slider>
                      </View>
                    </View>
                  </View>
                ) : null
            } */}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10 * SCALE2 }}>
              <Image style={{ width: 106 * SCALE1, height: 32 * SCALE1 }}
                source={require('../../../resource/img/chivox-logo.png')}
              >
              </Image>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            {/* {playButton} */}
            <Main ref="mainComponent" modalOpen={(modalName) => { this.refs[modalName].open(); }} modalClose={() => { this.refs[modalName].close(); }} />
          </View>
        </View>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  smallFont: {
    fontSize: 15 * SCALE1,
    marginVertical: 2 * SCALE1
  },
  dotBorder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLOR.theme,
    height: 35 * SCALE2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10 * SCALE2,
    borderBottomWidth: 1,
    borderColor: '#ff7731'
  },
  page: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

function mapStateToProps(state) {
  const { rightSideType, ip } = state.global;
  const { userData } = state.user;
  const { soundValue, ifPlaying } = state.sound;
  return {
    rightSideType,
    userData,
    soundValue,
    ifPlaying,
    ip
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);