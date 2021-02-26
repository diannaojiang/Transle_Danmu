// @ts-check

import { useState, useCallback, useEffect, useRef } from 'react'
import { useSendDanmu } from '../../common/use-send-danmu'
import { createController } from './controller'

// eslint-disable-next-line no-unused-vars
import * as N from './types/use-lyric-sender'

/**
 * @typedef {import('./types/controller').Controller} Controller
 */

/**
 * @template T
 * @typedef {import('react').MutableRefObject<T>} MutableRefObject
 */

/** @type {Controller['state']} */
const initialState = 'paused'

/** @type {(props: N.UseLyricsSenderProps) => N.UseLyricsSenderHook} */
export const useLyricsSender = ({
  lyric
}) => {
  const [state, setState] = useState(initialState)
  const [index, setIndex] = useState(0)

  /** @type MutableRefObject<Controller> */
  const controller = useRef()

  const { send } = useSendDanmu()

  /** @type MutableRefObject<N.Lyric> */
  const lyricRef = useRef(lyric)
  useEffect(() => {
    lyricRef.current = lyric
  }, [lyric])

  useEffect(() => {
    controller.current = createController()

    controller.current.subscribe('@state', ({ state }) => {
      setState(state)
    })

    controller.current.subscribe('@seek', ({ index }) => {
      setIndex(index)
    })

    controller.current.subscribe('@trigger', async ({ index }) => {
      const { text, disabled } = lyricRef.current.body[index]

      if (!disabled) {
        await send(text)
      }
    })

    return () => {
      controller.current.off()
    }
  }, [send])

  useEffect(() => {
    controller.current.reset(lyric.timeAxis)
  }, [lyric.timeAxis])

  /** @type {N.UseLyricsSenderHook} */
  const self = {
    state,
    index,

    stop: useCallback(() => {
      controller.current.stop()
    }, []),

    play: useCallback(() => {
      controller.current.play()
    }, []),

    pause: useCallback(() => {
      controller.current.pause()
    }, []),

    seek: useCallback((index) => {
      controller.current.seek(index)
    }, [])
  }

  const { stop } = self

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return self
}
/** 
 * "{error:\"\u8d85\u51fa\u9650\u5236\u957f\u5ea6\",room:\"921874\",user:\"niamori\",danmu:\"\u5f37\u304f\u306a\u308c\u308b\u7406\u7531\u3092\u77e5\u3063\u305f\u3000\u50d5\u3092\u9023\u308c\u3066\u9032\u3081\"}"
 */