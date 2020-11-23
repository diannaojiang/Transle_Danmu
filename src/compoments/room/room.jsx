import React,{Component} from 'react'
import { Layout,Breadcrumb, List, Avatar } from 'antd';
import Input from '../../containers/input/input'
import EasyPlayer from '../../views/easy-player/easy-player'
import './room.css'

export default class Room extends Component {
    handleUpdata(){
        this.forceUpdate()
    }
    render(){
        const {url}= this.props.room
        //console.log(url)
        if(this.props.login!==true){
            this.props.history.push('/login')
        }
        const {data} = this.props
        //console.log(data)
        const {Content} = Layout;
        return(
            
            <Content style={{ margin: '0 16px' , overflow: 'initial'}}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><h2>{this.props.room.owner}</h2></Breadcrumb.Item>
                </Breadcrumb>
                <EasyPlayer url={url}/>
                <br/>
                <Input handleUpdata={()=>this.handleUpdata()}/>
                <List
                itemLayout="horizontal"
                dataSource={data}
                className='demo-infinite-container'
                renderItem={item => (
            <List.Item>
                <List.Item.Meta
                avatar={<Avatar style ={{backgroundColor: item.avatarColor}} >{item.room}</Avatar>}
                title={<div>{item.time}</div>}
                description={item.msg}
                 />
            </List.Item>
            )}
            />
            
            </Content>
        )
    }
}