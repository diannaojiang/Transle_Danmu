import type { EventEmitter } from 'events'

export interface Signal<T> {
  promise: Promise<T>,
  resolve: (value: T) => void,
  reject: (reason?: any) => void
}

export type CreateSignal = <T>(
  executor?: (resolve: Signal<T>['resolve'], reject: Signal<T>['reject']) => void
) => Signal<T>

export interface ControllerProps {
  series: number[]
}

export interface ControllerEvents {
  '@seek': {
    index: number
  },

  '@trigger': {
    index: number
  },

  '@state': {
    state: ControllerInternals['state']
  }
}

export interface Controller {
  series: number[],
  state: 'playing' | 'paused',
  index: number,

  reset: (series: number[]) => void,
  play: () => void,
  pause: () => void,
  stop: () => void,
  seek: (index: number) => void,

  subscribe: <T extends keyof ControllerEvents>(
    event: T,
    subscriber: (payload: ControllerEvents[T]) => void
  ) => () => void,

  off: () => void
}

export interface ControllerInternals {
  nextState: Signal<Controller['state']>,

  setState: (state: Controller['state']) => void,

  emitter: EventEmitter,
  emit: <T extends keyof ControllerEvents>(event: T, payload: ControllerEvents[T]) => void
}
