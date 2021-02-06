import { connect } from 'react-redux'
import store from '../../redux/store'
import { setRoomList } from '../../redux/action/action-creators'

import { SettingsPage as SettingsPageView } from '../../views/settings/settings'

export const SettingsPage = connect(
  state => ({
    roomList: state.roomlist
  }), {
    setRoomList: (roomList) => {
      if (typeof roomList === 'function') {
        roomList = roomList(store.getState().roomlist)
      }

      store.dispatch(setRoomList(roomList))
    }
  }
)(SettingsPageView)
