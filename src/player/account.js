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
  const submit = $('gate-submit');
  const error = $('gate-error');
  let mode = 'in';
  let busy = false;
  // "Use without an account" holds until the page reloads or the visitor asks to sign in.
  let skipped = false;
  let shown = null;

  const label = () => (mode === 'in' ? 'Sign in' : 'Create account');
  function showError(text) {
    error.textContent = text;
    error.hidden = !text;
  }

  function applySave(text, welcome) {
    try {
      restore(JSON.parse(text));
    } catch {
      say('The queue saved with this account could not be read.');
      return;
    }
    try {
      sessionStorage.setItem(WELCOME_KEY, welcome);
    } catch {
      /* no session storage: the reload still shows the queue */
    }
    location.reload();
  }

