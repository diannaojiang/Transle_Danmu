import React, { useState, useCallback, useMemo, useRef } from 'react'

import $ from 'jquery'

import { Button, Input, Table, Form, Card, Modal, notification } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import { api } from '../../api/api'
import { useAsync } from '../../common/use-async'

import { BilibiliAccountList } from '../login-form/bilibili-account-list'

import QRCode from 'qrcode.react'

const Named = (name) => (error) => {
  error.name = name
  return error
}

const useBilibiliLoginModal = () => {
  const [visible, setVisible] = useState(false)
  const [url, setURL] = useState('https://bilibili.com')
  const [text, setText] = useState('请使用 B 站 App 扫描二维码登录')

  const aborted = useRef(false)
  const [confirm, setConfirm] = useState(null)

  const login = useCallback(async ({ user, accountName, oauthKey, url }) => {
    setURL(url)
    setVisible(true)
    setConfirm(null)
    aborted.current = false

    const update = async () => {
      if (aborted.current) {
        throw Named('Aborted')(new Error('用户已取消'))
      }

      const { status, message } = await api.tryToAppendBilibiliAccount({
        user,
        accountName,
        oauthKey
      })

      console.log({
        status, message
      })

      if (status === '0') {
        setText('登录成功...')
        return true
      }

      if (status === '4') {
        setText('请使用 B 站 App 扫描二维码登录')
        await new Promise(resolve => setTimeout(resolve, 2000))
        await update()
      } else if (status === '5') {
        setText('请在 App 中确认登录')
        await new Promise(resolve => setTimeout(resolve, 2000))
        await update()
      } else if (status === '2') {
        setText('二维码已超时，请尝试重新添加')
        throw Named('Timeout')(new Error('二维码已超时'))
      } else if (status === '-3') {
        const waitingConfirm = new Promise(resolve => setConfirm({resolve}))
        setText('请在 App 扫码登录完成后点击下方确认按钮')
        await waitingConfirm
        await update()
      }
    }

    return update()
  }, [])

  const close = useCallback(() => {
    setVisible(false)
    aborted.current = true
  }, [])

  const footer = [(
    <Button key = 'cancel' onClick = {close}>
      取消
    </Button>
  )]

  if (!!confirm) {
    footer.unshift(
      <Button type = 'primary' key = 'confirm' onClick = {confirm.resolve}>
        我已在 App 上确认登录
      </Button>
    )
  }

  const ui = (
    <Modal
      title = '扫码登录'
      visible = {visible}
      footer = {footer}
      width = {512}
      style = {{
        textAlign: 'center'
      }}
      onCancel = {close}
    >
      <QRCode value = {url} size = {256}/>
      <div>{text}</div>
    </Modal>
  )

  return {
    ui,
    login,
    close
  }
}

export const AccountListSetting = ({ user }) => {
  const [forceRefreshAccountList, setForceRefreshAccountList] = useState(0)

  const { ui: bilibiliLoginModal, login, close } = useBilibiliLoginModal()

  const [requestingState, requestLogin] = useAsync(async () => {
    return api.requestBilibiliAccountLogin()
  }, [])

  const onFinish = useCallback(async ({ accountName }) => {
    try {
      const { url, oauthKey } = await requestLogin()
      await login({ user, accountName, url, oauthKey })
      setForceRefreshAccountList(prev => prev + 1)
      setTimeout(close, 500)
    } catch (error) {
      if (error.name === 'Aborted') {
        //
      } else {
        close()

        notification.error({
          message: '登录失败',
          description: error.message,
          duration: 2
        })
      }
    }
  }, [close, login, requestLogin, user])

  return (
    <Card title = '账号池管理'>
      {bilibiliLoginModal}

      <BilibiliAccountList user = {user} forceRefresh = {forceRefreshAccountList} />

      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish = {onFinish}
        layout = {'inline'}
        style = {{
          marginTop: '1em'
        }}
      >
        <Form.Item label = '录入新账号：'></Form.Item>

        <Form.Item
          name="accountName"
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
          <Button loading = {requestingState.pending} type="primary" htmlType="submit" className="login-form-button">
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
