import React,{Component} from 'react'
import $ from 'jquery'

import { Form, Input, Button, notification,Typography} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { NavLink } from 'react-router-dom'

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
    render(){
      //console.log(this.props.login);
        const onFinish = (values) => {
          
            //console.log('Received values of form: ', values);
            this.setState({user:values.user})
            //console.log(values.user)
            $.ajax({
                type: "post",
                url: "https://danmu.sea-group.org/login.php",
                data: {user:values.user,pass:values.pass},//提交到demo.php的数据
                dataType: "json",//回调函数接收数据的数据格式
                success: (data)=>{
                    //console.log(data);
                    var flag = data.status===0
                    //console.log('flag:'+flag);
                    this.props.setUser(this.state.user)
                    console.log(this.props.user)
                    this.props.isLogin(flag);
                    this.openNotificationWithIcon(flag?"success":"error",flag?"登陆成功":"登陆失败",flag?"点击房间进行同传,点击录入进行账号池录入":"请重新尝试");
                    if(flag){
                      this.props.history.push('/room')
                    }
                },
                error:(msg)=>{
                    this.openNotificationWithIcon("error","连接失败","请检查网络连接或联系本人");
                  console.log(msg);
                }
              });
          };
          return (
          <>
                    <Paragraph>
                    <Text strong>同传姬采用账号池机制，每个字幕组拥有自己独立的账号池。如需申请账号或开通新直播间请联系qq3149815852。</Text>
                    </Paragraph>
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
                rules={[
                  {
                    required: true,
                    message: '请输入账号!',
                  },
                ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
              </Form.Item>
              <Form.Item
                name="pass"
                rules={[
                  {
                    required: true,
                    message: '请输入密码!',
                  },
                ]}
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