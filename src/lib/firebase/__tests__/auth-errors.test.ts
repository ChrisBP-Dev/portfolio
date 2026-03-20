import { describe, it, expect } from 'vitest';
import { FirebaseError } from 'firebase/app';
import { getErrorMessage } from '../auth-errors';

function createFirebaseError(code: string): FirebaseError {
  return new FirebaseError(code, `Firebase: Error (${code}).`);
}

describe('getErrorMessage', () => {
  describe('Spanish locale', () => {
    it('returns "Contraseña incorrecta" for auth/wrong-password', () => {
      const error = createFirebaseError('auth/wrong-password');
      expect(getErrorMessage(error, 'es')).toBe('Contraseña incorrecta');
    });

    it('returns "Credenciales inválidas" for auth/user-not-found', () => {
      const error = createFirebaseError('auth/user-not-found');
      expect(getErrorMessage(error, 'es')).toBe('Credenciales inválidas');
    });

    it('returns "Credenciales inválidas" for auth/invalid-credential', () => {
      const error = createFirebaseError('auth/invalid-credential');
      expect(getErrorMessage(error, 'es')).toBe('Credenciales inválidas');
    });

    it('returns "Email inválido" for auth/invalid-email', () => {
      const error = createFirebaseError('auth/invalid-email');
      expect(getErrorMessage(error, 'es')).toBe('Email inválido');
    });

    it('returns "Demasiados intentos..." for auth/too-many-requests', () => {
      const error = createFirebaseError('auth/too-many-requests');
      expect(getErrorMessage(error, 'es')).toBe('Demasiados intentos. Intenta más tarde.');
    });

    it('returns fallback "Error inesperado" for unknown Firebase error code', () => {
      const error = createFirebaseError('auth/unknown-error');
      expect(getErrorMessage(error, 'es')).toBe('Error inesperado');
    });

    it('returns fallback "Error inesperado" for non-FirebaseError', () => {
      expect(getErrorMessage(new Error('something'), 'es')).toBe('Error inesperado');
    });

    it('returns fallback "Error inesperado" for string error', () => {
      expect(getErrorMessage('string error', 'es')).toBe('Error inesperado');
    });

    it('returns fallback "Error inesperado" for null', () => {
      expect(getErrorMessage(null, 'es')).toBe('Error inesperado');
    });

    it('returns fallback "Error inesperado" for undefined', () => {
      expect(getErrorMessage(undefined, 'es')).toBe('Error inesperado');
    });
  });

  describe('English locale', () => {
    it('returns "Wrong password" for auth/wrong-password', () => {
      const error = createFirebaseError('auth/wrong-password');
      expect(getErrorMessage(error, 'en')).toBe('Wrong password');
    });

    it('returns "Invalid credentials" for auth/user-not-found', () => {
      const error = createFirebaseError('auth/user-not-found');
      expect(getErrorMessage(error, 'en')).toBe('Invalid credentials');
    });

    it('returns "Invalid credentials" for auth/invalid-credential', () => {
      const error = createFirebaseError('auth/invalid-credential');
      expect(getErrorMessage(error, 'en')).toBe('Invalid credentials');
    });

    it('returns "Invalid email" for auth/invalid-email', () => {
      const error = createFirebaseError('auth/invalid-email');
      expect(getErrorMessage(error, 'en')).toBe('Invalid email');
    });

    it('returns "Too many attempts..." for auth/too-many-requests', () => {
      const error = createFirebaseError('auth/too-many-requests');
      expect(getErrorMessage(error, 'en')).toBe('Too many attempts. Try again later.');
    });

    it('returns fallback "Unexpected error" for unknown Firebase error code', () => {
      const error = createFirebaseError('auth/unknown-error');
      expect(getErrorMessage(error, 'en')).toBe('Unexpected error');
    });

    it('returns fallback "Unexpected error" for non-FirebaseError', () => {
      expect(getErrorMessage(new Error('something'), 'en')).toBe('Unexpected error');
    });
  });

  describe('duck-typing: handles errors with code property that are not FirebaseError instances', () => {
    it('maps a plain object with code to the correct message', () => {
      const error = { code: 'auth/invalid-credential', message: 'something' };
      expect(getErrorMessage(error, 'es')).toBe('Credenciales inválidas');
    });

    it('returns fallback for plain object with unmapped code', () => {
      const error = { code: 'auth/unknown' };
      expect(getErrorMessage(error, 'es')).toBe('Error inesperado');
    });
  });

  describe('security: user-not-found and invalid-credential map to same message', () => {
    it('does not reveal whether email exists (ES)', () => {
      const userNotFound = createFirebaseError('auth/user-not-found');
      const invalidCred = createFirebaseError('auth/invalid-credential');
      expect(getErrorMessage(userNotFound, 'es')).toBe(getErrorMessage(invalidCred, 'es'));
    });

    it('does not reveal whether email exists (EN)', () => {
      const userNotFound = createFirebaseError('auth/user-not-found');
      const invalidCred = createFirebaseError('auth/invalid-credential');
      expect(getErrorMessage(userNotFound, 'en')).toBe(getErrorMessage(invalidCred, 'en'));
    });
  });
});
