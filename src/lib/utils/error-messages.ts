import { t } from '../i18n/translations';
import type { Locale } from '../i18n/config';

/** Firebase Firestore error code → i18n key */
const FIRESTORE_ERROR_MAP: Record<string, string> = {
  'permission-denied': 'admin.error.permissionDenied',
  'not-found': 'admin.error.notFound',
  'unavailable': 'admin.error.unavailable',
  'unauthenticated': 'admin.error.unauthenticated',
  'resource-exhausted': 'admin.error.resourceExhausted',
  'deadline-exceeded': 'admin.error.deadlineExceeded',
  'already-exists': 'admin.error.alreadyExists',
};

/** Firebase Storage error code → i18n key */
const STORAGE_ERROR_MAP: Record<string, string> = {
  'storage/unauthorized': 'admin.error.permissionDenied',
  'storage/object-not-found': 'admin.error.notFound',
  'storage/quota-exceeded': 'admin.error.storageFull',
  'storage/retry-limit-exceeded': 'admin.error.uploadFailed',
  'storage/canceled': 'admin.error.uploadFailed',
  'storage/unknown': 'admin.error.unknown',
};

/**
 * Maps a Firebase error (Firestore or Storage) to a user-friendly translated message.
 * Duck-types `error.code` — works with FirestoreError, StorageError, or any { code: string }.
 */
export function getFirestoreErrorMessage(error: unknown, locale: Locale): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    const key = FIRESTORE_ERROR_MAP[code] ?? STORAGE_ERROR_MAP[code];
    if (key) return t(key, locale);
  }
  return t('admin.error.unknown', locale);
}
