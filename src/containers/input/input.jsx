import {connect} from 'react-redux'
import Input from '../../views/input/input'
import  {setData} from '../../redux/action/action-creators'
export default connect(
    state => ({room:state.room,data:state.data,user:state.user}),{setData}
  )(Input)