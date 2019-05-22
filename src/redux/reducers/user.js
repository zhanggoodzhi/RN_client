import * as constent from '../constent';
const initialState = {
    userData: {
        Name: '',
        No: '',
        SeatNo: '',
        headPic: '',
        className: '',
        taskType: '',
        CurrentBatchID: '',
        MarkAppKey: '',
        MarkSecret: '',
        MarkProvision: ''
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case constent.INIT_USER_DATA:
            let { value } = action;
            return {
                ...state,
                userData: value
            }
        case constent.CHANGE_SEATNO:
            const newData = state.userData;
            newData.SeatNo = action.value;
            return {
                ...state,
                userData: newData
            }
        default:
            return state;
    }
}

