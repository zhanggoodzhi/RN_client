import Orientation from 'react-native-orientation';
// 切换横屏的回调
export default orientation = () => {
    return new Promise((resolve) => {
        // const orientationDidChange = (orientation) => {
        //     if (orientation === 'LANDSCAPE') {
        //         BackgroundTimer.setTimeout(() => {

        //             resolve();
        //         }, 1000)
        //         // do something with landscape layout
        //     } else {

        //         // do something with portrait layout
        //     }
        // }
        // Orientation.addOrientationListener(orientationDidChange);
        // Orientation.lockToPortrait();
        // Orientation.lockToLandscape();
        Orientation.lockToLandscapeLeft();
    });
}

