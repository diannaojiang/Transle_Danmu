import {connect} from 'react-redux'
import  {setCollapsed} from '../../redux/action/action-creators'
import SectionRight from '../../views/section-right/section-right'
export default connect(
    state => ({collapsed:state.collapsed,room:state.room}),{setCollapsed}
  )(SectionRight)