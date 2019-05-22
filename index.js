import { AppRegistry } from 'react-native';
import App from './src/App';
console.log('是否是开发环境:', __DEV__);
if (!__DEV__) {
    global.console = {
        info: () => { },
        log: () => { },
        warn: () => { },
        debug: () => { },
        error: () => { },
    };
}

AppRegistry.registerComponent('rn_android', () => App)

