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
    const range = dayRange(today, days)
    const [[total]] = await pool.query("SELECT COUNT(*) AS plays FROM events WHERE device_id = ? AND kind = 'play'", [device])
    const [rows] = await pool.query("SELECT day, COUNT(*) AS plays FROM events WHERE device_id = ? AND kind = 'play' AND day >= ? GROUP BY day", [device, range[0]])
    // The newest title seen for each id names it: a title can arrive late, after the first play.
    // Aliases named id or kind would make GROUP BY use the table's own columns and group nothing.
    const [top] = await pool.query(
      `SELECT JSON_UNQUOTE(JSON_EXTRACT(data, '$.id')) AS song_id, JSON_UNQUOTE(JSON_EXTRACT(data, '$.kind')) AS song_kind, COUNT(*) AS plays, MAX(at) AS last,
        SUBSTRING_INDEX(GROUP_CONCAT(JSON_UNQUOTE(JSON_EXTRACT(data, '$.title')) ORDER BY at DESC SEPARATOR '\\n'), '\\n', 1) AS title
       FROM events WHERE device_id = ? AND kind = 'play' GROUP BY song_id, song_kind ORDER BY plays DESC, last DESC LIMIT 10`,
      [device],
