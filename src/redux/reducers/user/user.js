import {SETUSER} from '../../action/action-types'

//定义默认数据
const user = ''

//Reducer
const reducer = (state = user,action) => {
    switch(action.type){
        case SETUSER:
            return action.data
        default:
            return state
    }
}

export default reducer