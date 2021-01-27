import React, { useState, useCallback } from 'react'

import { Spin, Layout, Form, Input, Button, notification } from 'antd'

import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'

import { api } from '../../api/api'

import { formRules } from '../../common/form-rules'

export const SignUp = (props) => {
  const { Content } = Layout

  const [pending, setPending] = useState(false)

  const onFinish = useCallback(({ email, user, pass }) => {
    setPending(true)

    api.signup({
      email,
      user,
      pass
    }).then(() => {
      setPending(false)

      notification['success']({
        message: '注册成功',
        description: '正在跳转至登录页面...',
        duration: 1.5
      })

      props.history.push('/login')
    }).catch(error => {
      setPending(false)

      if (error.name === 'NetworkError') {
        notification['error']({
          message: '连接失败',
          description: '请检查网络连接或联系本人',
          duration: 3
        })
      } else if (error.name === 'ServerReject') {
        notification['error']({
          message: '注册失败',
          description: '请检查用户名与邮箱',
          duration: 3
        })
      }
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
          name = 'email'
          rules = {formRules['email']}
        >
          <Input
            prefix = {<MailOutlined className = 'site-form-item-icon' />}
            placeholder = '邮箱'
          />
        </Form.Item>

        <Form.Item
          name = 'user'
          rules = {formRules['user']}
        >
          <Input
            prefix = {<UserOutlined className="site-form-item-icon" />}
            placeholder = "账号"
          />
        </Form.Item>

        <Form.Item
          name = "pass"
          rules = {formRules['pass']}
        >
          <Input
            prefix = {<LockOutlined className="site-form-item-icon" />}
            type = "password"
            placeholder = "密码"
          />
        </Form.Item>

        <Form.Item
          name = "confirm-pass"
          dependencies = {['pass']}
          rules = {formRules['confirm-pass']}
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
