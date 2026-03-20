import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { projectSchema } from '../../schemas/project-schema';
import { createProject } from '../../../test/factories/project';

describe('project form validation', () => {
  it('[P0] 3.4-TEST-019: valid project data passes schema', () => {
    const project = createProject();
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(true);
  });

  it('[P0] 3.4-TEST-020: rejects missing companyName.es', () => {
    const project = createProject({
      companyName: { es: '', en: 'Valid' },
    });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(false);
  });

  it('[P0] 3.4-TEST-021: rejects missing companyName.en', () => {
    const project = createProject({
      companyName: { es: 'Válido', en: '' },
    });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(false);
  });

  it('[P0] 3.4-TEST-022: rejects missing shortDescription.es', () => {
    const project = createProject({
      shortDescription: { es: '', en: 'Valid' },
    });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(false);
  });

  it('[P0] 3.4-TEST-023: rejects missing shortDescription.en', () => {
    const project = createProject({
      shortDescription: { es: 'Válido', en: '' },
    });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(false);
  });

  it('[P0] 3.4-TEST-024: accepts empty features arrays', () => {
    const project = createProject({
      features: { es: [], en: [] },
    });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(true);
  });

  it('[P0] 3.4-TEST-025: rejects invalid slug (spaces)', () => {
    const project = createProject({ slug: 'invalid slug' });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(false);
  });

  it('[P0] 3.4-TEST-026: rejects invalid slug (uppercase)', () => {
    const project = createProject({ slug: 'InvalidSlug' });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(false);
  });

  it('[P0] 3.4-TEST-027: accepts valid slug', () => {
    const project = createProject({ slug: 'my-valid-project-123' });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(true);
  });

  it('[P1] 3.4-TEST-028: accepts valid websiteUrl', () => {
    const project = createProject({ websiteUrl: 'https://example.com' });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(true);
  });

  it('[P1] 3.4-TEST-029: rejects invalid websiteUrl', () => {
    const project = createProject({ websiteUrl: 'not-a-url' });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(false);
  });

  it('[P1] 3.4-TEST-030: accepts undefined websiteUrl (optional)', () => {
    const project = createProject({ websiteUrl: undefined });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(true);
  });

  it('[P1] 3.4-TEST-031: rejects empty slug', () => {
    const project = createProject({ slug: '' });
    const result = projectSchema.safeParse(project);
    expect(result.success).toBe(false);
  });

  it('[P1] 3.4-TEST-032: slug regex accepts single word', () => {
    const result = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).safeParse('hello');
    expect(result.success).toBe(true);
  });

  it('[P1] 3.4-TEST-033: slug regex rejects trailing hyphen', () => {
    const result = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).safeParse('hello-');
    expect(result.success).toBe(false);
  });
});
