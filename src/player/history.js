// "Played most" in the queue panel: the songs this browser played most often,
// kept on the server (npm run server), each one a click away from the queue again;
// plus the recovery code that carries the queue to another browser.
import { cloudState, fetchStats, onCloud, recoveryCode, restoreFrom } from './cloud.js';

const $ = (selector) => document.querySelector(selector);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const clock = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

