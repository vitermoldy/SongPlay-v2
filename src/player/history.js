// "Played most" in the queue panel: the songs this account played most often,
// kept on the server (npm run server), each one a click away from the queue again.
import { cloudState, fetchStats, onCloud } from './cloud.js';

const $ = (selector) => document.querySelector(selector);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const clock = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** `enqueue(parsed)` adds a song to the queue the way the link form does. */
export function mountHistory({ enqueue }) {
  const ui = {
    status: $('[data-history-status]'),
    list: $('[data-history-list]'),
    empty: $('[data-history-empty]'),
  };
  let stats = null;

  function row(song) {
    const li = document.createElement('li');
    li.className = 'queue-item history-item';
    const thumb = document.createElement('img');
    thumb.className = 'queue-thumb';
    thumb.width = 96;
    thumb.height = 54;
    thumb.alt = '';
    thumb.loading = 'lazy';
    thumb.decoding = 'async';
    if (song.kind === 'video') thumb.src = `https://i.ytimg.com/vi/${song.id}/mqdefault.jpg`;
    const meta = document.createElement('div');
    const title = document.createElement('p');
    title.className = 'queue-title';
    title.textContent = song.title || (song.kind === 'playlist' ? 'YouTube playlist' : 'YouTube video');
    const sub = document.createElement('p');
    sub.className = 'queue-sub';
    sub.textContent = `Played ${plural(song.plays, 'time', 'times')}`;
    meta.append(title, sub);
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'icon-btn';
    add.setAttribute('aria-label', `Add ${title.textContent} to the queue`);
    add.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>';
    add.addEventListener('click', () => enqueue(song.kind === 'playlist' ? { kind: 'playlist', list: song.id } : { kind: 'video', id: song.id }));
    li.append(thumb, meta, add);
    return li;
  }

  function render(state = cloudState()) {
    const waiting = state.pending > 0 ? ` ${plural(state.pending, 'play waits', 'plays wait')} to be sent.` : '';
    ui.status.textContent =
      state.auth === 'signed-in' && state.status !== 'offline'
        ? `Kept on the server.${state.lastSaved ? ` Queue last saved at ${clock(state.lastSaved)}.` : ''}${waiting}`
        : state.status === 'offline' || state.auth === 'unavailable'
          ? `The server is not reachable, so the history is out of sight for now. The queue stays in this browser.${waiting}`
          : state.auth === 'checking'
            ? 'Checking the server…'
            : `Sign in to keep the songs you play most.${waiting}`;
    if (state.auth !== 'signed-in') stats = null;
    const top = stats?.top ?? [];
    ui.list.replaceChildren(...top.slice(0, 5).map(row));
    ui.empty.hidden = !stats || top.length > 0;
    if (stats && top.length === 0) ui.empty.textContent = 'Songs you play show up here, most played first.';
  }

  let pending = 0;
  async function refresh() {
    stats = await fetchStats(14);
    render();
  }
  /** After a play, the counts change; one refresh a moment later covers a burst of them. */
  function refreshSoon() {
    clearTimeout(pending);
    pending = setTimeout(refresh, 1500);
  }

  let auth = cloudState().auth;
  onCloud((state) => {
    // Signing in brings this account's counts.
    if (state.auth === 'signed-in' && auth !== 'signed-in') void refresh();
    auth = state.auth;
    render(state);
  });
  $('[data-queue-toggle]')?.addEventListener('click', () => void refresh());

  render();
  void refresh();
  return { refreshSoon };
}
