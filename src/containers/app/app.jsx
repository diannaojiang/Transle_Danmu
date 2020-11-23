import {connect} from 'react-redux'
import  {setCollapsed} from '../../redux/action/action-creators'
import App from '../../views/app/app'
export default connect(
    state => ({collapsed:state.collapsed}),{setCollapsed}
  )(App)