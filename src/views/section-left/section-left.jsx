import React,{Component} from 'react'
import {NavLink} from 'react-router-dom'
import {
    HomeOutlined,
    GithubOutlined,
    YoutubeOutlined
  } from '@ant-design/icons';
import $ from 'jquery'
import {Layout,Menu, Avatar, Button} from 'antd';

export default class SectionLeft extends Component {
    state={
        roomlist:[]
    }
    //绑定props与state
    static getDerivedStateFromProps (props, state) {
        if (props.roomlist !== state.roomlist) {
            return {
                roomlist: props.roomlist
            }
        }
        return null
    }
    onCollapse = () => {
        const collapsed = !this.props.collapsed;
        this.props.setCollapsed(collapsed);
    };

    handleClick(room,user){
        //console.log(room)
         
        if(this.props.login){
           
            $.ajax({
                type: "post",
                url: "https://danmu.sea-group.org/bililive.php",
                data: {room_id:room.num,loc_user:user},//提交到demo.php的数据
                dataType: "json",//回调函数接收数据的数据格式
                success: (msg)=>{
                    var data='';
                    if(msg!==''){
                        data = eval("("+msg+")");    //将返回的json数据进行解析，并赋给data
                    } 
                console.log(data);    //控制台输出
                room.url=data.url
                this.props.setRoom(room)
                //console.log(room)
                this.props.history.push('/room')
                //console.log(data.url);
              },
              error:function(msg){
                console.log(msg);
              }
            });
        }
        
       //this.props.setRoom(room)
       //this.props.history.push('/room')
    }

    render(){
        const { Sider } = Layout;
        const { SubMenu } = Menu;
        const {collapsed,user} = this.props;
        const {roomlist} = this.state;
        const MenuItems = roomlist.map((room,index)=>
            <Menu.Item key={index} icon={<YoutubeOutlined />} onClick={()=>this.handleClick(room,user)}>
                {room.name}
            </Menu.Item>)
        return(
            <Sider style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
            }} collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                <div className="logo" />
                
                <Avatar size={50} style={{marginTop:5,marginBottom:5,marginLeft:12,marginRight:12}} src='./komori.jpg' />
                <NavLink to={'/login'}><Button type="dashed" style={{marginLeft:6,marginRight:6}} ghost>{this.props.login?'录入':'登录'}</Button></NavLink>
                <Menu theme="dark" mode="inline">
                <Menu.Item key="1" icon={<GithubOutlined />}>
                    <NavLink to={'/index'}>同传姬介绍</NavLink>               
                </Menu.Item>
                <SubMenu key="sub1" icon={<HomeOutlined />} title="直播间列表">
                {MenuItems}
                </SubMenu>
                </Menu>
            </Sider>
        )
    }
}