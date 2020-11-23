import {connect} from 'react-redux'
import Room from '../../compoments/room/room'
export default connect(
    state => ({room:state.room,data:state.data,login:state.login}),{}
  )(Room)