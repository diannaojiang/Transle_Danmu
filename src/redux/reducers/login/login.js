import {ISLOGIN} from '../../action/action-types'

//定义默认数据
const login = false

//Reducer
const reducer = (state = login,action) => {
    switch(action.type){
        case ISLOGIN:
            return action.data
        default:
            return state
    }
}

export default reducer