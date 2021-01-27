import axios from 'axios'

import apiSpec from './api.json'

axios.defaults.baseURL = apiSpec.servers[0].url

const Named = (name) => (error) => {
  error.name = name
  return error
}

const buildFormData = (json) => {
  const data = new FormData()

  for (const key of Object.keys(json)) {
    data.append(key, json[key])
  }

  return {
    data,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`
    }
  }
}

export const api = {
  /**
   * Sign Up
   * @param {{
    *  email: string
    *  user: string
    *  pass: string
    * }} payload
    */
  async login ({ user, pass }) {
    const { data, headers } = buildFormData({
      user,
      pass
    })

    try {
      const response = await axios.post('/login.php', data, {
        headers
      })

      console.log(response)

      const { status } = response.data

      if (status === 0) {
        return
      }
    } catch (err) {
      console.error(err)

      throw Named('NetworkError')(new Error('网络错误'))
    }

    throw Named('ServerReject')(new Error('登录失败'))
  },

  /**
   * Sign Up
   * @param {{
   *  email: string
   *  user: string
   *  pass: string
   * }} payload
   */
  async signup ({ email, user, pass }) {
    const { data, headers } = buildFormData({
      email,
      user,
      pass
    })

    try {
      const response = await axios.post('/logon.php', data, {
        headers
      })

      const { status } = response.data

      if (status === 0) {
        return
      }
    } catch (err) {
      console.error(err)

      throw Named('NetworkError')(new Error('网络错误'))
    }

    throw Named('ServerReject')(new Error('注册失败'))
  }
}
