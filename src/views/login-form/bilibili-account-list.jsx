import React, { useEffect, useMemo } from 'react'

import { Button, Table, notification } from 'antd'

import { api } from '../../api/api'

import { useAsync } from '../../common/use-async'
import { usePrevious } from '../../common/use-previous'

export const BilibiliAccountList = ({ user, forceRefresh }) => {
  const [loadingState, loadAccountList] = useAsync(async () => {
    return api.getBilibiliAccountList({
      user
    })
  }, [user])

  const prevAccountList = usePrevious(loadingState.value, { check: it => !!it })

  const accountListToRender = useMemo(() => {
    return loadingState.value ?? prevAccountList ?? []
  }, [loadingState, prevAccountList])

  const [removingState, removeAccount] = useAsync(async (nameToRemove) => {
    return api.removeBilibiliAccount({
      user,
      nameToRemove
    })
  }, [])

  // load accountlist when mount
  useEffect(() => loadAccountList(), [loadAccountList, forceRefresh])

  // on load error
  useEffect(() => {
    const { error } = loadingState

    if (error) {
      const key = `/error/${Date.now()}`

      notification.error({
        message: 'B 站账户列表加载失败',
        description: loadingState.error.message,
        duration: null,
        key,
        btn: (
          <Button onClick = {() => {
            loadAccountList()
            notification.close(key)
          }}>
            重试
          </Button>
        )
      })
    }
  }, [loadingState, loadAccountList])

  // on remove error
  useEffect(() => {
    const { error } = removingState
    if (error) {
      notification.error({
        message: '删除失败',
        description: error.message,
        duration: 2
      })
    }
  }, [removingState])

  // on remove success
  useEffect(() => {
    const { pending, error, value } = removingState

    if (!pending && !error && value) {
      loadAccountList()

      notification.success({
        message: '删除成功',
        description: '账号已移除',
        duration: 2
      })
    }
  }, [loadAccountList, removingState])

  const dataSource = useMemo(() => {
    return accountListToRender.map((name, index) => ({
      key: name,
      id: index,
      name
    }))
  }, [accountListToRender])

  const columns = useMemo(() => {
    return [{
      title: 'ID',
      dataIndex: 'id',
      width: '1em'
    }, {
      title: '账号名',
      dataIndex: 'name'
    }, {
      title: '操作',
      width: '6em',
      align: 'center',
      render: ({ name }) => (
        <Button danger onClick = { () => removeAccount(name) }>
          移除
        </Button>
      )
    }]
  }, [removeAccount])

  return (
    <Table
      loading = {loadingState.pending || removingState.pending}
      dataSource = {dataSource}
      columns = {columns}
    />
  )
}
