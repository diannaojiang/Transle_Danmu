// @ts-check

import React, { Fragment, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Button, List, Radio } from 'antd'
import { CloseOutlined, RedoOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { useLyricsSender } from './use-lyric-sender'
import { formatTimeStamp } from './lyric-common'

// eslint-disable-next-line no-unused-vars
import * as N from './types/sending-lyric'
import { useLatest } from '../../common/use-latest'

const emptyLyric = {
  timeAxis: [],
  body: []
}

/** @param {N.SendingLyricProps} props */
export const SendingLyric = (props) => {
  const { songName, songLyrics, onLyricsChange } = props

  const getLatestLyrics = useLatest(songLyrics)

  const [currLyricIndex, setCurrLyricIndex] = useState(0)

  const lyric = songLyrics[currLyricIndex] ?? emptyLyric

  const { state, index: nextSentenceIndex, stop, play, pause, seek } = useLyricsSender({
    lyric
  })

  useEffect(() => {
    setCurrLyricIndex(0)
  }, [songLyrics.length])

  const lyricsContainer = useRef()
  useEffect(() => {
    const node = lyricsContainer.current
    const length = lyric.timeAxis.length

    if (node && length) {
      const { scrollHeight, offsetHeight } = node
      const top = scrollHeight * ((nextSentenceIndex + 1) / length) - offsetHeight / 2

      node.scrollTo({
        top,
        behavior: 'smooth'
      })
    }
  }, [lyric.timeAxis.length, nextSentenceIndex])

  const dataSource = useMemo(() => {
    return lyric.timeAxis.map((time, index) => {
      return {
        time,
        text: lyric.body[index].text,
        disabled: lyric.body[index].disabled
      }
    })
  }, [lyric])

  const renderItem = useCallback(({ time, text, disabled }, sentenceIndex) => {
    return (
      <List.Item
        key = {time}
        style = {
          disabled ? {
            color: 'rgba(0,0,0,.25)',
            cursor: 'not-allowed'
          } : nextSentenceIndex === sentenceIndex ? {
            fontWeight: 'bold'
          } : {}
        }
      >
        {nextSentenceIndex === sentenceIndex && <DoubleRightOutlined style = {{
          marginRight: '1em'
        }} /> }

        <span>[ {formatTimeStamp(time)} ]</span>

        <span
          style = {{
            flexGrow: 1,
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick = {() => {
            seek(sentenceIndex)
          }}
        >
          {text}
        </span>

        <Button
          type = 'primary'
          danger = {!disabled}
          disabled = {state === 'playing'}
          size = 'small'
          shape = 'circle'
          icon = {disabled ? <RedoOutlined /> : <CloseOutlined />}
          onClick = {() => {
            onLyricsChange(getLatestLyrics().map((lyric, lyricIndex) => {
              if (lyricIndex !== currLyricIndex) {
                return lyric
              } else {
                return { ...lyric, body: lyric.body.map((sentenceBody, index) => {
                  if (index !== sentenceIndex) {
                    return sentenceBody
                  } else {
                    return {
                      ...sentenceBody,
                      disabled: !sentenceBody.disabled
                    }
                  }
                })}
              }
            }))
          }}
        ></Button>
      </List.Item>
    )
  }, [currLyricIndex, getLatestLyrics, nextSentenceIndex, onLyricsChange, seek, state])

  return (
    <Fragment>
      <div
        style = {{
          display: 'flex',
          marginBottom: '1em',
          alignItems: 'center'
        }}
      >
        <Button
          type = 'primary'
          onClick = {() => {
            play()
          }}
          style = {{ marginRight: '1em' }}
        >
          开始 / 继续
        </Button>

        <Button
          onClick = {() => { pause() }}
          style = {{ marginRight: '1em' }}
        >
          暂停
        </Button>

        <Button
          type = 'dashed'
          danger
          onClick = {() => { stop() }}
        >
          停止
        </Button>

        <div
          style = {{
            flex: 1
          }}
        />

        {songLyrics.length === 2 && (<span>
          <Radio.Group
            value = {currLyricIndex}
            onChange = {(event) => setCurrLyricIndex(event.target.value)}
            disabled = {state === 'playing'}
          >
            <Radio value = {0}>原版歌词</Radio>
            <Radio value = {1}>翻译歌词</Radio>
          </Radio.Group>
        </span>)}
      </div>

      <div ref = {lyricsContainer} style = {{ overflowY: 'scroll', height: '32em' }} >
        <List
          size = 'small'
          bordered
          header = {<div style = {{ textAlign: 'center' }}>《{songName ?? ''}》</div>}
          dataSource = {dataSource}
          renderItem = {renderItem}
        />
      </div>
    </Fragment>
  )
}
