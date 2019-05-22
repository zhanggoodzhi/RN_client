import {
    NavigationActions
} from 'react-navigation';
export function navJump(value) {
    return NavigationActions.navigate(value);
}
export function navBack(value) {
    return NavigationActions.back(value);
}
export function navReset() {
    return NavigationActions.reset();
}
export function navPopToTop() {
    return NavigationActions.popToTop();
}
