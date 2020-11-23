import React,{Component} from 'react'
import $ from 'jquery'
import { Form, Input, Button, notification} from 'antd';
import { UserOutlined } from '@ant-design/icons';


export default class LoginForm extends Component {
    openNotificationWithIcon = (type,message,description) => {
      notification[type]({
      message,
      description,
      duration: 3,
    });
  };
    render(){
      console.log(this.props.login);
      //ajax
        const onFinish = (values) => {
            var oauthKey =  (key)=>{
                console.log(key); 
                //window.alert('开始登录');
                var name=values.account;
                  $.ajax({
                    type: "post",
                    url: "https://danmu.sea-group.org/bililogin.php",
                    data: {request:"oauth",key:key,name:name,loc_user:this.props.user},//提交到demo.php的数据
                    dataType: "json",//回调函数接收数据的数据格式
                    success: (msg)=>{
                      var data='';
                      if(msg!==''){
                        data = eval("("+msg+")");    //将返回的json数据进行解析，并赋给data
                      } 
                      window.alert("错误码：" + data.return + "\n状态：" + data.data);
          
                      if (data.return==='4'||data.return==='5'||data.return==='-3') {
                        //window.alert('msg');
                        oauthKey(key);
                      }
                      console.log(data);    //控制台输出
                    },
                    error:(msg)=>{
                      console.log(msg);
                    }
                  });
              }
            $.ajax({
                type: "post",
                url:  "https://danmu.sea-group.org/bililogin.php",
                data: {request:"new"},//提交到demo.php的数据
                dataType: "json",//回调函数接收数据的数据格式
                success: (msg)=>{
                  var data='';
                  if(msg!==''){
                    data = eval("("+msg+")");
                   console.log(data,msg)    //将返回的json数据进行解析，并赋给data
                  } 
                  window.open("https://cli.im/api/qrcode/code?text="+data.data.url+"&mhid=4ErBBQHuy88hMHYvI9JWPK8");    
                  oauthKey(data.data.oauthKey)  
                  //console.log(data);    //控制台输出
                },
                error:function(msg){
                  console.log(msg);
                }
              });
              
        };

          
          return (
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="account"
                rules={[
                  {
                    required: true,
                    message: '请输入账号!',
                  },
                ]}
              >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                上传
                </Button>

              </Form.Item>
              
            </Form>
            
          );
    }
}