import { describe, it, expect } from 'vitest';
import { slugify } from '../slugify';

describe('slugify', () => {
  it('[P0] 3.4-TEST-001: converts basic text to slug', () => {
    expect(slugify('Mi Proyecto Demo')).toBe('mi-proyecto-demo');
  });

  it('[P0] 3.4-TEST-002: handles Spanish accented characters', () => {
    expect(slugify('Aplicación Móvil')).toBe('aplicacion-movil');
    expect(slugify('Diseño Único')).toBe('diseno-unico');
    expect(slugify('Niño Español')).toBe('nino-espanol');
  });

  it('[P0] 3.4-TEST-003: handles ñ correctly', () => {
    expect(slugify('Año Nuevo')).toBe('ano-nuevo');
  });

  it('[P0] 3.4-TEST-004: removes special characters', () => {
    expect(slugify('Hello! World? (Test)')).toBe('hello-world-test');
    expect(slugify('project@v2.0')).toBe('project-v2-0');
  });

  it('[P0] 3.4-TEST-005: collapses multiple hyphens', () => {
    expect(slugify('hello   world')).toBe('hello-world');
    expect(slugify('a---b')).toBe('a-b');
  });

  it('[P0] 3.4-TEST-006: strips leading and trailing hyphens', () => {
    expect(slugify('  hello  ')).toBe('hello');
    expect(slugify('---hello---')).toBe('hello');
  });

  it('[P1] 3.4-TEST-007: handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('[P1] 3.4-TEST-008: handles string with only special characters', () => {
    expect(slugify('!@#$%')).toBe('');
  });

  it('[P1] 3.4-TEST-009: preserves numbers', () => {
    expect(slugify('Project 2024')).toBe('project-2024');
    expect(slugify('v3 release')).toBe('v3-release');
  });

  it('[P1] 3.4-TEST-010: handles all common Spanish accents', () => {
    expect(slugify('áéíóúñü')).toBe('aeiounu');
  });
});
