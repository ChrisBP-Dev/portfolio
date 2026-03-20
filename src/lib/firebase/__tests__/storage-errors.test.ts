import { describe, it, expect } from 'vitest';
import { getStorageErrorMessage } from '../storage-errors';

function createStorageError(code: string): { code: string; message: string } {
  return { code, message: `Firebase Storage: Error (${code}).` };
}

describe('getStorageErrorMessage', () => {
  describe('Spanish locale', () => {
    it('returns correct message for storage/unauthorized', () => {
      const error = createStorageError('storage/unauthorized');
      expect(getStorageErrorMessage(error, 'es')).toBe(
        'No tienes permiso para esta operación',
      );
    });

    it('returns correct message for storage/canceled', () => {
      const error = createStorageError('storage/canceled');
      expect(getStorageErrorMessage(error, 'es')).toBe('Operación cancelada');
    });

    it('returns correct message for storage/unknown', () => {
      const error = createStorageError('storage/unknown');
      expect(getStorageErrorMessage(error, 'es')).toBe('Error inesperado en Storage');
    });

    it('returns correct message for storage/object-not-found', () => {
      const error = createStorageError('storage/object-not-found');
      expect(getStorageErrorMessage(error, 'es')).toBe('Archivo no encontrado');
    });

    it('returns correct message for storage/quota-exceeded', () => {
      const error = createStorageError('storage/quota-exceeded');
      expect(getStorageErrorMessage(error, 'es')).toBe('Cuota de almacenamiento excedida');
    });

    it('returns correct message for storage/retry-limit-exceeded', () => {
      const error = createStorageError('storage/retry-limit-exceeded');
      expect(getStorageErrorMessage(error, 'es')).toBe(
        'Error de conexión. Intenta de nuevo.',
      );
    });

    it('returns correct message for storage/invalid-argument', () => {
      const error = createStorageError('storage/invalid-argument');
      expect(getStorageErrorMessage(error, 'es')).toBe('Archivo inválido');
    });

    it('returns fallback for unknown storage error code', () => {
      const error = createStorageError('storage/some-unknown');
      expect(getStorageErrorMessage(error, 'es')).toBe('Error inesperado en Storage');
    });

    it('returns fallback for non-object error', () => {
      expect(getStorageErrorMessage('string error', 'es')).toBe('Error inesperado en Storage');
    });

    it('returns fallback for null', () => {
      expect(getStorageErrorMessage(null, 'es')).toBe('Error inesperado en Storage');
    });

    it('returns fallback for undefined', () => {
      expect(getStorageErrorMessage(undefined, 'es')).toBe('Error inesperado en Storage');
    });
  });

  describe('English locale', () => {
    it('returns correct message for storage/unauthorized', () => {
      const error = createStorageError('storage/unauthorized');
      expect(getStorageErrorMessage(error, 'en')).toBe(
        'You do not have permission for this operation',
      );
    });

    it('returns correct message for storage/canceled', () => {
      const error = createStorageError('storage/canceled');
      expect(getStorageErrorMessage(error, 'en')).toBe('Operation canceled');
    });

    it('returns correct message for storage/unknown', () => {
      const error = createStorageError('storage/unknown');
      expect(getStorageErrorMessage(error, 'en')).toBe('Unexpected Storage error');
    });

    it('returns correct message for storage/object-not-found', () => {
      const error = createStorageError('storage/object-not-found');
      expect(getStorageErrorMessage(error, 'en')).toBe('File not found');
    });

    it('returns correct message for storage/quota-exceeded', () => {
      const error = createStorageError('storage/quota-exceeded');
      expect(getStorageErrorMessage(error, 'en')).toBe('Storage quota exceeded');
    });

    it('returns correct message for storage/retry-limit-exceeded', () => {
      const error = createStorageError('storage/retry-limit-exceeded');
      expect(getStorageErrorMessage(error, 'en')).toBe(
        'Connection error. Please try again.',
      );
    });

    it('returns correct message for storage/invalid-argument', () => {
      const error = createStorageError('storage/invalid-argument');
      expect(getStorageErrorMessage(error, 'en')).toBe('Invalid file');
    });

    it('returns fallback for unknown storage error code', () => {
      const error = createStorageError('storage/some-unknown');
      expect(getStorageErrorMessage(error, 'en')).toBe('Unexpected Storage error');
    });

    it('returns fallback for non-object error', () => {
      expect(getStorageErrorMessage(new Error('something'), 'en')).toBe(
        'Unexpected Storage error',
      );
    });
  });

  describe('duck-typing: handles objects with code property', () => {
    it('maps a plain object with code to the correct message', () => {
      const error = { code: 'storage/canceled', message: 'something' };
      expect(getStorageErrorMessage(error, 'es')).toBe('Operación cancelada');
    });

    it('returns fallback for plain object with unmapped code', () => {
      const error = { code: 'storage/unknown-xyz' };
      expect(getStorageErrorMessage(error, 'es')).toBe('Error inesperado en Storage');
    });
  });
});
