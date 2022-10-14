import React,{Component} from 'react'
import AdSense from 'react-adsense';
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
                <Header className="site-layout-background" style={{ padding: 0 }} >
                </Header>
                <Switch>
                        <Route path='/login' component={Login}/>
                        <Route path='/room' component={Room}/>
                        <Route path='/index' component={Demo}/>
                        <Route path='/signup' component={SignUp}/>
                        <Redirect to='/index' />
                </Switch>
                <Footer style={{ textAlign: 'center' }}>
                    <AdSense.Google
                      client='ca-pub-9800395340265192'
                      slot='9664902413'
                      style={{ display: 'block' }}
                      layout='in-article'
                      format='fluid'
                    />
                由于B站近期修改了播放url的referer限制，使得同传姬的播放器无法连接到播放地址，如有任何人能够提供帮助请联系我：qq3149815852<br/>
                使用中遇到问题请直接向我反馈：qq3149815852<br/>
                同传姬 © 2020-2021 同传姬项目开发组
                </Footer>
            </Layout>
        )
    }
}