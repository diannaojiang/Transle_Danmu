import React,{Component} from 'react'
import { notification } from 'antd';

import { SettingsPage } from '../settings/settings'

export default class LoginForm extends Component {
    openNotificationWithIcon = (type,message,description) => {
      notification[type]({
      message,
      description,
      duration: 3,
    });
  };

  render () {
    return (
      <SettingsPage user = {this.props.user} />
    )
  }
}
