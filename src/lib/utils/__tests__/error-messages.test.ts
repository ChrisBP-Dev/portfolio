import { describe, it, expect } from 'vitest';
import { getFirestoreErrorMessage } from '../error-messages';

describe('[P0] error-messages', () => {
  it('3.8-TEST-001: maps permission-denied to localized message', () => {
    const error = { code: 'permission-denied' };
    const result = getFirestoreErrorMessage(error, 'es');
    expect(result).toBe('Sin permisos para esta operación');
  });

  it('3.8-TEST-002: maps storage/unauthorized to permission message', () => {
    const error = { code: 'storage/unauthorized' };
    const result = getFirestoreErrorMessage(error, 'es');
    expect(result).toBe('Sin permisos para esta operación');
  });

  it('3.8-TEST-003: unknown code falls back to generic error', () => {
    const error = { code: 'some-unknown-code' };
    const result = getFirestoreErrorMessage(error, 'es');
    expect(result).toBe('Error inesperado');
  });

  it('3.8-TEST-004: non-object error falls back to generic error', () => {
    const result = getFirestoreErrorMessage('string error', 'es');
    expect(result).toBe('Error inesperado');
  });

  it('3.8-TEST-005: returns English when locale is en', () => {
    const error = { code: 'permission-denied' };
    const result = getFirestoreErrorMessage(error, 'en');
    expect(result).toBe('No permission for this operation');
  });

  it('3.8-TEST-009: maps unauthenticated to session expired message', () => {
    const error = { code: 'unauthenticated' };
    const result = getFirestoreErrorMessage(error, 'es');
    expect(result).toBe('Sesión expirada. Inicia sesión nuevamente.');
  });

  it('3.8-TEST-010: maps storage/quota-exceeded to storage full message', () => {
    const error = { code: 'storage/quota-exceeded' };
    const result = getFirestoreErrorMessage(error, 'es');
    expect(result).toBe('Almacenamiento lleno. Elimina archivos antes de subir más.');
  });

  it('3.8-TEST-011: maps already-exists to resource exists message', () => {
    const error = { code: 'already-exists' };
    const result = getFirestoreErrorMessage(error, 'es');
    expect(result).toBe('El recurso ya existe');
  });

  it('3.8-TEST-012: null error falls back to generic error', () => {
    const result = getFirestoreErrorMessage(null, 'es');
    expect(result).toBe('Error inesperado');
  });
});
