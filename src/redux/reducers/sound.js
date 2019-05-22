import * as constent from '../constent';
const initialState = {
    soundValue: 1,
    whoosh: null,
    ifPlaying: false,
    soundDuration: 9999999999
}

export default (state = initialState, action) => {
    switch (action.type) {
        case constent.CHANGE_SOUND_VALUE:
            if (state.whoosh) {
                state.whoosh.setVolume(action.value);
            }
            return {
                ...state,
                soundValue: action.value
            }
        case constent.SET_AUDIO:
            return {
                ...state,
                whoosh: action.value
            }
        case constent.AUDIO_PLAYING:
            return {
                ...state,
                ifPlaying: true,
            }
        case constent.CHANGE_SOUND_DURATION:
            return {
                ...state,
                soundDuration: action.audioDuration
            }
        case constent.AUDIO_STOP:
            return {
                ...state,
                ifPlaying: false
            }
        default:
            return state;
    }
}

