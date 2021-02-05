import React, { useState, useCallback, useMemo } from 'react'

import $ from 'jquery'

import { Button, Input, Table, Form, Card } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import { api } from '../../api/api'
import { useAsync } from '../../common/use-async'

import { BilibiliAccountList } from '../login-form/bilibili-account-list'

export const AccountListSetting = ({ user }) => {
  const [forceRefreshAccountList, setForceRefreshAccountList] = useState(0)

  const onFinish = (values) => {
    var oauthKey = (key) => {
      console.log(key)
      var name = values.account
      $.ajax({
        type: "post",
        url: "https://danmu.sea-group.org/bililogin.php",
        data: {
          request: "oauth",
          key: key,
          name: name,
          loc_user: user
        }, // 提交到demo.php的数据
        dataType: "json", // 回调函数接收数据的数据格式
        success: (msg) => {
          var data = ''
          if (msg !== '') {
            data = eval("(" + msg + ")") // 将返回的 json 数据进行解析，并赋给 data
          }
          window.alert("错误码：" + data.return + "\n状态：" + data.data)

          if (data.return === '4' || data.return === '5' || data.return === '-3') {
            //window.alert('msg')
            oauthKey(key)
          }

          setForceRefreshAccountList(prev => prev + 1)

          console.log(data)    //控制台输出
        },

        error: (msg) => {
          console.log(msg)
        }
      })
    }

    $.ajax({
      type: "post",
      url: "https://danmu.sea-group.org/bililogin.php",
      data: {
        request: "new"
      }, // 提交到demo.php的数据
      dataType: "json", // 回调函数接收数据的数据格式
      success: (msg) => {
        var data = ''
        if(msg !== '') {
          data = eval("(" + msg + ")")
          console.log(data, msg)    //将返回的json数据进行解析，并赋给data
        }
        window.open("https://cli.im/api/qrcode/code?text=" + data.data.url + "&mhid=4ErBBQHuy88hMHYvI9JWPK8")
        oauthKey(data.data.oauthKey)
        // console.log(data) // 控制台输出
      },

      error:function(msg){
        console.log(msg)
      }
    })
  }

  return (
    <Card title = '账号池管理'>
      <BilibiliAccountList user = {user} forceRefresh = {forceRefreshAccountList} />

      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        layout = {'inline'}
        style = {{
          marginTop: '1em'
        }}
      >
        <Form.Item label = '录入新账号：'></Form.Item>

        <Form.Item
          name="account"
          rules={[
            {
              required: true,
              message: '请输入账号!',
            },
          ]}
          style = {{
            flex: 1
          }}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            上传
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export const RoomListSetting = ({ user }) => {
  const [roomList, setRoomList] = useState([])

  const [removingState, removeBilibiliRoom] = useAsync(async (roomIDtoRemove) => {
    return api.removeBilibiliRoom({
      user,
      roomIDtoRemove
    }).then(result => {
      setRoomList(prevRoomList => prevRoomList.filter(it => it.id !== roomIDtoRemove))
      return result
    })
  }, [user])

  const [appendingState, appendBilibiliRoom] = useAsync(async (room) => {
    return api.appendBilibiliRoom({
      user,
      room
    }).then(result => {
      setRoomList(prevRoomList => [...prevRoomList, room])
      return result
    })
  }, [user])

  const columns = useMemo(() => {
    return [{
      title: '名称',
      dataIndex: 'name'
    }, {
      title: '直播间号',
      dataIndex: 'id'
    }, {
      title: '操作',
      width: '6em',
      align: 'center',
      render: ({ id }) => (
        <Button danger onClick = {() => {
          removeBilibiliRoom(id)
        }}>
          移除
        </Button>
      )
    }]
  }, [removeBilibiliRoom])

  const dataSource = useMemo(() => {
    return roomList.map(room => ({
      ...room,
      key: room.id
    }))
  }, [roomList])

  const onFinish = useCallback(({ name, id }) => {
    appendBilibiliRoom({
      name,
      id
    })
  }, [appendBilibiliRoom])

  return (
    <Card title = '直播间管理'
      style = {{
        marginTop: '2em'
      }}
    >
      <Table
        loading = {removingState.pending || appendingState.pending}
        dataSource = {dataSource}
        columns = {columns}
        pagination = {false}
      />

      <Form
        onFinish = {onFinish}
        layout = {'inline'}
        style = {{
          marginTop: '1em'
        }}
      >
        <Form.Item label = '添加新房间：'></Form.Item>

        <Form.Item
          name = "name"
          rules = {[
            {
              required: true,
              message: '请输入昵称',
            },
          ]}
          style = {{
            flex: 1
          }}
        >
          <Input placeholder = '昵称' />
        </Form.Item>

        <Form.Item
          name = "id"
          rules = {[
            {
              required: true,
              message: '请输入直播间号',
            },
            () => ({
              async validator (_, id) {
                if (id && roomList.some((it) => it.id === id)) {
                  throw new Error('该直播间已存在')
                }
              },
            })
          ]}
          style = {{
            flex: 1
          }}
        >
          <Input placeholder = '直播间号' />
        </Form.Item>

        <Form.Item>
          <Button type = "primary" htmlType = "submit">
            添加
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export const SettingsPage = ({ user }) => {
  return (
    <>
      <AccountListSetting user = {user} />
      <RoomListSetting user = {user} />
    </>
  )
}
