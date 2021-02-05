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
  },

  /**
   * Get Bilibili Account List
   * @param {{
   *  user: string
   * }} payload
   * @return {Promise<string[]>}
   */
  async getBilibiliAccountList ({ user }) {
    const { data, headers } = buildFormData({
      loc_user: user
    })

    let response = null

    try {
      response = await axios.post('/bililist.php', data, { headers })
    } catch (err) {
      console.error(err)

      throw Named('NetworkError')(new Error('网络错误'))
    }

    return response.data
  },

  /**
   * Remove a Bilibili Account
   * @param {{
   *  user: string
   *  nameToRemove: string
   * }} payload
   * @returns {Promise<true>}
   */
  async removeBilibiliAccount ({ user, nameToRemove }) {
    const { data, headers } = buildFormData({
      loc_user: user,
      del_user: nameToRemove
    })

    let response = null

    try {
      response = await axios.post('/bilidel.php', data, { headers })
    } catch (err) {
      console.error(err)

      throw Named('NetworkError')(new Error('网络错误'))
    }

    const { return: status, data: message } = JSON.parse(response.data)

    if (status === "0") {
      return true
    }

    const error = Named('RemoveError')(new Error(message))
    console.error(error)
    throw error
  },

  /**
   * Add a Bilibili Room
   * @param {{
    *  user: string
    *  room: {
    *    id: string,
    *    name: string
    *  }
    *}} payload
    * @returns {Promise<true>}
    */
  async appendBilibiliRoom ({ user, room: { id: roomID, name: roomName } }) {
    const { data, headers } = buildFormData({
      loc_user: user,
      room_id: roomID,
      room_name: roomName
    })

    let response = null

    try {
      response = await axios.post('/room_add.php', data, { headers })
    } catch (err) {
      console.error(err)

      throw Named('NetworkError')(new Error('网络错误'))
    }

    const { return: status, data: message } = JSON.parse(response.data)

    if (status === "0") {
      return true
    } else if (status === "1") {
      throw new Named('Duplicated-Room-ID')(new Error(message))
    }

    throw Named('UnkownAppendError')(new Error(message))
  },

  /**
   * Remove a Bilibili Room
   * @param {{
    *  user: string
    *  roomIDtoRemove: string
    *}} payload
    * @returns {Promise<true>}
    */
  async removeBilibiliRoom ({ user, roomIDtoRemove }) {
    const { data, headers } = buildFormData({
      loc_user: user,
      room_id: roomIDtoRemove
    })

    let response = null

    try {
      response = await axios.post('/room_del.php', data, { headers })
    } catch (err) {
      console.error(err)

      throw Named('NetworkError')(new Error('网络错误'))
    }

    const { return: status, data: message } = JSON.parse(response.data)

    if (status === "0") {
      return true
    }

    throw Named('UnkownRemoveError')(new Error(message))
  }
}
