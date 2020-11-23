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
        rooms:[
            {num:'21320551',owner:'oto',color:'#ffccff',url:''},
            {num:'8725120',owner:'古守',color:'#ff6666',url:''},
            {num:'21396545',owner:'团长',color:'#99ffcc',url:''},
            {num:'21685677',owner:'0g0',color:'#ffffff',url:''},
            {num:'6542258',owner:'小伞',color:'#ff9999',url:''},
            {num:'21573665',owner:'紫桃',color:'#cc99ff',url:''},
            {num:'4895312',owner:'帕里',color:'#54eed8',url:''},
            {num:'14327465',owner:'猫猫',color:'#ffcccc',url:''},
            {num:'22347054',owner:'nano',color:'#e33fff',url:''},
            {num:'3822389',owner:'mana',color:'#ffffff',url:''},
            {num:'14052636',owner:'大姐',color:'#ff99cc',url:''},
            {num:'22571958',owner:'373',color:'#cccccc',url:''},
        ]
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
        const {rooms} = this.state;
        const MenuItems = rooms.map((room,index)=>
            <Menu.Item key={index} icon={<YoutubeOutlined />} onClick={()=>this.handleClick(room,user)}>
                {room.owner}
            </Menu.Item>)
        return(
            <Sider style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
            }} collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                <div className="logo" />
                
                <Avatar size={50} style={{marginTop:5,marginBottom:5,marginLeft:12,marginRight:12}} src='./komori.jpg' />
                <NavLink to={'/login'}><Button type="dashed" style={{marginLeft:6,marginRight:6}} ghost>{this.props.login?'录入':'登陆'}</Button></NavLink>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
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