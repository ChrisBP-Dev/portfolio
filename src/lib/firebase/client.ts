// SOLO browser — importar en Svelte islands, NUNCA en Astro frontmatter o build scripts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

// Maps SDK config keys to their PUBLIC_FIREBASE_* env var names for actionable error messages
const configKeyToEnvVar: Record<string, string> = {
  apiKey: 'PUBLIC_FIREBASE_API_KEY',
  authDomain: 'PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'PUBLIC_FIREBASE_APP_ID',
};

const missingVars = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => configKeyToEnvVar[k] ?? k);
if (missingVars.length > 0) {
  throw new Error(
    `Firebase client config incomplete. Missing env vars: ${missingVars.join(', ')}. Check .env file.`,
  );
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { app };

// Emulator connection (dev only) — globalThis guard prevents double-connection on HMR
// Flag is set BEFORE connect calls so partial failures don't cause re-connection attempts
if (
  import.meta.env.PUBLIC_USE_EMULATORS === 'true' &&
  !(globalThis as Record<string, unknown>).__firebaseEmulatorsConnected
) {
  (globalThis as Record<string, unknown>).__firebaseEmulatorsConnected = true;
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}
