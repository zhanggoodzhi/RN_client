import * as constent from '../constent';
export function initPaperData(value, path) {
    return {
        type: constent.INIT_PAPER_DATA,
        value,
        path
    }
}
export function changePaperData(value) {
    return {
        type: constent.CHANGE_PAPER_DATA,
        value
    }
}
export function setAreaIndex(value) {
    return {
        type: constent.SET_AREA_INDEX,
        value
    }
}
export function setQuestionIndex(value) {
    return {
        type: constent.SET_QUESTION_INDEX,
        value
    }
}
export function setContentIndex(value) {
    return {
        type: constent.SET_CONTENT_INDEX,
        value
    }
}
export function nextQuestion() {
    return {
        type: constent.NEXT_QUESTION
    }
}

export function nextArea() {
    return {
        type: constent.NEXT_AREA
    }
}


export function resetArea() {
    return {
        type: constent.RESET_AREA
    }
}
export function resetQuestion() {
    return {
        type: constent.RESET_QUESTION
    }
}

export function changePaperAnswer(value) {
    return {
        type: constent.CHANGE_PAPER_ANDWER,
        value
    }
}
export function changeListenGuide(value) {
    return {
        type: constent.CHANGE_LISTEN_GUIDE,
        value
    }
}
export function changeListenQuestion(value) {
    return {
        type: constent.CHANGE_LISTEN_QUESTION,
        value
    }
}
export function changeSection2(value) {
    return {
        type: constent.CHANGE_SECTION2,
        value
    }
}
export function changeSelectedPaper(value) {
    return {
        type: constent.CHANGE_SELECTED_PAPER,
        value
    }
}
export function resetPaperReducer() {
    return {
        type: constent.RESET_PAPER_REDUCER
    }
}



