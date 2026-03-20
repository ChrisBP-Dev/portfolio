import type { Locale } from '../i18n/config';

const firebaseAuthErrors: Record<string, Record<Locale, string>> = {
  'auth/wrong-password': { es: 'Credenciales inválidas', en: 'Invalid credentials' },
  'auth/user-not-found': { es: 'Credenciales inválidas', en: 'Invalid credentials' },
  'auth/invalid-credential': { es: 'Credenciales inválidas', en: 'Invalid credentials' },
  'auth/invalid-email': { es: 'Email inválido', en: 'Invalid email' },
  'auth/too-many-requests': {
    es: 'Demasiados intentos. Intenta más tarde.',
    en: 'Too many attempts. Try again later.',
  },
  'auth/network-request-failed': {
    es: 'Error de conexión. Verifica tu internet.',
    en: 'Connection error. Check your internet.',
  },
};

function hasCode(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

export function getErrorMessage(error: unknown, locale: Locale): string {
  if (hasCode(error)) {
    return (
      firebaseAuthErrors[error.code]?.[locale] ??
      (locale === 'es' ? 'Error inesperado' : 'Unexpected error')
    );
  }
  return locale === 'es' ? 'Error inesperado' : 'Unexpected error';
}
