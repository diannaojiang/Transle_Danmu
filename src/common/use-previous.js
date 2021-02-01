import { useRef, useEffect } from 'react'

export const usePrevious = (state, { check }) => {
  const ref = useRef()

  useEffect(() => {
    if (check(state)) {
      ref.current = state
    }
  })

  return ref.current
}
