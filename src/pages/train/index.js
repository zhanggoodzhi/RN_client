import React, { Component } from 'react';
import { NativeModules, StyleSheet, View, Text, TextInput, Image, Button, Slider, InteractionManager, ScrollView, ToastAndroid, StatusBar } from 'react-native';
import { COLOR, SCALE2, SCALE1, EventEmitter, BRAND, SCALE } from '../../components/utils';
import { bindActionCreators } from 'redux'
import * as actions from '../../redux/actions'
import Modal from "react-native-modalbox";
import { connect } from 'react-redux'
import orientation from '../../components/orientation';
import * as components from '../../components/ui';
import * as prompt from '../../components/prompt';
import BackgroundTimer from 'react-native-background-timer';
import * as socket from '../../components/native/socket';
import { config } from '../../components/native/channel';
import * as soundComponent from '../../components/sound';
import * as scoreModule from '../../components/native/score';
import CheckingSystem from './CheckingSystem';
import '../../components/native/PhoneVolume';
import Main from './Main';
import TotalAnswer from './TotalAnswer';
import { downloadPaper, uploadAnswer } from '../../components/native/ftp';
// let audioPath =  '/storage/emulated/0/test111.aac';

class Train extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    // EventEmitter.addListener('connectPaperServerSuccess', () => {
    //   console.log('连接试卷服务器成功');
    //   if (this.props.trainType === 'downloading') {
    //     // 下载试卷
    //     console.log(this.props.loginType);
    //     if (this.props.loginType === 'ready' || this.props.loginType === 'login') {
    //       socket.send(20, {
    //         Index: this.props.paperIndex
    //       });
    //     } else {
    //       BackgroundTimer.setTimeout(() => {
    //         this.props.changeTrainType('downloadError');
    //       }, 1000);
    //     }
    //     return;
    //   }
    // });
    EventEmitter.addListener('downloadFailed', () => {
      console.log('ftp下载失败');
      this.props.changeTrainType('downloadError');
    });
    EventEmitter.addListener('ftpDownloaded', (obj) => {
      console.log('ftp下载成功', obj);
      // obj.data.areas[1].questions.forEach((v, i) => {
      //     obj.data.areas[1].questions[i].contents[0].prepareseconds = '1';
      //     obj.data.areas[1].questions[i].contents[0].answerseconds = '1';
      // });
      // console.log(obj);
      this.props.initPaperData(obj.data, obj.path);
      socket.send('47', {
        PaperId: obj.data.guid,
        PaperName: obj.data.name
      });
      socket.send('16', {
        Status: parseInt(4001, 16),
        AreaIndex: 1,
        QuestionIndex: 0,
        ContentIndex: 0,
        Behavior: 0
      });
      this.props.changePaperAnswer({
        studentno: this.props.userData.No,
        paperguid: obj.data.guid,
        papername: obj.data.name,
        recordguid: []
      });
      this.props.changeTrainType('train');
    });
    EventEmitter.addListener('uploadError', () => {
      console.log('答案上传失败');
      this.props.changeTrainType('uploadError');
    });

    EventEmitter.addListener('uploadSuccess', () => {
      console.log('答案上传成功');
      this.props.changeTrainType('uploadSuccess');
    });
    // EventEmitter.addListener('paperDownloaded', (obj) => {
    //   console.log(obj);
    //   // obj.data.areas[1].questions.forEach((v, i) => {
    //   //     obj.data.areas[1].questions[i].contents[0].prepareseconds = '1';
    //   //     obj.data.areas[1].questions[i].contents[0].answerseconds = '1';
    //   // });
    //   // console.log(obj);
    //   // this.props.initPaperData(obj.data, obj.path);
    //   socket.send('16', {
    //     Status: parseInt(4001, 16),
    //     AreaIndex: 0,
    //     QuestionIndex: 0,
    //     ContentIndex: 0,
    //     Behavior: 0
    // });
    //   this.props.changeTrainType('train');
    //   socket.destroyPaperServer();
    // });
    EventEmitter.addListener('resetApp', () => {
      console.log('重置登录');
      setTimeout(() => {
        this.props.navPopToTop();
        this.props.resetPaperReducer();
        this.props.changeLoginType('login');
        this.props.changeTrainType('checking');
      }, 0);
    });
    EventEmitter.addListener('getUploadPath', (data) => {
      uploadAnswer(this.props.ip, this.props.paperAnswer, data.ServerPath);
    });
    EventEmitter.addListener('endExam', () => {
      console.log('结束练习');
      console.log(234, this.refs.main, this.props.trainType);
      if (this.props.trainType !== 'uploadSuccess' && this.props.trainType !== 'uploadError' && this.props.trainType !== 'uploading') {
        this.refs.main.getWrappedInstance().cancelRecord();
        this.props.resetSound();
        socket.send('48', {
          StudentNo: this.props.No,
        });
        this.props.changeTrainType('uploading');
      }
    });
  }
  componentWillUnmount() {
    console.log('train/index卸载');
    EventEmitter.removeAllListeners('downloadFailed');
    EventEmitter.removeAllListeners('ftpDownloaded');
    EventEmitter.removeAllListeners('uploadSuccess');
    EventEmitter.removeAllListeners('uploadError');
    EventEmitter.removeAllListeners('resetApp');
    EventEmitter.removeAllListeners('getUploadPath');
    EventEmitter.removeAllListeners('endExam');
  }
  render() {
    let body = null;
    switch (this.props.trainType) {
      case 'downloading':
        body = <prompt.Downloading isTrain={true}></prompt.Downloading>;
        break;
      case 'downloadError':
        body = (
          <prompt.DownloadError
            isTrain={true}
            buttonEvent={() => {
              if (this.props.loginType === 'error') {
                socket.connect(this.props.ip);
              } else {
                downloadPaper(this.props.ip, this.props.selectedPaper.PaperPathForFTP, this.props.selectedPaper.PaperID, this.props.selectedPaper.LMDic);
              }
              this.props.changeTrainType('downloading');
            }}
          ></prompt.DownloadError>
        );
        break;
      case 'uploading':
        body = <prompt.Uploading isTrain={true}></prompt.Uploading>;
        break;
      case 'totalAnswer':
        body = <TotalAnswer></TotalAnswer>;
        break;
      case 'uploadSuccess':
        body = (
          <prompt.UploadSuccess
            isTrain={true}
            buttonEvent={() => {
              this.props.changeTrainType('totalAnswer');
            }}
          ></prompt.UploadSuccess>
        );
        break;
      case 'uploadError':
        body = (
          <prompt.UploadError
            isTrain={true}
            buttonEvent={() => {
              if (this.props.loginType === 'error') {
                socket.connect(this.props.ip);
              } else {
                socket.send('48', {
                  StudentNo: this.props.userData.No
                });
              }
              this.props.changeTrainType('uploading');
              // socket.connectPaperServer(this.props.ip);
              // this.props.changeRightSideType('complete');
            }}
          ></prompt.UploadError>
        );
        break;
      case 'checking':
        body = <CheckingSystem></CheckingSystem>;
        break;
      case 'train': {
        body = (
          <Main ref="main"></Main>
        );
        break;
      };
      default: body = null;
    }
    let title = null;
    let channel = config.channel;
    switch (channel) {
      case 'chivox':
        title = (
          <View style={styles.header}>
            <Image
              style={{ width: 34 * SCALE, height: 34 * SCALE, marginRight: 9 * SCALE }}
              source={require('../../../resource/img/logo1_small.png')}>
            </Image>
            <View style={{ flex: 0 }}>
              <Text style={{ color: 'white', fontSize: 18 * SCALE }}>驰声英语听说校园版训练系统</Text>
            </View>
          </View>
        ); break;
      case 'acer':
        title = (
          <View style={styles.header}>
            <Image
              style={{ width: 82 * SCALE, height: 20 * SCALE }}
              source={require('../../../resource/img/logo2_small.png')}>
            </Image>
            <View style={{ flex: 0 }}>
              <Text style={{ color: 'white', fontSize: 18 * SCALE }}>AES英语听说训练系统</Text>
            </View>
          </View>
        ); break;
    }
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="light-content"
        />
        {this.props.trainType === 'train' || this.props.trainType === 'totalAnswer' ? null : title}
        {body}
      </View >
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLOR.theme,
    height: 52 * SCALE,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25 * SCALE,
    paddingTop: 50 * SCALE,
    borderBottomWidth: 2 * SCALE,
    borderColor: '#ff7831'
  },
})

function mapStateToProps(state) {
  const { trainType, ip, loginType } = state.global;
  const { userData } = state.user;
  const nav = state.nav;
  const { soundValue } = state.sound;
  const { areaIndex, questionIndex, contentIndex, paperData, paperIndex, selectedPaper, paperAnswer } = state.paper;
  return {
    trainType,
    loginType,
    userData,
    soundValue,
    areaIndex,
    questionIndex,
    contentIndex,
    paperData,
    paperAnswer,
    selectedPaper,
    ip,
    paperIndex,
    nav
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Train);