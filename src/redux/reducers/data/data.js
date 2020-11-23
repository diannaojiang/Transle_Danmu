import {SETDATA} from '../../action/action-types'

//定义默认数据
const data = [{time:'这里显示发送时间戳',msg:'这里显示发送数据',room:'提示',avatarColor:'red'}]

//Reducer
const reducer = (state = data,action) => {
    switch(action.type){
        case SETDATA:
            return action.data
        default:
            return state
    }
}

export default reducer