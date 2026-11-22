// The sign-in screen and the account rows under "Played most". While the server runs,
// the player asks for an account first; when it cannot be reached the player still
// works and keeps the queue in this browser, as it did before accounts.
import { ApiError, checkAccount, cloudState, onCloud, signIn, signOut, signUp } from './cloud.js';

