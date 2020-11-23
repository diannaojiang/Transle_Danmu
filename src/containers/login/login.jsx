import {connect} from 'react-redux'
import Login from '../../compoments/login/login'
export default connect(
    state => ({login:state.login}),{}
  )(Login)