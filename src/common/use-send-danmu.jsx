// @ts-check

import { useRef, useCallback } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { api } from '../api/api'
import { notification } from 'antd'

// eslint-disable-next-line no-unused-vars
import * as N from './types/use-send-danmu'

const maxLength = 18

/** @type {(danmu: string) => string[]} */
const splitDanmu = (danmu) => {
  if (danmu.length <= maxLength) {
    return [danmu]
  } else if (/\s+/.test(danmu)) {
    const [head, rest] = danmu.split(/\s+/, 2)
    return [...splitDanmu(head), ...splitDanmu(rest)]
  } else {
    const n = Math.ceil(danmu.length / maxLength)
    const chunkSize = Math.ceil(danmu.length / n)

    const chunks = []
    for (let i = 0; i < danmu.length; i += chunkSize) {
      chunks.push(danmu.slice(i, i + chunkSize))

    }

    return chunks
  }
}

/** @type {() => N.UseSendDanmuHook} */
export const useSendDanmu = () => {
  const ref = useRef(0)

  const { roomNum, user } = useSelector((state) => ({
    roomNum: state.room.num,
    user: state.user
  }), shallowEqual)

  return {
    send: useCallback(async (danmu) => {
      for (const chunk of splitDanmu(danmu)) {
        try {
          await api.sendDanmu({
            roomNum,
            user: ref.current++,
            danmu: chunk,
            loc_user: user,
            color: 16777215,
            mode: 1
          })
        } catch (error) {
          if (error.name === 'OverheatingError') {
            notification.error({
              message: `弹幕 【${chunk}】 发送失败`,
              description: `错误：弹幕频率过高。建议录入额外的 B 站账号以利用账号池功能`
            })
          } else if (error.name === 'DanmuRepeatError') {
            //
          } else {
            notification.error({
              message: `弹幕 【${chunk}】 发送失败`,
              description: `错误：${error.message}`
            })
          }
        }
      }
    }, [roomNum, user])
  }
}
