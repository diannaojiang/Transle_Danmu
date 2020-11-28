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
                    <Paragraph>
                    为方便广大VTB同传man,特此开发同传姬,简化同传流程及提高同传man的体验。<br />
                    同传姬采用账号池机制,弹幕通过服务器发包,借助账号池内的账号轮流发送来避免<br />
                    B站的弹幕间隔限制和隐性延迟。
                    同时弹幕姬可以自动添加中括号和截断长语句,能对大段话语自动分割发送,<br />
                    帮助同传man减免繁杂的重复工作。
                    另外为保证超低的同传延迟,同传姬特别研发了B站直播姬超低延迟播放系统,<br />
                    对直播流自动追帧,能够在不同环境下减免直播延迟2-14s。
                    <Text strong>(网络环境复杂的情况下由于卡顿,会频繁追帧,导致播放卡顿甚至无法正常使用)</Text>
                    </Paragraph>
                    <Paragraph>
                    <Text strong>开发中功能</Text>
                    </Paragraph>
                    <Paragraph>
                    歌曲歌词搜索并自动按时间戳发送
                    </Paragraph>
                </Breadcrumb>
                <Title level={2}>用户手册</Title>
                <Paragraph>
                <Text mark>为保证良好直播环境,请勿擅自传播账号密码--Mark</Text>
                </Paragraph>
                <Paragraph>
                欢迎使用<Text strong>同传姬</Text>,点击<Text strong>录入</Text>按钮,填入自己的昵称并确认后根据提示信息操作，可进行账号池录录入,以便共同工作的流畅性。点击右侧选择直播间可进行同传。
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
                添加无延迟直播画面显示。<br />
                更新多账户区分账号池功能。<br />
                添加同传弹幕颜色选择。
                </Paragraph>                 
            </Content>
        )
    }
}