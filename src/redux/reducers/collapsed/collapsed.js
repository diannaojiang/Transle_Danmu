import {SETCOLLAPSED} from '../../action/action-types'

//定义默认数据
const collapsed = false

//Reducer
const reducer = (state = collapsed,action) => {
    switch(action.type){
        case SETCOLLAPSED:
            return action.data
        default:
            return state
    }
}

export default reducer