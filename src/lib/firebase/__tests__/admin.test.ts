import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebase-admin/app
vi.mock('firebase-admin/app', () => ({
  initializeApp: vi.fn(),
  cert: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
}));

// Mock firebase-admin/firestore
vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({ name: 'admin-firestore' })),
}));

// Mock firebase-admin/storage
vi.mock('firebase-admin/storage', () => ({
  getStorage: vi.fn(() => ({ name: 'admin-storage' })),
}));

describe('Firebase Admin SDK', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('FIREBASE_ADMIN_PROJECT_ID', 'test-project');
    vi.stubEnv('FIREBASE_ADMIN_CLIENT_EMAIL', 'test@test.iam.gserviceaccount.com');
    vi.stubEnv('FIREBASE_ADMIN_PRIVATE_KEY', '-----BEGIN PRIVATE KEY-----\\ntest\\n-----END PRIVATE KEY-----');
    vi.stubEnv('USE_EMULATORS', 'false');
  });

  it('[P0] 1.10-UNIT-013: admin.ts module exports adminDb, adminStorage names', async () => {
    const admin = await import('../admin');
    expect(admin).toHaveProperty('adminDb');
    expect(admin).toHaveProperty('adminStorage');
  });

  it('[P1] 1.10-UNIT-014: admin.ts throws error listing missing FIREBASE_ADMIN_* var names', async () => {
    vi.resetModules();
    vi.stubEnv('FIREBASE_ADMIN_PROJECT_ID', '');
    vi.stubEnv('FIREBASE_ADMIN_CLIENT_EMAIL', '');
    vi.stubEnv('FIREBASE_ADMIN_PRIVATE_KEY', '');

    await expect(() => import('../admin')).rejects.toThrow('FIREBASE_ADMIN_PROJECT_ID');
  });

  it('[P0] 1.10-UNIT-016: admin.ts sets FIRESTORE_EMULATOR_HOST and FIREBASE_STORAGE_EMULATOR_HOST when USE_EMULATORS=true', async () => {
    vi.stubEnv('USE_EMULATORS', 'true');
    delete process.env.FIRESTORE_EMULATOR_HOST;
    delete process.env.FIREBASE_STORAGE_EMULATOR_HOST;
    await import('../admin');
    expect(process.env.FIRESTORE_EMULATOR_HOST).toBe('127.0.0.1:8080');
    expect(process.env.FIREBASE_STORAGE_EMULATOR_HOST).toBe('127.0.0.1:9199');
  });
});
