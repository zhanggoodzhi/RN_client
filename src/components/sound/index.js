import Sound from 'react-native-sound';
let soundValue = 1;
let whoosh = new Sound('test.wav');
console.log('引入了sound.js');
export function playAudio(value, cb, loadedCb) {
    const _loadedCb = (error, sound) => {
        console.log('进入 :');
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        // loaded successfully
        console.log('此时的音量', soundValue);
        whoosh.setVolume(soundValue);
        console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
        const duration = whoosh.getDuration();
        if (loadedCb) {
            loadedCb(duration);
        }
        // 让滚动条比实际时间多500毫秒
        whoosh.play((success) => {
            whoosh.release();
            if (success) {
                console.log('successfully finished playing');
                if (cb) {
                    cb();
                }
            } else {
                console.log('playback failed due to audio decoding errors');
                // reset the player to its uninitialized state (android only)
                // this is the only option to recover after an error occured and use the player again
                whoosh.reset();
            }
        });
    }
    Sound.setCategory('Playback');
    console.log('音频路径', value);
    if (whoosh) {
        whoosh.reset();
    }
    if (Object.prototype.toString.call(value) === "[object String]") {
        whoosh = new Sound(value, '', _loadedCb);
    } else {
        whoosh = new Sound(value, _loadedCb);
    }
}

export function reset() {
    if (whoosh) {
        whoosh.reset();
    }
}
export function changeSoundValue(value) {
    soundValue = value;
    whoosh && whoosh.setSystemVolume(value);
}
export function getSystemVolume(cb) {
    whoosh.getSystemVolume((a, volume) => {
        cb(volume);
    });
}


