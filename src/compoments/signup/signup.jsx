import React, { useState, useCallback } from 'react'

import { Spin, Layout, Form, Input, Button, notification } from 'antd'

import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { api } from '../../api/api'

export const SignUp = (props) => {
  const { Content } = Layout

  const [pending, setPending] = useState(false)

  const onFinish = useCallback(({ user, pass }) => {
    setPending(true)

    api.signup({
      user,
      pass
    }).then(({ status }) => {
      setPending(false)

      notification['success']({
        message: '注册成功',
        description: '正在跳转至登录页面...',
        duration: 1.5
      })

      props.history.push('/login')
    }).catch(error => {
      setPending(false)

      notification['error']({
        message: '注册失败',
        description: error.message,
        duration: 3
      })
    })
  }, [props])

  return (
    <Content
      style = {{
        padding: '1em'
      }}
    >
      <h2>注册</h2>

      <Form
        name = "normal_signup"
        onFinish = {onFinish}
      >
        <Form.Item
          name = "user"
          rules = {[{
            required: true,
            message: '请输入账号!',
          }]}
        >
          <Input
            prefix = {<UserOutlined className="site-form-item-icon" />}
            placeholder = "账号"
          />
        </Form.Item>

        <Form.Item
          name = "pass"
          rules = {[{
            required: true,
            message: '请输入密码!',
          }]}
        >
          <Input
            prefix = {<LockOutlined className="site-form-item-icon" />}
            type = "password"
            placeholder = "密码"
          />
        </Form.Item>

        <Form.Item
          name = "confirm"
          dependencies = {['pass']}
          rules={[
            {
              required: true,
              message: '请确认密码！',
            },
            ({ getFieldValue }) => ({
              async validator (_, value) {
                if (value && getFieldValue('pass') !== value) {
                  throw new Error('两次输入的密码不一致！')
                }
              },
            })
          ]}
        >
          <Input
            type = 'password'
            prefix = {<LockOutlined />}
            placeholder = '确认密码'
          />
        </Form.Item>

        <Form.Item style = {{
          display: 'inline-block'
        }}>
          <Spin spinning = {pending}>
            <Button type = "primary" htmlType = "submit">
              注册
            </Button>
          </Spin>
        </Form.Item>
      </Form>
    </Content>
  )
}
