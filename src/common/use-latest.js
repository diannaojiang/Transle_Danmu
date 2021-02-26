import { useCallback, useRef } from 'react'

export const useLatest = (value) => {
  const ref = useRef(value)
  ref.current = value

  return useCallback(() => {
    return ref.current
  }, [])
};
