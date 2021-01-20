import React from 'react'
import { Layout } from 'antd'

export const SignUp = (props) => {
  const { Content } = Layout

  return (
    <Content
      style = {{
        padding: '1em'
      }}
    >
      <h2>注册</h2>

      <pre>
        props: {JSON.stringify(props, null, 2)}
      </pre>
    </Content>
  )
}
