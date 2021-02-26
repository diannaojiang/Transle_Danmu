import { useState, useEffect, useRef, useCallback } from 'react'

export const useAsync = (fn, deps) => {
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    }
  })

  const isMounted = useCallback(() => mountedRef.current, [])

  const [state, setState] = useState({
    pending: false,
    error: null,
    value: null
  })

  const lastestID = useRef(0)

  const callback = useCallback((...args) => {
    const id = ++lastestID.current;

    setState({
      pending: true,
      value: null,
      error: null
    })

    return fn(
      ...args
    ).then(value => {
      if (isMounted() && id === lastestID.current) {
        setState({
          pending: false,
          value,
          error: null
        })
      }

      return value
    }).catch(error => {
      if (isMounted() && id === lastestID.current) {
        setState({
          pending: false,
          value: null,
          error
        })
      }

      return error
    })
  }, [...deps, isMounted])

  /** @type [{ pending: Boolean, error: any, value: any }, callback: (...args: any[]) => any] */
  const hook = [state, callback]
  return hook
}
