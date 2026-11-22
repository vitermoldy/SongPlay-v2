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

  function setMode(next) {
    mode = next;
    $('gate-h').textContent = next === 'in' ? 'Sign in to SongLearn' : 'Create a SongLearn account';
    submit.textContent = label();
    pass.autocomplete = next === 'in' ? 'current-password' : 'new-password';
    $('gate-pass-hint').hidden = next === 'in';
    $('gate-switch-text').textContent = next === 'in' ? 'No account yet?' : 'Already have an account?';
    $('gate-switch').textContent = next === 'in' ? 'Create one' : 'Sign in';
    $('gate-lead').textContent =
      next === 'in'
        ? 'Your queue, the songs you play most and your settings are kept with your account, on any browser.'
        : 'The queue already in this browser moves into your new account.';
    showError('');
    user.removeAttribute('aria-invalid');
    pass.removeAttribute('aria-invalid');
  }

  function render(state = cloudState()) {
    const offline = state.auth === 'unavailable';
    // The first check is not shown: a signed-in visitor should not see the screen flash by.
    const wanted = state.auth === 'signed-out' || (offline && !skipped) || (state.auth === 'checking' && gate.open);
    $('gate-checking').hidden = state.auth !== 'checking';
    form.hidden = state.auth !== 'signed-out';
    $('gate-switch-line').hidden = state.auth !== 'signed-out';
    $('gate-offline').hidden = !offline;
    $('gate-lead').hidden = state.auth !== 'signed-out';
    if (wanted && !gate.open) gate.showModal();
    else if (!wanted && gate.open) gate.close();
    // Focus moves only when what the screen asks for changes, never on every update.
    if (gate.open && shown !== state.auth) {
      if (state.auth === 'signed-out') user.focus();
      else if (offline) $('gate-retry').focus();
    }
    shown = gate.open ? state.auth : null;

    const signedIn = state.auth === 'signed-in' && state.account;
    $('account-in').hidden = !signedIn;
    $('account-out-of').hidden = Boolean(signedIn);
    if (signedIn) {
      $('account-name').textContent = state.account.username;
      $('account-since').textContent = joined(state.account.createdAt);
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    showError('');
    const name = user.value.trim();
    const password = pass.value;
    user.toggleAttribute('aria-invalid', !name);
    pass.toggleAttribute('aria-invalid', !password);
    if (!name || !password) {
      showError(!name ? 'Enter your username.' : 'Enter your password.');
      (!name ? user : pass).focus();
      return;
    }
    busy = true;
    submit.disabled = true;
    submit.textContent = mode === 'in' ? 'Checking…' : 'Creating account…';
    try {
      const save = mode === 'in' ? await signIn(name, password) : await signUp(name, password);
      const welcome = mode === 'in' ? `Signed in as ${cloudState().account?.username}.` : `Account ${name} created. Welcome.`;
      if (save) {
        applySave(save, welcome);
        return;
      }
      mirror();
      pass.value = '';
      say(welcome);
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Could not sign in. Try again.');
      if (e instanceof ApiError && e.status === 401) pass.select();
      pass.setAttribute('aria-invalid', 'true');
    } finally {
      busy = false;
      submit.disabled = false;
      submit.textContent = label();
    }
  });

