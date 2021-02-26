import React,{Component} from 'react'
import { Layout,Breadcrumb,Typography } from 'antd';

import { ReadMe } from './readme'

const { Title, Paragraph, Text } = Typography;
export default class Demo extends Component {
    render(){
        const {Content} = Layout;
        if(this.props.login!==true){
            this.props.history.push('/login')
        }
        return(
            <Content style={{ margin: '0 16px' , overflow: 'initial'}}>
                <ReadMe />
            </Content>
        )
    }
}