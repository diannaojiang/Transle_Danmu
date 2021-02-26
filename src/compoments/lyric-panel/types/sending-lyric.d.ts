import { Lyric } from './use-lyric-sender'

export interface SendingLyricProps {
  songID: string,
  songName: string,
  songLyrics: Lyric[],
  onLyricsChange: (lryics: Lyric[]) => void
}
