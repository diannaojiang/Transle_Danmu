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

  /** Request Bilibili Account Login
   * @returns {Promise<{
   *   url: string
   *   oauthKey: string
   * }>}
  */
  async requestBilibiliAccountLogin () {
    const { data, headers } = buildFormData({
      request: 'new'
    })

    let response = null

    try {
      response = await axios.post('/bililogin.php', data, { headers })
    } catch (err) {
      console.error(err)

      throw Named('NetworkError')(new Error('网络错误'))
    }

    const responseData = JSON.parse(response.data)

    const { code } = responseData

    if (code === 0) {
      const { data: { url, oauthKey } } = responseData

      return {
        url,
        oauthKey
      }
    }

    throw Named('UnkownRequestError')(new Error('未知错误'))
  },

  /** Try to Append Bilibili Account
   *  @param {{
   *    user: string
   *    accountName: string
   *    oauthKey: string
   *  }} payload
   *
   *  @returns {Promise<{
   *    status: string,
   *    message: string
   *  }>}
   */
  async tryToAppendBilibiliAccount ({ user, accountName, oauthKey }) {
    const { data, headers } = buildFormData({
      request: 'oauth',
      loc_user: user,
      name: accountName,
      key: oauthKey
    })

    let response = null

    try {
      response = await axios.post('/bililogin.php', data, { headers })
    } catch (err) {
      console.error(err)

      throw Named('NetworkError')(new Error('网络错误'))
    }

    const responseData = JSON.parse(response.data)

    console.log(JSON.stringify(responseData, null, 2))

    const { return: status, data: message } = responseData

    return {
      status,
      message
    }
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
  },
  /**
  * Get Roomlist
  * @param {{
  *  user: string
  * }} payload
  */
 async getRoomlist ({ user }) {
   const { data, headers } = buildFormData({
    loc_user: user,
   })

   try {
     const response = await axios.post('/room_list.php', data, {
       headers
     })
     const roomlist = response.data
     return(roomlist)

   } catch (err) {
     console.error(err)

     throw Named('NetworkError')(new Error('网络错误'))
   }
 },

 /**
  * Search Song
  * @param {{
  *   searchKey: string,
  * }} payload
  */
 async searchSong ({ searchKey }) {
   let response = null

   try {
     response = await axios.get('/api/search/get/web', {
       params: {
         s: searchKey,
         type: 1,
         limit: 20
       }
     })
   } catch (err) {
     throw Named('NetworkError')(new Error('网络错误'))
   }

   const { code, result } = response.data
   if (code === 200) {
     return result
   }

   throw Named('UnkownSearchError')(new Error(`未知搜索错误 #${code}`))
 },

 /**
  * Get Lyrics of Song
  * @param {{
  *   songID: string
  * }} payload
  * @returns {Promise<string[]>}
  */
 async getLyrics ({ songID }) {
   let response = null

   try {
     response = await axios.get('/api/song/lyric', {
       params: {
         id: songID,
         lv: -1,
         kv: -1,
         tv: -1
       }
     })
   } catch (err) {
     throw Named('NetworkError')(new Error('网络错误'))
   }

   const { lrc, tlyric } = response.data
   return [lrc, tlyric].filter(it => !!it && it.lyric.length !== 0).map(it => it.lyric)
 },

 /**
  * Send Danmu
  * @param {{
  *   roomNum: string,
  *   user: number,
  *   danmu: string,
  *   loc_user: string,
  *   color: number,
  *   mode: number
  * }} payload
  * @returns {Promise<true>}
  */
 async sendDanmu ({ roomNum, user, danmu, loc_user, color, mode }) {
   const { data, headers } = buildFormData({
     room: roomNum,
     user,
     danmu,
     loc_user,
     color,
     mode
   })

   let response = null

   try {
     response = await axios.post('/danmu.php', data, { headers })
   } catch (err) {
     throw Named('NetworkError')(new Error('网络错误'))
   }

   const { error } = eval('(' + response.data + ')')

   if (error && error.length) {
     if (error.includes('msg in 1s')) {
       throw Named('OverheatingError')(new Error(error))
     } else if (error.includes('msg repeat')) {
       throw Named('DanmuRepeatError')(new Error(error))
     } else {
       throw Named('UnkownSendError')(new Error(error))
     }
   }

   return true
  }
}
