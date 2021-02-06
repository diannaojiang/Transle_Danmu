import {combineReducers} from 'redux'
import collapsed from './collapsed/collapsed'
import room from './room/room'
import data from './data/data'
import login from './login/login'
import user from './user/user'
import roomlist from './roomlist/roomlist'
const reducers = combineReducers({
    collapsed,
    room,
    data,
    login,
    user,
    roomlist
})

export default reducers
