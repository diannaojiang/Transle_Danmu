import {connect} from 'react-redux'
import InputMsg from '../../views/input/input'
import  {setData} from '../../redux/action/action-creators'
export default connect(
    state => ({room:state.room,data:state.data,user:state.user}),{setData}
  )(InputMsg)