import * as constent from '../constent';
export function initUserData(value) {
    return {
        type: constent.INIT_USER_DATA,
        value
    }
}
export function changeSeatNo(value) {
    return {
        type: constent.CHANGE_SEATNO,
        value
    }
}