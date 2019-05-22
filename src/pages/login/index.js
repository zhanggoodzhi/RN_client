import React, { Component } from 'react';
import { KeyboardAvoidingView, StatusBar, DeviceEventEmitter, NativeModules, StyleSheet, View, Text, TextInput, Image, Button, ToastAndroid, TouchableOpacity, Alert, TouchableNativeFeedback, Keyboard } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast'
import Modal from "react-native-modalbox";
import { bindActionCreators } from 'redux'
import { downloadPaper, downloadApk, uploadAnswer } from '../../components/native/ftp';
import { checkJSVersion,downloadJS } from '../../components/native/UpdateJsAndResource';
import * as actions from '../../redux/actions'
import { connect } from 'react-redux'
import { COLOR, SCALE, SCALE2, SCALE1, EventEmitter, DEFAULT_IP, HEIGHT, BRAND, toast } from '../../components/utils';
import RNExitApp from 'react-native-exit-app';
import orientation from '../../components/orientation';
import * as components from '../../components/ui';
import storage from '../../components/storage';
import * as prompt from '../../components/prompt';
import * as socket from '../../components/native/socket';
import { config } from '../../components/native/channel';
import * as soundComponent from '../../components/sound';
import BackgroundTimer from 'react-native-background-timer';
import { Bar } from 'react-native-progress';
let ifFirstSuccess = true;
class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      test: '',
      studentNo: '',
      isOpen: false,
      seatNo: '',
      seatInput: '',
      errorVisible: false,
      studentNoSure: '',
      seatNoSure: '',
      studentName: '',
      headPic: '',
      errorText: '',
      ip1: '',
      ip2: '',
      ip3: '',
      ip4: '',
      connectCount: 1,
      ifShowTitle: true,
      updatePercent: 0,
      newVersion: 0
    }
    this.connectTimer = null;
    this.heartBeat = null;
    this.lastBackPressed = null;
    this.keyboardDidShowListener = null;
    this.keyboardDidHideListener = null;
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      this.setState({
        ifShowTitle: false
      });
    });
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.setState({
        ifShowTitle: true
      });
    });
    // 当其他页面跳转过来时，重新渲染state里面的ip
    // const ip = this.props.ip;
    // this.setState({
    //   ip1: ip.split('.')[0],
    //   ip2: ip.split('.')[1],
    //   ip3: ip.split('.')[2],
    //   ip4: ip.split('.')[3],
    // });
    console.log('login初始化');
    orientation();
    socket.bindEvents();
    storage.load({
      key: 'ip',

      // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
      autoSync: true,

      // syncInBackground(默认为true)意味着如果数据过期，
      // 在调用sync方法的同时先返回已经过期的数据。
      // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
      syncInBackground: true,

      // 你还可以给sync方法传递额外的参数
      syncParams: {
        extraFetchOptions: {
          // 各种参数
        },
        someFlag: true,
      },
    }).then(ret => {
      // 如果找到数据，则在then方法中返回
      // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
      // 你只能在then这个方法内继续处理ret数据
      // 而不能在then以外处理
      // 也没有办法“变成”同步返回
      // 你也可以使用“看似”同步的async/await语法
      this.setState({
        ip1: ret.split('.')[0],
        ip2: ret.split('.')[1],
        ip3: ret.split('.')[2],
        ip4: ret.split('.')[3],
      });
      this.props.changeIp(ret);
      socket.connect(ret);
    }).catch(err => {
      //如果没有找到数据且没有sync方法，
      //或者有其他异常，则在catch中返回
      console.log('未获取到IP缓存数据');
      this.refs.configModal.open();
      // this.setState({
      //   ip1: IP1,
      //   ip2: IP2,
      //   ip3: IP3,
      //   ip4: IP4,
      // });
      // this.props.changeIp(DEFAULT_IP);
      // socket.connect(DEFAULT_IP);
      // console.warn(err.message);
    })
    EventEmitter.addListener('dataError', () => {
      this.props.changeBtnLoading(false);
    });
    EventEmitter.addListener('updateLoading', (number) => {
      this.setState({
        updatePercent: number
      });
    });
    EventEmitter.addListener('updateSuccess', () => {

    });
    EventEmitter.addListener('updateError', () => {
      toast('更新遇到问题，即将关闭程序');
      setTimeout(() => {
        RNExitApp.exitApp();
      }, 3000);
    });

    EventEmitter.addListener('jsUpdateLoading', (number) => {
      this.setState({
        updatePercent: number
      });
    });
    EventEmitter.addListener('jsUpdateSuccess', () => {
      this.props.changeLoginType('ready');
    });
    EventEmitter.addListener('jsUpdateError', () => {
      this.props.changeLoginType('ready');
    });

    EventEmitter.addListener('connecting', (id) => {
      console.log('正在连接,id:', id);
      if (id === 1) {
        this.connectTimer = BackgroundTimer.setInterval(() => {
          this.setState({
            connectCount: this.state.connectCount + 1
          });
        }, 1000);
        this.props.changeLoginType('connecting');
      }
    });
    EventEmitter.addListener('connectError', (id) => {
      if (id === 2 && this.props.rightSideType === 'complete') {
        this.props.changeRightSideType('uploadError');
        return;
      }
      BackgroundTimer.clearInterval(this.connectTimer);
      this.setState({
        connectCount: 1
      });
      BackgroundTimer.clearInterval(this.heartBeat);
      this.props.changeLoginType('error');
      console.log('trainType', this.props.trainType);
      if (this.props.trainType === 'downloadError' || this.props.trainType === 'uploadError') {
        return;
      }
      if (this.props.trainType === 'downloading') {
        this.props.changeTrainType('downloadError');
        return;
      }
      if (this.props.trainType === 'uploading') {
        this.props.changeTrainType('uploadError');
        return;
      }
      // 非练习模式
      if (this.props.nav.routes[this.props.nav.routes.length - 1].routeName !== 'train') {
        if (this.props.rightSideType === 'downloading' || this.props.rightSideType === 'ready' || this.props.rightSideType === 'checking') {
          if (this.props.nav.routes[this.props.nav.routes.length - 1].routeName !== 'login') {
            EventEmitter.removeAllListeners();
            this.props.navJump({ routeName: 'login' });
            return;
          }
        } else {
          //考中
          BackgroundTimer.setTimeout(() => {
            if (this.props.loginType !== 'connecting') {
              socket.connect(this.props.ip);
              return;
            }
          }, 5000);
        }
      } else {// 练习模式

        if (this.props.trainType === 'checking') {
          EventEmitter.removeAllListeners();
          this.props.navJump({ routeName: 'login' });
          return;
        } else if (this.props.nav.routes[this.props.nav.routes.length - 1].routeName !== 'login' && (this.props.trainType === 'train' || this.props.trainType === 'uploadSuccess')) {
          //练习以及结束的页面，断网重连
          BackgroundTimer.setTimeout(() => {
            if (this.props.loginType !== 'connecting') {
              socket.connect(this.props.ip);
              return;
            }
          }, 5000);
        }
      }
    });
    EventEmitter.addListener('silentLoginSuccess', (formatData) => {
      if (this.props.trainType === 'downloading') {
        downloadPaper(this.props.ip, this.props.selectedPaper.PaperPathForFTP, this.props.selectedPaper.PaperID, this.props.selectedPaper.LMDic);
      }
      if (this.props.trainType === 'uploading') {
        socket.send('48', {
          StudentNo: this.props.userData.No
        });
      }
    });
    EventEmitter.addListener('getUpdateInfo', (formatData) => {
      const data = formatData.CheckFileList[0];
      if (data.NeedUpgrade) {
        this.props.changeLoginType('updating');
        this.setState({
          newVersion: data.FileName
        });
        downloadApk(this.props.ip, data.FilePath, data.FileName);
      } else {
        checkJSVersion(this.props.ip, (flag) => {
          if (flag) {
            downloadJS();
            this.props.changeLoginType('updating');
            this.setState({
              newVersion: ''
            });
          }
        });
      }
    });
    EventEmitter.addListener('setLoginStatus', (formatData) => {
      if (formatData.data.ServerStatus == 1 && this.props.loginType !== 'login' && this.props.loginType !== 'updating') {
        this.props.changeLoginType('login');
      } else if (formatData.data.ServerStatus == 0 && this.props.loginType !== 'ready' && this.props.loginType !== 'updating') {
        this.props.changeLoginType('ready');
      }
      if (formatData.data.ServerStatus == 0 && this.props.nav.routes[this.props.nav.routes.length - 1].routeName !== 'login') {
        socket.send(51, {
          EmptyValue: 1
        });
        EventEmitter.emit('resetApp');
      }
    });
    EventEmitter.addListener('connectSuccess', () => {
      //发心跳
      this.heartBeat = BackgroundTimer.setInterval(() => {
        socket.send(0, {
          EmptyValue: 1
        });
      }, 1000);
      BackgroundTimer.clearInterval(this.connectTimer);
      this.setState({
        connectCount: 1
      });
      // 获取分配的座位号
      if (this.props.nav.routes[this.props.nav.routes.length - 1].routeName === 'login') {
        socket.send(51, {
          EmptyValue: 1
        });
      }
      console.log('connectSuccess');
      this.props.changeLoginType('ready');
      if (ifFirstSuccess) {
        ifFirstSuccess = false;
        socket.send(43, {
          Product: config.channel,
          VersionCode: config.version,
          // VersionCode: 1,
          CheckFileType: 2,
        });
      }
      //考中断线重连成功
      console.log(this.props.rightSideType);
      if (this.props.rightSideType !== 'downloading' && this.props.rightSideType !== 'ready' && this.props.rightSideType !== 'checking') {
        // 静默登录
        console.log('考试模式进行静默登陆');
        console.log('socket', socket);
        socket.send(32, {
          "SeatNo": this.props.SeatNo,
          "StudentNo": this.state.studentNo,
          CurrentBatchID: this.props.CurrentBatchID
        });
        console.log('静默登录代码后');
      }
      //练习模式断线重连
      if (this.props.trainType !== 'checking') {
        // 静默登录
        console.log('练习模式进行静默登陆');
        console.log('socket', socket);
        socket.send(32, {
          "SeatNo": this.props.SeatNo,
          "StudentNo": this.state.studentNo,
          CurrentBatchID: this.props.CurrentBatchID
        });
      }
    });
    EventEmitter.addListener('login', (data) => {
      console.log('登录信息', data);

      this.props.initUserData({
        Name: data.Name,
        No: data.No,
        SeatNo: this.props.SeatNo,
        className: data.className,
        taskType: data.TaskType,
        headPic: 'data:image/png;base64,' + data.HeadPic,
        CurrentBatchID: data.CurrentBatchID,
        MarkAppKey: data.MarkAppKey,
        MarkSecret: data.MarkSecret,
        MarkProvision: data.MarkProvision
      });
      this.refs.modal.open();
    });
    EventEmitter.addListener('getSeat', (data) => {
      console.log('获取座位号', data);
      this.props.changeSeatNo(data.SeatNo);
      socket.send(30, {
        SeatNo: data.SeatNo
      });
    });
    EventEmitter.addListener('setSeat', (data) => {
      console.log('获取座位号', data);
      this.props.changeSeatNo(data.SeatNo);
    });

    EventEmitter.addListener('sureLogin', (data) => {
      console.log('确认登录信息', data);
      if (this.props.userData.taskType == 2) {
        this.props.navJump({
          routeName: 'train'
        });
      } else {
        this.props.navJump({
          routeName: 'home'
        });
      }
    });

    EventEmitter.addListener('canLogin', (data) => {
      console.log('允许登陆了');
      this.props.changeLoginType('login');
    });

    EventEmitter.addListener('exitApp', (data) => {
      RNExitApp.exitApp();
    });
  }
  login() {
    // if (this.props.SeatNo === '') {
    // ToastAndroid.showWithGravityAndOffset('请输入座位号', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 50 * SCALE);
    //   // this.setState({
    //   //   errorVisible: true,
    //   //   errorText: '请输入座位号'
    //   // });
    //   return;
    // }
    if (this.state.studentNo === '') {
      // this.setState({
      //   errorVisible: true,
      //   errorText: '请输入学号'
      // });
      toast('请输入学号');
      return;
    }
    if (Number(this.props.SeatNo) === NaN) {
      // this.setState({
      //   errorVisible: true,
      //   errorText: '座位号必须为数字'
      // });
      toast('座位号必须为数字');
      return;
    }
    //登录数据
    console.log('登录请求');
    this.props.changeBtnLoading(true);
    socket.send(8, {
      "SeatNo": this.props.SeatNo,
      "StudentNo": this.state.studentNo
    }
    );
  }
  connectIp() {
    for (let i = 1; i < 5; i++) {
      console.log(this.state['ip' + i]);
    }
    if (this.state.ip1 === '' || this.state.ip2 === '' || this.state.ip3 === '' || this.state.ip4 === ''
      ||
      Number(this.state.ip1) > 255 || Number(this.state.ip2) > 255 || Number(this.state.ip3) > 255 || Number(this.state.ip4) > 255) {
      ToastAndroid.showWithGravityAndOffset('IP地址填写有误！', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 50 * SCALE);
      return;
    }
    this.changeIp();
    console.log('关闭弹框');
    this.refs.configModal.close();
  }
  getTextInput(number) {
    return (
      <TextInput
        maxLength={3}
        returnKeyLabel="连接"
        ref={'ipText' + number}
        onSubmitEditing={() => { this.connectIp(); }}
        style={{ textAlign: 'center', width: 102 * SCALE, fontSize: 30 * SCALE, borderWidth: 1 * SCALE, borderColor: '#cdcdcd', borderRadius: 3 * SCALE2, paddingVertical: 5 * SCALE1, paddingHorizontal: 5 * SCALE2 }}
        underlineColorAndroid="transparent"
        keyboardType="numeric"
        onChangeText={(text) => {
          // if (text==='.' && number !== 1) {
          //   this.refs['ipText' + (number - 1)].focus();
          // }
          const obj = {};
          obj['ip' + number] = text.replace(/[^0-9]*/g, '');
          // obj['ip' + number] = text;
          this.setState(obj);
          if ((text.length === 3 || text[text.length - 1] === '.') && number !== 4) {
            this.refs['ipText' + (number + 1)].focus();
          }
          // setTimeout(() => {
          //   for (let i = 1; i < 5; i++) {
          //     console.log(this.state['ip' + i]);
          //   }
          // }, 0);
        }}
        onKeyPress={({ nativeEvent: { key: keyValue } }) => {
          if (keyValue === 'Backspace' && this.state['ip' + number] === '' && number !== 1) {
            this.refs['ipText' + (number - 1)].focus();
          }
        }}
        value={this.state['ip' + number]}
      />
    );
  }
  loginSure() {
    console.log('确认登录');
    socket.send(12, {
      ConfirmFlag: true
    });
  }
  setSeat() {
    socket.send('30', {
      SeatNo: this.state.seatInput
    });
  }
  changeIp() {
    const { ip1, ip2, ip3, ip4 } = this.state;
    const ip = ip1 + '.' + ip2 + '.' + ip3 + '.' + ip4;
    this.props.changeIp(ip);
    storage.save({
      key: 'ip',  // 注意:请不要在key中使用_下划线符号!
      data: ip,
      // 如果不指定过期时间，则会使用defaultExpires参数
      // 如果设为null，则永不过期
      expires: null
    });
    console.log('本地存储IP');
    socket.connect(ip);
  }
  render() {
    const { Name, No, SeatNo, headPic } = this.props.userData;
    let body = null;
    let shadow = null;
    switch (this.props.loginType) {
      case 'ready': body = (
        <View style={{ height: 200 * SCALE2 }}>
          <prompt.PreLogin></prompt.PreLogin>
        </View>
      ); break;
      case 'updating': body = (
        <View style={{
          borderWidth: 1 * SCALE,
          marginTop: 20 * SCALE2,
          borderColor: '#d0d0d0',
          backgroundColor: 'white',
          borderRadius: 3 * SCALE1,
          width: 467 * SCALE,
          height: 181 * SCALE
        }}>
          <Text style={styles.title}>
            检测到新版本：{this.state.newVersion}
          </Text>
          <View style={{ flex: 1, paddingHorizontal: 34 * SCALE, paddingVertical: 43 * SCALE }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18 * SCALE }}>正在更新，请稍后...</Text>
              <Text style={{ fontSize: 18 * SCALE }}>{this.state.updatePercent}%</Text>
            </View>
            <View style={{ marginTop: 8 * SCALE }}>
              <Bar progress={(this.state.updatePercent) / 100} width={null} height={12 * SCALE} borderRadius={6 * SCALE} borderWidth={0} color="#0db500" unfilledColor="#dcdcdc" />
            </View>
          </View>
        </View>
      );
        shadow = <Image
          style={{ width: 467 * SCALE, resizeMode: Image.resizeMode.stretch, }}
          source={require('../../../resource/img/login_img_shadow.png')}>
        </Image>;
        break;
      case 'connecting': body = (
        <View style={{
          borderWidth: 1 * SCALE,
          marginTop: 20 * SCALE2,
          borderColor: '#d0d0d0',
          backgroundColor: 'white',
          borderRadius: 3 * SCALE1,
          width: 397 * SCALE,
          height: 191 * SCALE
        }}>
          <Text style={styles.title}>
            网络状态
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <View>
              <Image
                style={{ width: 38 * SCALE, height: 28 * SCALE, marginRight: 15 * SCALE, resizeMode: Image.resizeMode.contain }}
                source={require('../../../resource/img/connect.gif')}>
              </Image>
            </View>
            <View>
              <Text style={{ fontSize: 20 * SCALE }}>正在连接教师机...{this.state.connectCount}</Text>
            </View>
          </View>
        </View>
      );
        shadow = <Image
          style={{ width: 397 * SCALE, resizeMode: Image.resizeMode.stretch, }}
          source={require('../../../resource/img/login_img_shadow.png')}>
        </Image>;
        break;
      case 'error': body = (
        <View style={{
          borderWidth: 1 * SCALE,
          marginTop: 20 * SCALE2,
          borderColor: '#d0d0d0',
          backgroundColor: 'white',
          borderRadius: 3 * SCALE1,
          width: 397 * SCALE,
          height: 236 * SCALE
        }}>
          <Text style={styles.title}>
            网络状态
          </Text>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 41 * SCALE }}>
              <Image
                style={{ width: 38 * SCALE, height: 28 * SCALE, marginRight: 15 * SCALE }}
                source={require('../../../resource/img/default_ico_ljsb.png')}>
              </Image>
              <Text style={{ fontSize: 20 * SCALE, color: '#ff0000' }}>连接失败！</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View>
                <components.Button
                  text="重试"
                  onPress={() => { this.changeIp(); }}
                  type="flat"
                  containerStyle={{ backgroundColor: '#f7f7f7', width: 108 * SCALE, height: 44 * SCALE, borderColor: '#cfcfcf', marginTop: 22 * SCALE1, marginHorizontal: 0, marginBottom: 10 * SCALE1, paddingHorizontal: 0, borderRadius: 3 * SCALE1 }}
                  textStyle={{ color: "#333", fontSize: 16 * SCALE1 }}
                />
              </View>
              <View>
                <components.Button
                  text="教师机连接设置"
                  onPress={() => { this.refs.configModal.open(); }}
                  containerStyle={{ width: 177 * SCALE, marginRight: 0, height: 44 * SCALE, marginLeft: 0, marginLeft: 20 * SCALE, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                  textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                />
              </View>
              {/* <TouchableOpacity
                onPress={() => {
                  this.changeIp();
                }}
                activeOpacity={0.5}>
                <Text style={{ textDecorationLine: 'underline', fontSize: 14 * SCALE1, color: '#155def' }}>重试</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.refs.configModal.open();
                }}
                activeOpacity={0.5}>
                <Text style={{ textDecorationLine: 'underline', fontSize: 14 * SCALE1, color: '#155def', marginLeft: 17 * SCALE1 }}>教师机连接设置</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      );
        shadow = <Image
          style={{ width: 397 * SCALE, resizeMode: Image.resizeMode.stretch, }}
          source={require('../../../resource/img/login_img_shadow.png')}>
        </Image>;
        break;
      case 'login': body = (
        <View style={styles.loginWrap}>
          <Text style={styles.title}>
            学生登录
            </Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 0, paddingLeft: 30 * SCALE, paddingRight: 20 * SCALE, paddingVertical: 41 * SCALE }}>
              {/* <TouchableOpacity
                onPress={() => {
                  this.setState({
                    seatInput: this.props.SeatNo
                  });
                  this.refs.seatModal.open();
                }}
                activeOpacity={0.5}> */}
              <View style={styles.circleBorder} >
                <Text style={{ fontSize: 16 * SCALE, textAlign: 'center', marginTop: 22 * SCALE }}>
                  座位号
                </Text>
                <Text style={{ textAlign: 'center', fontSize: 63 * SCALE, color: '#fe9d28', lineHeight: 75 * SCALE }}>
                  {this.props.SeatNo || 0}
                </Text>
              </View>
              {/* </TouchableOpacity> */}
            </View>
            <View style={{ flex: 1, paddingTop: 51 * SCALE, paddingRight: 31 * SCALE1 }}>
              <TextInput
                style={{ width: 290 * SCALE, height: 44 * SCALE, fontSize: 18 * SCALE, borderWidth: 1 * SCALE, borderColor: '#cdcdcd', borderRadius: 3 * SCALE2, paddingVertical: 10 * SCALE, paddingHorizontal: 5 * SCALE2 }}
                underlineColorAndroid="transparent"
                placeholder="输入学号"
                returnKeyLabel="确认"
                autoCorrect={false}
                onSubmitEditing={() => { this.props.btnLoading ? null : this.login() }}
                onChangeText={(text) => this.setState({ studentNo: text, errorVisible: false })}
                value={this.state.studentNo}
              />
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <components.Button
                    disabled={this.props.btnLoading}
                    text="确认"
                    onPress={() => { this.login(); Keyboard.dismiss(); }}
                    containerStyle={{ width: 170 * SCALE, marginRight: 0, height: 44 * SCALE, marginLeft: 0, marginRight: 20 * SCALE, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                    textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                  />
                </View>
                <View>
                  <components.Button
                    text="重置"
                    onPress={() => { this.setState({ studentNo: '' }); }}
                    type="flat"
                    containerStyle={{ backgroundColor: '#f7f7f7', width: 100 * SCALE, height: 44 * SCALE, borderColor: '#cfcfcf', marginTop: 22 * SCALE1, marginHorizontal: 0, marginBottom: 10 * SCALE1, paddingHorizontal: 0, borderRadius: 3 * SCALE1 }}
                    textStyle={{ color: "black", fontSize: 16 * SCALE1 }}
                  />
                </View>
              </View>
              {
                // this.state.errorVisible ?
                //   (
                //     <View style={{
                //       flexDirection: 'row',
                //       alignItems: 'center',
                //     }}>
                //       <Image
                //         style={{ width: 16 * SCALE1, height: 16 * SCALE1, marginRight: 5 * SCALE1 }}
                //         source={require('../../../resource/img/ico_notice.png')}>
                //       </Image>
                //       <View style={{ flex: 0 }}>
                //         <Text style={{ fontSize: 13 * SCALE1 }}>{this.state.errorText}</Text>
                //       </View>
                //     </View>
                //   ) : null
              }
            </View>
          </View>
        </View>
      );
        shadow = <Image
          style={{ width: 508 * SCALE, resizeMode: Image.resizeMode.contain, }}
          source={require('../../../resource/img/login_img_shadow.png')}>
        </Image>;
        break;
    }
    let title = null;
    let channel = config.channel;
    switch (channel) {
      case 'chivox':
        title = (
          <View style={styles.titleWrap}>
            <Image
              style={styles.logo}
              source={require('../../../resource/img/logo1_big.png')}>
            </Image>
            <View style={{ flex: 0 }}>
              <Text style={{ color: '#1bb871', fontSize: 28 * SCALE1, fontWeight: 'bold' }}>驰声英语听说校园版训练系统</Text>
            </View>
          </View>
        ); break;
      case 'acer':
        title = (
          <View style={styles.titleWrap}>
            <Image
              style={{ width: 148 * SCALE, height: 36 * SCALE }}
              source={require('../../../resource/img/logo2_big.png')}>
            </Image>
            <View style={{ flex: 0 }}>
              <Text style={{ color: '#1bb871', fontSize: 28 * SCALE1, fontWeight: 'bold' }}>AES英语听说训练系统</Text>
            </View>
          </View>
        ); break;
    }
    return (
      <KeyboardAvoidingView refs="keyboardView" style={styles.page} behavior='padding' enabled>
        {
          // this.props.loginType === 'ready' ?
          //   (
          //     <View style={{ flexDirection: 'row', position: 'absolute', zIndex: 9, right: 50 * SCALE1, top: 40 * SCALE1 }}>
          //       <Text style={{ fontSize: 15 * SCALE1, color: '#383838' }}>网络状态：</Text>
          //       <Text style={{ fontSize: 15 * SCALE1, color: '#019e31' }}>连接成功</Text>
          //     </View>
          //   ) : null
        }
        < Image
          style={{ width: 1280 * SCALE, height: 363 * SCALE, position: 'absolute', bottom: 0, resizeMode: 'stretch' }}
          source={require('../../../resource/img/login_bg.png')} >
        </Image >
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        {/* <View style={{ height: 50, backgroundColor: 'red', width: 639.83 }}></View> */}
        <Toast ref="toast" position="top" positionValue={150 * SCALE2} />
        <Modal
          onOpened={() => {
            this.props.changeBtnLoading(false);
          }}
          backdropPressToClose={false}
          animationDuration={0}
          style={{ width: 566 * SCALE, height: 296 * SCALE, backgroundColor: 'white', borderRadius: 3 * SCALE2 }} ref="modal" swipeToClose={false}>
          <View style={{ paddingLeft: 10 * SCALE1, justifyContent: 'center', width: 566 * SCALE, height: 60 * SCALE, borderBottomWidth: 1 * SCALE2, borderColor: '#e1e1e1', backgroundColor: '#f3f1f2', borderTopLeftRadius: 3 * SCALE2, borderTopRightRadius: 3 * SCALE2 }}>
            <Text style={{ fontSize: 22 * SCALE }}>核对身份</Text>
          </View>
          <View style={{ flexDirection: 'row', paddingHorizontal: 59 * SCALE, paddingTop: 32 * SCALE1 }}>
            <Image
              style={{ width: 123 * SCALE, height: 162 * SCALE, marginRight: 22 * SCALE }}
              source={headPic.length < 30 ? require('../../../resource/img/default.jpg') : { uri: headPic }}
            >
            </Image>
            <View style={{ flex: 1 }}>
              <Text style={{ borderBottomWidth: 1 * SCALE2, borderColor: '#e1e1e1', fontSize: 20 * SCALE, paddingBottom: 10 * SCALE }}>学号：{No}</Text>
              <Text style={{ borderBottomWidth: 1 * SCALE2, borderColor: '#e1e1e1', fontSize: 20 * SCALE, paddingVertical: 10 * SCALE }}>姓名：{Name}           座位号：{SeatNo}</Text>
              <View style={{ flexDirection: 'row' }}>
                <components.Button
                  text="确认"
                  onPress={() => { this.loginSure(); this.refs.modal.close(); }}
                  containerStyle={{ width: 136 * SCALE, height: 44 * SCALE, marginLeft: 0, marginRight: 25 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                  textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                />
                <components.Button
                  text="返回"
                  onPress={() => {
                    socket.send('16', {
                      Status: parseInt(1002, 16),
                      AreaIndex: 0,
                      QuestionIndex: 0,
                      ContentIndex: 0,
                      Behavior: 0
                    });
                    this.refs.modal.close();
                  }}
                  type="flat"
                  containerStyle={{ backgroundColor: '#f6f6f6', width: 136 * SCALE, height: 44 * SCALE, borderColor: '#cfcfcf', marginTop: 22 * SCALE1, marginHorizontal: 0, paddingHorizontal: 0, borderRadius: 3 * SCALE1 }}
                  textStyle={{ color: "#333", fontSize: 16 * SCALE1 }}
                />
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          backdropPressToClose={false}
          animationDuration={0}
          swipeToClose={false}
          onOpened={() => {
            this.refs.ipText1.focus();
          }}
          // style={{ alignItems: 'center', width: 558 * SCALE, height: 244 * SCALE, backgroundColor: 'white', borderRadius: 3 * SCALE2 }}
          style={{ backgroundColor: 'transparent' }}
          ref="configModal">
          <KeyboardAvoidingView
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
            refs="keyboardView"
            behavior='padding' enabled>
            <View
              style={{ alignItems: 'center', width: 558 * SCALE, height: 244 * SCALE, backgroundColor: 'white', borderRadius: 3 * SCALE2 }}
            >
              <View style={{ width: 557 * SCALE, borderBottomWidth: 1 * SCALE2, borderColor: '#e1e1e1', backgroundColor: '#f3f1f2', padding: 17 * SCALE, borderTopLeftRadius: 3 * SCALE2, borderTopRightRadius: 3 * SCALE2 }}>
                <Text style={{ fontSize: 22 * SCALE }}>教师机IP地址设置</Text>
              </View>
              <View style={{ flexDirection: 'row', padding: 10 * SCALE2 }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {this.getTextInput(1)}
                    <Text style={{ fontSize: 30 * SCALE, color: '#888', marginTop: 20 * SCALE1, paddingHorizontal: 5 * SCALE, textAlign: 'center', }}>
                      .
                </Text>
                    {this.getTextInput(2)}
                    <Text style={{ fontSize: 30 * SCALE, color: '#888', marginTop: 20 * SCALE1, paddingHorizontal: 5 * SCALE, textAlign: 'center', }}>
                      .
                </Text>
                    {this.getTextInput(3)}
                    <Text style={{ fontSize: 30 * SCALE, color: '#888', marginTop: 20 * SCALE1, paddingHorizontal: 5 * SCALE, textAlign: 'center', }}>
                      .
                </Text>
                    {this.getTextInput(4)}
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <components.Button
                        text="连接"
                        onPress={() => {
                          this.connectIp();
                        }}
                        containerStyle={{ width: 118 * SCALE, marginRight: 0, height: 44 * SCALE, marginLeft: 0, marginRight: 20 * SCALE, paddingHorizontal: 0, marginTop: 25 * SCALE, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                        textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                      />
                    </View>
                    <View>
                      <components.Button
                        text="取消"
                        onPress={() => { this.refs.configModal.close(); this.props.changeLoginType('error'); }}
                        type="flat"
                        containerStyle={{ backgroundColor: '#f7f7f7', width: 118 * SCALE, height: 44 * SCALE, borderColor: '#cfcfcf', marginTop: 25 * SCALE, marginHorizontal: 0, marginBottom: 10 * SCALE1, paddingHorizontal: 0, borderRadius: 3 * SCALE1 }}
                        textStyle={{ color: "black", fontSize: 16 * SCALE1 }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <Modal backdropPressToClose={false}
          animationDuration={0}
          style={{ alignItems: 'center', width: 250 * SCALE2, height: 160 * SCALE2, backgroundColor: 'white', borderRadius: 3 * SCALE2 }} ref="seatModal" swipeToClose={false}>
          <View style={{ width: 250 * SCALE2, borderBottomWidth: 1 * SCALE2, borderColor: '#e1e1e1', backgroundColor: '#f3f1f2', padding: 5 * SCALE2, borderTopLeftRadius: 3 * SCALE2, borderTopRightRadius: 3 * SCALE2 }}>
            <Text style={{ fontSize: 12 * SCALE2, fontWeight: 'bold' }}>座位号设置</Text>
          </View>
          <View style={{ flexDirection: 'row', padding: 10 * SCALE2 }}>
            <View style={{ flex: 1 }}>
              <View style={{ width: 372 * SCALE1, height: 51 * SCALE1, padding: 10 * SCALE1 }}>
                <Text style={{ fontSize: 14 * SCALE1, color: '#ff6514' }}>
                  请根据课桌上或电脑旁的“座位号”提示，认真填写；
                  如有疑问，请联系监考教师！
                </Text>
              </View>
              <View style={{ marginTop: 15 * SCALE1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TextInput
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="输入座位号"
                  style={{ textAlign: 'center', color: '#ff6514', width: 300 * SCALE1, height: 42 * SCALE1, fontSize: 15 * SCALE1, borderWidth: 1 * SCALE, borderColor: '#cdcdcd', borderRadius: 3 * SCALE2, paddingVertical: 10 * SCALE1, paddingHorizontal: 5 * SCALE2 }}
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => { this.setState({ seatInput: text.replace(/[^0-9]*/g, '') }); }}
                  value={this.state.seatInput}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <components.Button
                  text="确认"
                  onPress={() => {
                    this.setSeat();
                    this.refs.seatModal.close();
                  }}
                  containerStyle={{ width: 170 * SCALE1, height: 40 * SCALE1, marginLeft: 0, marginRight: 20 * SCALE1, paddingHorizontal: 0, marginTop: 22 * SCALE1, marginBottom: 10 * SCALE1, borderRadius: 3 * SCALE1 }}
                  textStyle={{ color: "white", fontSize: 16 * SCALE1 }}
                />
                <components.Button
                  text="取消"
                  onPress={() => {
                    this.refs.seatModal.close();
                  }}
                  type="flat"
                  containerStyle={{ width: 100 * SCALE1, height: 40 * SCALE1, borderColor: '#cfcfcf', marginTop: 22 * SCALE1, marginHorizontal: 0, marginBottom: 10 * SCALE1, paddingHorizontal: 0, borderRadius: 3 * SCALE1 }}
                  textStyle={{ color: "black", fontSize: 16 * SCALE1 }}
                />
              </View>
            </View>
          </View>
        </Modal>

        {this.state.ifShowTitle ? title : null}
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          {body}
          {shadow}
        </View>
      </KeyboardAvoidingView>

    )
  }
}
const styles = StyleSheet.create({
  circleBorder: {
    width: 136 * SCALE,
    height: 136 * SCALE,
    borderWidth: 5 * SCALE,
    borderColor: '#eaeaea',
    borderRadius: 70 * SCALE
  },
  logo: {
    width: 82 * SCALE,
    height: 81 * SCALE,
    marginRight: 25 * SCALE,
  },
  titleWrap: {
    position: 'absolute',
    width: 1280 * SCALE,
    flexDirection: 'row',
    marginTop: 151 * SCALE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22 * SCALE,
    paddingHorizontal: 14 * SCALE,
    paddingVertical: 14 * SCALE,
    borderBottomWidth: 1 * SCALE,
    borderColor: '#e1e1e1',
    color: '#333333',
    borderTopLeftRadius: 3 * SCALE1,
    borderTopRightRadius: 3 * SCALE1,
    backgroundColor: 'rgba(246, 246, 246, 0.98)'
  },
  loginWrap: {
    backgroundColor: 'white',
    borderWidth: 1 * SCALE,
    marginTop: 80 * SCALE2,
    borderColor: '#d0d0d0',
    borderRadius: 3 * SCALE1,
    marginHorizontal: 170 * SCALE2,
    width: 508 * SCALE,
    height: 286 * SCALE,
  }
})

function mapStateToProps(state) {
  const { loginType, ip, rightSideType, route, btnLoading, trainType } = state.global;
  const { SeatNo, CurrentBatchID } = state.user.userData;
  const nav = state.nav;
  const { selectedPaper, paperAnswer } = state.paper;
  return {
    userData: state.user.userData,
    route,
    loginType,
    ip,
    nav,
    rightSideType,
    SeatNo,
    paperAnswer,
    CurrentBatchID,
    btnLoading,
    trainType,
    selectedPaper
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);