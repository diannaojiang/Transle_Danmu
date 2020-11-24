import React,{Component} from 'react'
import { Layout,Breadcrumb,Typography } from 'antd';
const { Title, Paragraph, Text } = Typography;
export default class Demo extends Component {
    render(){
        const {Content} = Layout;
        if(this.props.login!==true){
            this.props.history.push('/login')
        }
        return(
            <Content style={{ margin: '0 16px' , overflow: 'initial'}}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Title>介绍</Title></Breadcrumb.Item>
                </Breadcrumb>
                <Title level={2}>用户手册</Title>
                <Paragraph>
                <Text mark>为保证良好直播环境,请勿擅自传播账号密码--Mark</Text>
                </Paragraph>
                <Paragraph>
                欢迎使用<Text strong>同传姬</Text>,点击右侧选择直播间进行同传,点击<Text strong>录入</Text>按钮可进行账号池录录入,
                以便共同工作的流畅性。
                </Paragraph>
                <Paragraph>
                <Text strong>直播间界面内</Text>,在<Text strong>输入框</Text>输入同传内容,<Text strong>不需要</Text>手动‘【】’,按下<Text strong>回车</Text>可自动发送,
                超出字数限制会进行时<Text strong>自动断句</Text>。
                </Paragraph>
                <Paragraph>
                推荐使用<Text strong>Google Chrome</Text>以便正常使用前端页面功能
                </Paragraph>
                <Title level={3}>更新日志</Title>
                <Title level={4}>同传姬 v1.0 2020/11/23</Title>
                <Paragraph>
                基本功能实现完毕。
                </Paragraph> 
                <Title level={4}>同传姬 v1.1 2020/11/24</Title>
                <Paragraph>
                添加无延迟直播画面显示。
                更新多账户区分账号池功能。
                添加同传弹幕颜色选择。
                </Paragraph>                 
            </Content>
        )
    }
}