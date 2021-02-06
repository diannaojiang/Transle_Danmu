import {SETCOLLAPSED,SETROOM,SETDATA,ISLOGIN,SETUSER,SETROOMLIST} from './action-types'
//侧栏状态
export const setCollapsed = (boolean) => ({type:SETCOLLAPSED,data:boolean})

//直播间信息
export const setRoom = (json) => ({type:SETROOM,data:json})

//列表数据源
export const setData = (array) => ({type:SETDATA,data:array})

//登陆账号
export const setUser = (string) => ({type:SETUSER,data:string})

//登陆状态
export const isLogin = (boolean) => ({type:ISLOGIN,data:boolean})

//房间列表源
export const setRoomList = (array) => ({type:SETROOMLIST,data:array})