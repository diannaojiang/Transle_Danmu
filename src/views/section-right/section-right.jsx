import React,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import { Layout } from 'antd';

import Room from '../../containers/room/room'
import Login from '../../containers/login/login'
import Demo from '../../containers/demo/demo'
import { SignUp } from '../../compoments/signup/signup';

export default class SectionRight extends Component {


    render(){
        const { Header, Footer} = Layout;
        const {collapsed} = this.props;
        return(
            <Layout className="site-layout" style={{ marginLeft:  collapsed?75:200 }}>
                <Header className="site-layout-background" style={{ padding: 0 }} />
                <Switch>
                        <Route path='/login' component={Login}/>
                        <Route path='/room' component={Room}/>
                        <Route path='/index' component={Demo}/>
                        <Route path='/signup' component={SignUp}/>
                        <Redirect to='/index' />
                </Switch>
                <Footer style={{ textAlign: 'center' }}>同传姬 ©2021 同传姬开发组</Footer>
            </Layout>
        )
    }
}