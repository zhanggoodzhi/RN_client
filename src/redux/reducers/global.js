import * as constent from '../constent';
import * as utils from '../../components/utils';
import * as soundComponent from '../../components/sound';
const initialState = {
    // rightSideType: 'exam',
    // rightSideType: 'loading',
    // rightSideType:'count',
    rightSideType: 'checking',
    // trainType: 'train',
    trainType: 'checking',
    // trainType: 'totalAnswer',
    // trainType: 'uploadError',
    checkAnswerState: false,
    route: 'login',
    soundSrc: '',
    btnLoading: false,
    trainRecordState: 'free',//free,recording,scoring
    ip: utils.DEFAULT_IP,
    loginType: 'ready',
    LMDic: '',
    // loginType: 'updating' // error,ready,login,connecting,updating
}

export default (state = initialState, action) => {
    switch (action.type) {
        case constent.CHANGE_RIGHTSIDE_TYPE:
            return {
                ...state,
                rightSideType: action.value
            }
        case constent.CHANGE_LOGINTYPE:
            return {
                ...state,
                loginType: action.value
            }
        case constent.CHANGE_SOUND_SRC:
            return {
                ...state,
                soundSrc: action.value
            }
        case constent.CHANGE_CHECK_ANSWER_STATE:
            return {
                ...state,
                checkAnswerState: action.value
            }
        case constent.CHANGE_TRAIN_RECORD_STATE:
            return {
                ...state,
                trainRecordState: action.value
            }
        case constent.CHANGE_IP:
            return {
                ...state,
                ip: action.value
            }
        case constent.CHANGE_TRAINTYPE:
            console.log('改变trainType',action.value);
            return {
                ...state,
                trainType: action.value
            }
        case constent.BTN_LOADING:
            return {
                ...state,
                btnLoading: action.value
            }
        case constent.RESET_SOUND:
            soundComponent.reset();
            return {
                ...state,
                soundSrc: ''
            }
        default:
            return state;
    }
}