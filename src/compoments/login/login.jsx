import React,{Component} from 'react'
import { Layout,Breadcrumb } from 'antd';

//IsLogin登陆 LoginFrom录入
import IsLogin from '../../containers/is-login/is-login'
import LoginFrom from '../../containers/login-form/login-form'
export default class Login extends Component {
    render(){
        const {Content} = Layout;
        return(
            <Content style={{ margin: '0 16px' , overflow: 'initial'}}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><h2>{this.props.login?'设置':'登陆'}</h2></Breadcrumb.Item>
                </Breadcrumb>
                {this.props.login?<LoginFrom />:<IsLogin />}                   
            </Content>
        )
    }
}