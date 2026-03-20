import type { Locale } from '../i18n/config';

const firebaseStorageErrors: Record<string, Record<Locale, string>> = {
  'storage/unauthorized': {
    es: 'No tienes permiso para esta operación',
    en: 'You do not have permission for this operation',
  },
  'storage/canceled': {
    es: 'Operación cancelada',
    en: 'Operation canceled',
  },
  'storage/unknown': {
    es: 'Error inesperado en Storage',
    en: 'Unexpected Storage error',
  },
  'storage/object-not-found': {
    es: 'Archivo no encontrado',
    en: 'File not found',
  },
  'storage/quota-exceeded': {
    es: 'Cuota de almacenamiento excedida',
    en: 'Storage quota exceeded',
  },
  'storage/retry-limit-exceeded': {
    es: 'Error de conexión. Intenta de nuevo.',
    en: 'Connection error. Please try again.',
  },
  'storage/invalid-argument': {
    es: 'Archivo inválido',
    en: 'Invalid file',
  },
};

function hasCode(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

export function getStorageErrorMessage(error: unknown, locale: Locale): string {
  if (hasCode(error)) {
    return (
      firebaseStorageErrors[error.code]?.[locale] ??
      (locale === 'es' ? 'Error inesperado en Storage' : 'Unexpected Storage error')
    );
  }
  return locale === 'es' ? 'Error inesperado en Storage' : 'Unexpected Storage error';
}
