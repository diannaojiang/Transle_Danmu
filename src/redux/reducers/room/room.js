import {SETROOM} from '../../action/action-types'

//定义默认数据
const room = {}
//const room = {num:'8725120',owner:'古守',url:''}

//Reducer
const reducer = (state = room,action) => {
    switch(action.type){
        case SETROOM:
            return action.data
        default:
            return state
    }
}

export default reducer