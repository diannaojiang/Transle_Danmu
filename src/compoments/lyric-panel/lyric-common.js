// @ts-check

/**
 * @typedef {import('./types/use-lyric-sender').Lyric} Lyric
*/

/**
 * @param {string} lrcString string in Simple LRC format
 * @returns {Lyric}
 */
export const parseLRC = (lrcString) => {
  const lines = lrcString.trim().split(/\n/)

  /** @type {Lyric} */
  const lyric = {
    timeAxis: [],
    body: []
  }

  const records = []

  for (const it of lines) {
    const match = /^(?<timePoints>(?:\[[\d:.]+\])+)(?<content>[\s\S]*?)$/.exec(it)

    if (!match) {
      continue
    }

    const content = match.groups.content.trim()
    if (!content.length || /^(作词|作曲|编曲|編曲|制作人)\s*(:|：)\s*/.test(content)) {
      continue
    }

    const { timePoints } = match.groups

    for (const time of timePoints.slice(1, timePoints.length - 1).split('][')) {
      const [minutes, seconds] = time.split(':', 2)

      records.push({
        time: Number(minutes) * 60 + Number(seconds),
        text: content
      })
    }
  }

  for (const { time, text } of records.sort((a, b) => {
    return a.time - b.time
  })) {
    lyric.timeAxis.push(time)
    lyric.body.push({
      text
    })
  }

  return lyric
}

/**
 * @param {number} time time in seconds
 * @returns string
 */
export const formatTimeStamp = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  const milliseconds = Math.floor(time % 1 * 1000)
  return [
    minutes.toString().padStart(2, '0'),
    ':',
    seconds.toString().padStart(2, '0'),
    '.',
    milliseconds.toString().padStart(3, '0')
  ].join('')
}

/**
 * @param {number} duration duration in miliseconds
 * @returns string
 */
export const formatDuration = (duration) => {
  duration = Math.floor(duration / 1000)

  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration % 60)
  return [
    minutes.toString().padStart(2, '0'),
    ':',
    seconds.toString().padStart(2, '0')
  ].join('')
}
