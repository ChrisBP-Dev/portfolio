// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  // Firebase Client Config (PUBLIC_ = available in browser)
  readonly PUBLIC_FIREBASE_API_KEY: string;
  readonly PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  readonly PUBLIC_FIREBASE_PROJECT_ID: string;
  readonly PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  readonly PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly PUBLIC_FIREBASE_APP_ID: string;
  readonly PUBLIC_ADMIN_UID: string;

  // Contact
  readonly PUBLIC_CONTACT_EMAIL: string;

  // Firebase Admin SDK (server/build only — NEVER in browser)
  readonly FIREBASE_ADMIN_PROJECT_ID: string;
  readonly FIREBASE_ADMIN_CLIENT_EMAIL: string;
  readonly FIREBASE_ADMIN_PRIVATE_KEY: string;

  // Emulators
  readonly PUBLIC_USE_EMULATORS: string;
  readonly USE_EMULATORS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
