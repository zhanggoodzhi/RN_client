import * as constent from '../constent';

export function changeRightSideType(value) {
    return {
        type: constent.CHANGE_RIGHTSIDE_TYPE,
        value
    }
}
export function changeCheckAnswerState(value) {
    return {
        type: constent.CHANGE_CHECK_ANSWER_STATE,
        value
    }
}
export function changeSoundSrc(value) {
    return {
        type: constent.CHANGE_SOUND_SRC,
        value
    }
}
export function changeTrainRecordState(value) {
    return {
        type: constent.CHANGE_TRAIN_RECORD_STATE,
        value
    }
}
export function changeLoginType(value) {
    return {
        type: constent.CHANGE_LOGINTYPE,
        value
    }
}
export function changeIp(value) {
    return {
        type: constent.CHANGE_IP,
        value
    }
}
export function navigate(value) {
    return {
        type: constent.NAVIGATE,
        value
    }
}
export function changeTrainType(value) {
    return {
        type: constent.CHANGE_TRAINTYPE,
        value
    }
}
export function changeBtnLoading(value) {
    return {
        type: constent.BTN_LOADING,
        value
    }
}
export function resetSound() {
    return {
        type: constent.RESET_SOUND
    }
}