// @ts-check

// eslint-disable-next-line no-unused-vars
import * as N from './types/controller'

import { EventEmitter } from 'events'

/** @type {N.CreateSignal} */
export const createSignal = (executor) => {
  const self = {}

  /** @template T @type {N.Signal<T>['resolve']} */
  let resolvePromise

  /** @template T @type {N.Signal<T>['reject']} */
  let rejectPromise

  /** @template T @type {N.Signal<T>['promise']} */
  self.promise = new Promise((resolve, reject) => {
    resolvePromise = resolve
    rejectPromise = reject

    executor && executor(resolve, reject)
  })

  self.resolve = resolvePromise
  self.reject = rejectPromise

  return self
}

/**
 * @returns {N.Controller}
 */
export const createController = () => {
  /** @type N.Controller & N.ControllerInternals */
  const self = {
    series: [],

    state: 'paused',
    index: 0,

    nextState: createSignal(resolve => resolve('paused')),

    setState (state) {
      self.state = state

      self.emit('@state', {
        state
      })
    },

    reset (series) {
      self.series = series

      self.nextState.resolve('paused')
      self.setState('paused')

      self.seek(0)
    },

    async play () {
      if (self.state === 'playing') {
        return
      }

      self.nextState = createSignal(resolve => resolve('playing'))
      self.setState('playing')

      while (true) {
        const nextState = await self.nextState.promise

        if (nextState === 'playing') {
          if (self.index + 1 >= self.series.length) {
            self.stop()
            break
          } else {
            const diff = self.series[self.index + 1] - self.series[self.index]

            self.emit('@trigger', {
              index: self.index
            })

            self.seek(self.index + 1)

            self.nextState = createSignal(resolve => {
              setTimeout(() => {
                resolve('playing')
              }, diff * 1000)
            })
          }
        } else {
          break
        }
      }
    },

    stop () {
      self.reset(self.series)
    },

    pause () {
      if (self.state === 'paused') {
        return
      }

      self.nextState.resolve('paused')
      self.setState('paused')
    },

    seek (index) {
      self.index = index

      self.nextState.resolve(self.state)

      self.emit('@seek', {
        index: self.index
      })
    },

    emitter: new EventEmitter(),
    off () {
      self.emitter.removeAllListeners()
    },
    emit (event, payload) {
      self.emitter.emit(event, payload)
    },
    subscribe (event, subscriber) {
      self.emitter.on(event, subscriber)

      return () => {
        self.emitter.off(event, subscriber)
      }
    }
  }

  return self
}
