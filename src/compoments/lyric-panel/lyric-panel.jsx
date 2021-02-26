import React, { useState, useCallback } from 'react'
import { Spin, Card } from 'antd'
import { api } from '../../api/api'
import { useAsync } from '../../common/use-async'

import { PickingSong } from './picking-song'
import { SendingLyric } from './sending-lyric'
import { parseLRC } from './lyric-common'

/** @typedef {import('./types/picking-song').PickingSongProps} PickingSongProps */

export const LyricPanel = () => {
  const [song, setSong] = useState({
    songID: null,
    songName: null,
    songLyrics: []
  })

  const [fetchingState, fetchLyrics] = useAsync(async ({ songID }) => {
    const result = await api.getLyrics({
      songID
    })

    return result.map(it => parseLRC(it))
  }, [])

  /** @type {PickingSongProps['onFinish']} */
  const onFinish = useCallback(async ({ songID, songName }) => {
    /** @type {import('./lyric-common').Lyric[]} */
    const lyrics = await fetchLyrics({ songID, songName })

    setSong({
      songID,
      songName,
      songLyrics: lyrics
    })
  }, [fetchLyrics])

  return (
    <Card
      title = '歌词模式'
    >
      <PickingSong onFinish = {onFinish} />
      <Spin spinning = {fetchingState.pending}>
        {song.songID && <SendingLyric
          {...song}
          onLyricsChange = {(lyrics) => {
            setSong({
              ...song,
              songLyrics: lyrics
            })
          }}
        />}
      </Spin>
    </Card>
  )
}
