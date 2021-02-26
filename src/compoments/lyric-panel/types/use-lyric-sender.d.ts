import { Controller } from './controller'

export interface Lyric {
  timeAxis: number[],
  body: {
    text: string,
    disabled?: Boolean
  }[]
}

export interface UseLyricsSenderHook {
  state: Controller['state'],
  index: number,
  stop: () => void,
  play: () => void,
  pause: () => void,
  seek: (index: number) => void,
}

export interface UseLyricsSenderProps {
  lyric: Lyric
}
