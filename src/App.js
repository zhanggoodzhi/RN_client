import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import { YellowBox, BackHandler, ToastAndroid, AppState, Alert, StatusBar, View, Text } from 'react-native'
import { store } from './redux/store'
import Router from './router'
import { bindActionCreators } from 'redux'
import * as actions from './redux/actions'
import RNExitApp from 'react-native-exit-app';
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity
} from 'react-native-global-props';
import { SCALE } from './components/utils';
// 忽略警告
console.ignoredYellowBox = ['Remote debugger'];

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);

// 设置默认属性
setCustomText({
  style: {
    color: '#444',
    fontSize: 20 * SCALE,
    // color: '#f00',
    // fontFamily: 'MicrosoftYaHei',
    // fontFamily: 'MicrosoftYaHei',
    // fontFamily: 'MicrosoftYaHei',
  }
});
setCustomTextInput({
  autoCapitalize: 'none'
});
export default class App extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        '提示',
        '确认要退出程序吗',
        [
          {
            text: '确认', onPress: () => {
              RNExitApp.exitApp();
              return false;
            }
          },
          { text: '取消', style: 'cancel' },
        ],
        { cancelable: false }
      )
      return true;
    })
  }

  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    )
  }
}
