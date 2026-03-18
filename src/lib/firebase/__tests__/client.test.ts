import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebase/app
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: '[DEFAULT]' })),
  getApps: vi.fn(() => []),
}));

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ name: 'auth' })),
  connectAuthEmulator: vi.fn(),
}));

// Mock firebase/firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ name: 'firestore' })),
  connectFirestoreEmulator: vi.fn(),
}));

// Mock firebase/storage
vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({ name: 'storage' })),
  connectStorageEmulator: vi.fn(),
}));

describe('Firebase Client SDK', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('PUBLIC_FIREBASE_API_KEY', 'test-key');
    vi.stubEnv('PUBLIC_FIREBASE_AUTH_DOMAIN', 'test.firebaseapp.com');
    vi.stubEnv('PUBLIC_FIREBASE_PROJECT_ID', 'test-project');
    vi.stubEnv('PUBLIC_FIREBASE_STORAGE_BUCKET', 'test.appspot.com');
    vi.stubEnv('PUBLIC_FIREBASE_MESSAGING_SENDER_ID', '123456');
    vi.stubEnv('PUBLIC_FIREBASE_APP_ID', '1:123:web:abc');
    vi.stubEnv('PUBLIC_USE_EMULATORS', 'false');
  });

  it('[P0] 1.10-UNIT-011: client.ts module exports auth, db, storage, app names', async () => {
    const client = await import('../client');
    expect(client).toHaveProperty('auth');
    expect(client).toHaveProperty('db');
    expect(client).toHaveProperty('storage');
    expect(client).toHaveProperty('app');
  });

  it('[P1] 1.10-UNIT-012: client.ts throws error listing missing PUBLIC_FIREBASE_* var names', async () => {
    vi.resetModules();
    vi.stubEnv('PUBLIC_FIREBASE_API_KEY', '');
    vi.stubEnv('PUBLIC_FIREBASE_AUTH_DOMAIN', '');
    vi.stubEnv('PUBLIC_FIREBASE_PROJECT_ID', '');
    vi.stubEnv('PUBLIC_FIREBASE_STORAGE_BUCKET', '');
    vi.stubEnv('PUBLIC_FIREBASE_MESSAGING_SENDER_ID', '');
    vi.stubEnv('PUBLIC_FIREBASE_APP_ID', '');

    await expect(() => import('../client')).rejects.toThrow('PUBLIC_FIREBASE_API_KEY');
  });

  it('[P0] 1.10-UNIT-015: client.ts connects to emulators with correct ports when PUBLIC_USE_EMULATORS=true', async () => {
    vi.stubEnv('PUBLIC_USE_EMULATORS', 'true');
    delete (globalThis as Record<string, unknown>).__firebaseEmulatorsConnected;
    const { connectAuthEmulator } = await import('firebase/auth');
    const { connectFirestoreEmulator } = await import('firebase/firestore');
    const { connectStorageEmulator } = await import('firebase/storage');
    await import('../client');
    expect(connectAuthEmulator).toHaveBeenCalledWith(expect.anything(), 'http://127.0.0.1:9099');
    expect(connectFirestoreEmulator).toHaveBeenCalledWith(expect.anything(), '127.0.0.1', 8080);
    expect(connectStorageEmulator).toHaveBeenCalledWith(expect.anything(), '127.0.0.1', 9199);
  });
});
