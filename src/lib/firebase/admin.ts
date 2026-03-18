// BUILD TIME ONLY — never import in Svelte islands or client code
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Emulator env vars — set BEFORE SDK initialization
if (import.meta.env.USE_EMULATORS === 'true') {
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
}

const projectId = import.meta.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = import.meta.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = import.meta.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

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
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminDb = getFirestore();
export const adminStorage = getStorage();
