export const formRules = {
  'user': [{
    required: true,
    message: '请输入账号!',
  }, {
    max: 128,
    message: '账号长度超出限制！'
  }],

  'pass': [{
    required: true,
    message: '请输入密码!',
  }, {
    max: 128,
    message: '密码长度超出限制！'
  }],

  'email': [{
    require: true,
    message: '请输入邮箱！'
  }, {
    type: "email",
    message: '邮箱格式不合法！'
  }, {
    max: 128,
    message: '邮箱长度超出限制！'
  }],

  'confirm-pass': [{
    require: true,
    message: '请再输入一遍密码！'
  }, ({ getFieldValue }) => ({
    async validator (_, value) {
      if (value && getFieldValue('pass') !== value) {
        throw new Error('两次输入的密码不一致！')
      }
    },
  })]
}
