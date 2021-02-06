import {SETROOMLIST} from '../../action/action-types'

//定义默认数据
//const roomlist = [{num:'21320551',name:'oto'}]
const roomlist = []
//Reducers
const reducer = (state = roomlist,action) => {
    switch(action.type){
        case SETROOMLIST:
            return action.data
        default:
            return state
    }
}

export default reducer