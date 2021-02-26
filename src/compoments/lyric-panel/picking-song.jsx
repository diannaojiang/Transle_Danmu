// @ts-check

import React, { Fragment, useMemo } from 'react'
import { Button, Input, Table, Form } from 'antd'
import { api } from '../../api/api'
import { useAsync } from '../../common/use-async'
import { usePrevious } from '../../common/use-previous'

import { formatDuration } from './lyric-common'

// eslint-disable-next-line no-unused-vars
import * as N from './types/picking-song'

/** @typedef {import('antd')} Column */

/**
 * @param {N.PickingSongProps} props
 */
export const PickingSong = (props) => {
  const {
    onFinish = () => {}
  } = props

  const [searchingState, searchSong] = useAsync(async ({ searchKey }) => {
    return await api.searchSong({
      searchKey
    })
  }, [])

  const prevSearchResult = usePrevious(searchingState.value, { check: it => !!it })

  const searchResultToRender = useMemo(() => {
    return searchingState.value ?? prevSearchResult ?? {}
  }, [prevSearchResult, searchingState])

  const dataSource = useMemo(() => {
    const { songs = [] } = searchResultToRender

    return songs.map(({ id, name, artists, album, duration }) => {
      return {
        key: id,
        id,
        name,
        artist: artists.map(({name}) => name).join(' / '),
        album: album.name,
        duration
      }
    })
  }, [searchResultToRender])

  const columns = useMemo(() => {
    return [{
      title: '歌曲名',
      dataIndex: 'name'
    }, {
      title: '歌手',
      dataIndex: 'artist'
    }, {
      title: '专辑',
      dataIndex: 'album'
    }, {
      title: '时长',
      render: ({ duration }) => {
        return formatDuration(duration)
      }
    }, {
      title: '操作',
      key: 'actions',
      align: 'center',
      render: ({ id, name }) => {
        return (
          <Button type = 'primary' onClick = {() => onFinish({ songID: id, songName: name })}>
            选择
          </Button>
        )
      }
    }]
  }, [onFinish])

  return (
    <Fragment>
      <Form layout = 'inline' onFinish = {searchSong}>
        <Form.Item
          name = 'searchKey'
          rules = {[{
            required: true,
            message: '请输入搜索关键字'
          }]}
          style = {{
            flexGrow: 1
          }}
        >
          <Input placeholder = '歌曲名'></Input>
        </Form.Item>

        <Form.Item>
          <Button type = 'primary' htmlType = 'submit' loading = {searchingState.pending}>
            搜索歌曲
          </Button>
        </Form.Item>
      </Form>

      <Table
        loading = {searchingState.pending}
        dataSource = {dataSource}
        columns = {columns}
        pagination = {{
          pageSize: 5
        }}
        style = {{
          marginTop: '1.5em'
        }}
      />
    </Fragment>
  )
}
