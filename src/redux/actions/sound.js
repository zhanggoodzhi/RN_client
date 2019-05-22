import * as constent from '../constent';
import Sound from 'react-native-sound';

// require(../xxx.mp3) 或者 http://xxx.mp3
export function changeSoundValue(value) {
    return {
        type: constent.CHANGE_SOUND_VALUE,
        value
    }
}

export function setAudio(value) {
    return {
        type: constent.SET_AUDIO,
        value
    }
}
export function audioPlaying() {
    return {
        type: constent.AUDIO_PLAYING,
    }
}
export function changeSoundDuration(audioDuration) {
    return {
        type: constent.CHANGE_SOUND_DURATION,
        audioDuration
    }
}
export function audioStop() {
    return {
        type: constent.AUDIO_STOP
    }
}

export function playAudio(value, cb, loadedCb) {
    return (dispatch, getState) => {
        const _loadedCb = (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            console.log('此时的音量',getState().sound.soundValue);
            getState().sound.whoosh.setVolume(getState().sound.soundValue);
            if (loadedCb) {
                loadedCb();
            }
            console.log('duration in seconds: ' + getState().sound.whoosh.getDuration() + 'number of channels: ' + getState().sound.whoosh.getNumberOfChannels());
            const duration = getState().sound.whoosh.getDuration();
            dispatch(audioPlaying());
            // 让滚动条比实际时间多500毫秒
            dispatch(changeSoundDuration(duration * 1000 + 500));
            getState().sound.whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                    dispatch(audioStop());
                    if (cb) {
                        cb();
                    }
                } else {
                    console.log('playback failed due to audio decoding errors');
                    // reset the player to its uninitialized state (android only)
                    // this is the only option to recover after an error occured and use the player again
                    getState().sound.whoosh.reset();
                }
            });
        }
        let whoosh = null;
        Sound.setCategory('Playback');
        console.log('音频路径', value);
        if (Object.prototype.toString.call(value) === "[object String]") {
            whoosh = new Sound(value, '', _loadedCb);
        } else {
            whoosh = new Sound(value, _loadedCb);
        }
        dispatch(setAudio(whoosh));
    }
}


