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
