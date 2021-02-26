import React,{Component} from 'react'
import $ from 'jquery'

import { Form, Input, Button, notification,Typography} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { NavLink } from 'react-router-dom'

import { api } from '../../api/api'
import { formRules } from '../../common/form-rules'

const { Title, Paragraph, Text } = Typography;

export default class IsLogin extends Component {
  state={
    user:''
  }
    openNotificationWithIcon = (type,message,description) => {
      notification[type]({
      message,
      description,
      duration: 3,
    });
  };

  render () {
    const onFinish = (values) => {
      this.setState({
        user: values.user
      })

      api.login({
        user: values.user,
        pass: values.pass
      }).then(() => {
        this.props.setUser(this.state.user)
        this.props.isLogin(true)
        this.openNotificationWithIcon("success", "登录成功", "点击房间进行同传,点击录入进行账号池录入")

        api.getRoomlist({
          user: values.user,
        }).then((roomlist)=>{
          let list=[]
          for(var room in roomlist){
            list.push({num:room,name:roomlist[room]})
          }
          this.props.setRoomList(list)
          this.props.history.push('/room')
        }).catch((error) => {
          if (error.name === 'NetworkError') {
            this.openNotificationWithIcon("error", "连接失败", "请检查网络连接或联系本人")
          }    
        })

      }).catch((error) => {
        if (error.name === 'NetworkError') {
          this.openNotificationWithIcon("error", "连接失败", "请检查网络连接或联系本人")
        } else if (error.name === 'ServerReject') {
          this.props.setUser(this.state.user)
          console.log(this.props.user)
          this.props.isLogin(false)
          this.openNotificationWithIcon("error", "登录失败", "请重新尝试")
        }
      })
    }

          return (
          <>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="user"
                rules = {formRules['user']}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
              </Form.Item>
              <Form.Item
                name="pass"
                rules = {formRules['pass']}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码"
                />
              </Form.Item>
        
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                登录
                </Button>

                <NavLink to = "/signup">
                  <Button type = "text" color = "primary">
                    没有账号？注册一个！
                  </Button>
                </NavLink>
              </Form.Item>
              
            </Form>
          </>
          );
    }
}