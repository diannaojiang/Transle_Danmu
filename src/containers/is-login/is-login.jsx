import {connect} from 'react-redux'
import IsLogin from '../../views/is-login/is-login'
import  {isLogin,setUser} from '../../redux/action/action-creators'
export default connect(
    state => ({login:state.login,user:state.user}),{isLogin,setUser}
  )(IsLogin)