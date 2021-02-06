import {connect} from 'react-redux'
import  {setCollapsed,setRoom} from '../../redux/action/action-creators'
import SectionLeft from '../../views/section-left/section-left'
import { withRouter } from 'react-router-dom'
export default connect(
    state => ({collapsed:state.collapsed,login:state.login,user:state.user,roomlist:state.roomlist}),{setCollapsed,setRoom}
  )(withRouter(SectionLeft))