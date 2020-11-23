import {connect} from 'react-redux'
import Demo from '../../compoments/demo/demo'
export default connect(
    state => ({login:state.login}),{}
  )(Demo)