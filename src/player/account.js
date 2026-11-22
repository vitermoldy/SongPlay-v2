// The sign-in screen and the account rows under "Played most". While the server runs,
// the player asks for an account first; when it cannot be reached the player still
// works and keeps the queue in this browser, as it did before accounts.
import { ApiError, checkAccount, cloudState, onCloud, signIn, signOut, signUp } from './cloud.js';

const $ = (id) => document.getElementById(id);
const joined = (iso) => new Date(iso).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
const WELCOME_KEY = 'songplay:welcome';

/**
 * `restore(data)` writes the account's queue and settings over this browser's.
 * `mirror()` sends this browser's queue and settings now. `forget()` removes the
 * queue before the reload that follows signing out. `say(text)` announces.
 */
export function mountAccount({ restore, mirror, forget, say }) {
  const gate = $('auth-gate');
  const form = $('gate-form');
  const user = $('gate-user');
  const pass = $('gate-pass');
