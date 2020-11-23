import {connect} from 'react-redux'
import LoginForm from '../../views/login-form/login-form'
export default connect(
    state => ({user:state.user}),{}
  )(LoginForm)