// BUILD TIME ONLY — never import in Svelte islands or client code
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const projectId = import.meta.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = import.meta.env.FIREBASE_ADMIN_CLIENT_EMAIL;
// trim() prevents whitespace-only values from bypassing the missing-var guard
const privateKey = import.meta.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim().replace(/\\n/g, '\n');

const missingVars = [
  !projectId && 'FIREBASE_ADMIN_PROJECT_ID',
  !clientEmail && 'FIREBASE_ADMIN_CLIENT_EMAIL',
  !privateKey && 'FIREBASE_ADMIN_PRIVATE_KEY',
].filter(Boolean);

if (missingVars.length > 0) {
  throw new Error(
    `Firebase Admin SDK config incomplete. Missing env vars: ${missingVars.join(', ')}. Check .env file or CI secrets.`,
  );
}

if (getApps().length === 0) {
  // Emulator env vars — set BEFORE initializeApp, inside guard to avoid mutating
  // process.env when the SDK was already initialized against production
  if (import.meta.env.USE_EMULATORS === 'true') {
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
  }
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminDb = getFirestore();
export const adminStorage = getStorage();
