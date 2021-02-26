import React, { useEffect } from 'react'
import { Spin } from 'antd';
import { useAsync } from '../../common/use-async'

import ReactMarkdown from 'react-markdown'

import readmeURL from '../../../README.md'

export const ReadMe = () => {
    const [fetchingState, fetchReadme] = useAsync(async () => {
        const res = await fetch(readmeURL)
        return await res.text()
    }, [])

    useEffect(() => {
        fetchReadme()
    }, [fetchReadme])

    return (
        <Spin spinning = {fetchingState.pending}>
            <ReactMarkdown>
                {fetchingState.value}
            </ReactMarkdown>
        </Spin>
    )
}
