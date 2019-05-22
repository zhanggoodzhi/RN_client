import { NativeModules } from 'react-native';

const Channel = NativeModules.Channel;
export const config = {
    // channel: null,
    channel: 'chivox',
    version: null
    
};

Channel.getChannal((c) => {
    console.log('获取logo',c);
    config.channel = c;
});
Channel.getVersionCode((n) => {
    console.log('获取版本',n);
    config.version = n;
});
