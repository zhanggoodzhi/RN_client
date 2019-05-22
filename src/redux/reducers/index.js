import { combineReducers } from 'redux'
import global from './global'
import paper from './paper'
import user from './user'
import sound from './sound'
import nav from './nav'
export default combineReducers({
    paper,
    user,
    sound,
    global,
    nav
})