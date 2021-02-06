import {SETROOMLIST} from '../../action/action-types'

//定义默认数据
//const roomlist = [{num:'21320551',owner:'oto',color:'#ffccff',url:''}]
const roomlist = []
//Reducer
const reducer = (state = roomlist,action) => {
    switch(action.type){
        case SETROOMLIST:
            return action.data
        default:
            return state
    }
}

export default reducer