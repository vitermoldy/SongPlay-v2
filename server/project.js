import { dayRange } from './dates.js'

/**
 * What this app keeps in MySQL: every song (or playlist) that started playing
 * on the TV, with its YouTube id and title, and a copy of the queue.
 */
export default {
  name: 'SongPlay v2',
  database: 'songplay_v2',
  port: 8793,
  maxSaveBytes: 256 * 1024,
  events: {
    /** A video or playlist that started playing. */
    play(data) {
      const id = typeof data?.id === 'string' ? data.id : ''
      if (!/^[A-Za-z0-9_-]{6,64}$/.test(id)) return null
      const kind = data?.kind === 'playlist' ? 'playlist' : 'video'
      const title = typeof data?.title === 'string' ? data.title.trim().slice(0, 200) : ''
      return { id, kind, ...(title ? { title } : {}) }
    },
  },
  async stats(pool, device, { days, today }) {
