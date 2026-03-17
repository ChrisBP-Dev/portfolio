/**
 * ATDD Unit Tests — Story 1.4: Zod Schemas y Modelos de Datos
 *
 * Cobertura: AC #1–#6 (shared schemas, entity schemas, tipos derivados)
 */
import { describe, expect, it } from 'vitest';

import { localeSchema, localizedString, localizedStringArray, storedImageSchema } from '../shared-schemas';
import type { Locale, LocalizedString, LocalizedStringArray, StoredImage } from '../shared-schemas';
import { projectSchema } from '../project-schema';
import type { Project } from '../project-schema';
import { technologySchema } from '../technology-schema';
import type { Technology } from '../technology-schema';
import { experienceSchema } from '../experience-schema';
import type { Experience } from '../experience-schema';
import { blogPostSchema } from '../blog-post-schema';
import type { BlogPost } from '../blog-post-schema';

// ============================================================
// AC #1: Shared Schemas
// ============================================================

describe('Shared Schemas', () => {
  describe('localeSchema', () => {
    it('[P0] 1.4-UNIT-001: acepta "es" y "en" como valores válidos', () => {
      expect(localeSchema.parse('es')).toBe('es');
      expect(localeSchema.parse('en')).toBe('en');
    });

    it('[P1] 1.4-UNIT-002: rechaza strings que no son "es" ni "en"', () => {
      expect(() => localeSchema.parse('fr')).toThrow();
      expect(() => localeSchema.parse('')).toThrow();
      expect(() => localeSchema.parse('ES')).toThrow();
    });
  });

  describe('localizedString', () => {
    it('[P0] 1.4-UNIT-003: acepta objeto {es, en} con strings no vacíos', () => {
      const result = localizedString.parse({ es: 'Hola', en: 'Hello' });
      expect(result).toEqual({ es: 'Hola', en: 'Hello' });
    });

    it('[P1] 1.4-UNIT-004: rechaza strings vacíos (min(1))', () => {
      expect(() => localizedString.parse({ es: '', en: 'Hello' })).toThrow();
      expect(() => localizedString.parse({ es: 'Hola', en: '' })).toThrow();
    });

    it('[P1] 1.4-UNIT-005: rechaza objeto con claves faltantes', () => {
      expect(() => localizedString.parse({ es: 'Hola' })).toThrow();
      expect(() => localizedString.parse({ en: 'Hello' })).toThrow();
      expect(() => localizedString.parse({})).toThrow();
    });
  });

  describe('localizedStringArray', () => {
    it('[P0] 1.4-UNIT-006: acepta arrays de strings (incluso vacíos)', () => {
      expect(localizedStringArray.parse({ es: ['uno'], en: ['one'] })).toEqual({ es: ['uno'], en: ['one'] });
      expect(localizedStringArray.parse({ es: [], en: [] })).toEqual({ es: [], en: [] });
    });
  });

  describe('storedImageSchema', () => {
    it('[P0] 1.4-UNIT-007: acepta {url válida, storagePath no vacío}', () => {
      const result = storedImageSchema.parse({
        url: 'https://example.com/image.webp',
        storagePath: 'projects/demo/image.webp',
      });
      expect(result.url).toBe('https://example.com/image.webp');
      expect(result.storagePath).toBe('projects/demo/image.webp');
    });

    it('[P1] 1.4-UNIT-008: rechaza URL inválida', () => {
      expect(() => storedImageSchema.parse({
        url: 'not-a-url',
        storagePath: 'path/to/image.webp',
      })).toThrow();
    });

    it('[P1] 1.4-UNIT-009: rechaza storagePath vacío', () => {
      expect(() => storedImageSchema.parse({
        url: 'https://example.com/image.webp',
        storagePath: '',
      })).toThrow();
    });
  });
});

// ============================================================
// AC #2: projectSchema
// ============================================================

describe('projectSchema', () => {
  it('[P0] 1.4-UNIT-010: acepta datos válidos completos', () => {
    const validProject = {
      id: 'abc123',
      companyName: { es: 'Empresa Demo', en: 'Demo Company' },
      shortDescription: { es: 'App web moderna', en: 'Modern web app' },
      features: { es: ['Feature principal'], en: ['Main feature'] },
      mainImage: {
        url: 'https://example.com/images/hero.webp',
        storagePath: 'projects/demo/hero.webp',
      },
      screenshots: [],
      technologies: ['astro', 'svelte'],
      slug: 'proyecto-demo',
    };
    const result = projectSchema.parse(validProject);
    expect(result.id).toBe('abc123');
    expect(result.slug).toBe('proyecto-demo');
    expect(result.companyName.es).toBe('Empresa Demo');
  });

  it('[P1] 1.4-UNIT-011: websiteUrl y sourceCodeUrl son opcionales', () => {
    const withoutUrls = {
      id: 'abc123',
      companyName: { es: 'Empresa', en: 'Company' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      features: { es: [], en: [] },
      mainImage: { url: 'https://example.com/img.webp', storagePath: 'p/img.webp' },
      screenshots: [],
      technologies: [],
      slug: 'test',
    };
    expect(() => projectSchema.parse(withoutUrls)).not.toThrow();

    const withUrls = {
      ...withoutUrls,
      websiteUrl: 'https://example.com',
      sourceCodeUrl: 'https://github.com/user/repo',
    };
    expect(() => projectSchema.parse(withUrls)).not.toThrow();
  });

  it('[P1] 1.4-UNIT-012: rechaza slug vacío', () => {
    const withEmptySlug = {
      id: 'abc123',
      companyName: { es: 'Empresa', en: 'Company' },
      shortDescription: { es: 'Desc', en: 'Desc' },
      features: { es: [], en: [] },
      mainImage: { url: 'https://example.com/img.webp', storagePath: 'p/img.webp' },
      screenshots: [],
      technologies: [],
      slug: '',
    };
    expect(() => projectSchema.parse(withEmptySlug)).toThrow();
  });

  it('[P1] 1.4-UNIT-013: rechaza campo requerido faltante (companyName)', () => {
    const missingCompanyName = {
      id: 'abc123',
      shortDescription: { es: 'Desc', en: 'Desc' },
      features: { es: [], en: [] },
      mainImage: { url: 'https://example.com/img.webp', storagePath: 'p/img.webp' },
      screenshots: [],
      technologies: [],
      slug: 'test',
    };
    expect(() => projectSchema.parse(missingCompanyName)).toThrow();
  });
});

// ============================================================
// AC #3: technologySchema
// ============================================================

describe('technologySchema', () => {
  it('[P0] 1.4-UNIT-014: acepta datos válidos', () => {
    const validTech = {
      id: 'tech-1',
      name: 'Astro',
      image: {
        url: 'https://example.com/astro-logo.webp',
        storagePath: 'technologies/astro/logo.webp',
      },
      experienceYears: 3,
    };
    const result = technologySchema.parse(validTech);
    expect(result.name).toBe('Astro');
    expect(result.experienceYears).toBe(3);
  });

  it('[P1] 1.4-UNIT-015: rechaza experienceYears negativo', () => {
    const negativYears = {
      id: 'tech-1',
      name: 'Astro',
      image: { url: 'https://example.com/logo.webp', storagePath: 'tech/logo.webp' },
      experienceYears: -1,
    };
    expect(() => technologySchema.parse(negativYears)).toThrow();
  });

  it('[P1] 1.4-UNIT-016: rechaza experienceYears decimal', () => {
    const decimalYears = {
      id: 'tech-1',
      name: 'Astro',
      image: { url: 'https://example.com/logo.webp', storagePath: 'tech/logo.webp' },
      experienceYears: 2.5,
    };
    expect(() => technologySchema.parse(decimalYears)).toThrow();
  });

  it('[P1] 1.4-UNIT-017: rechaza name vacío', () => {
    const emptyName = {
      id: 'tech-1',
      name: '',
      image: { url: 'https://example.com/logo.webp', storagePath: 'tech/logo.webp' },
      experienceYears: 3,
    };
    expect(() => technologySchema.parse(emptyName)).toThrow();
  });
});

// ============================================================
// AC #4: experienceSchema
// ============================================================

describe('experienceSchema', () => {
  it('[P0] 1.4-UNIT-018: acepta datos válidos con endDate null (empleo actual)', () => {
    const validExperience = {
      id: 'exp-1',
      companyName: 'Empresa Demo',
      jobName: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },
      responsibilities: {
        es: ['Desarrollar features', 'Code review'],
        en: ['Develop features', 'Code review'],
      },
      startDate: new Date('2024-01-15'),
      endDate: null,
    };
    const result = experienceSchema.parse(validExperience);
    expect(result.endDate).toBeNull();
    expect(result.companyName).toBe('Empresa Demo');
  });

  it('[P1] 1.4-UNIT-019: acepta endDate como Date (empleo pasado)', () => {
    const pastJob = {
      id: 'exp-2',
      companyName: 'Empresa Anterior',
      jobName: { es: 'Dev Junior', en: 'Junior Dev' },
      responsibilities: { es: ['Tareas'], en: ['Tasks'] },
      startDate: new Date('2022-01-01'),
      endDate: new Date('2023-12-31'),
    };
    const result = experienceSchema.parse(pastJob);
    expect(result.endDate).toBeInstanceOf(Date);
  });

  it('[P1] 1.4-UNIT-020: rechaza endDate undefined (debe ser null o Date)', () => {
    const undefinedEndDate = {
      id: 'exp-3',
      companyName: 'Empresa',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: [], en: [] },
      startDate: new Date('2024-01-01'),
      // endDate ausente — debe fallar porque no es optional, es nullable
    };
    expect(() => experienceSchema.parse(undefinedEndDate)).toThrow();
  });

  it('[P1] 1.4-UNIT-021: startDate debe ser Date (rechaza string)', () => {
    const stringDate = {
      id: 'exp-4',
      companyName: 'Empresa',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: [], en: [] },
      startDate: '2024-01-15',
      endDate: null,
    };
    expect(() => experienceSchema.parse(stringDate)).toThrow();
  });
});

// ============================================================
// AC #5: blogPostSchema
// ============================================================

describe('blogPostSchema', () => {
  it('[P0] 1.4-UNIT-022: acepta datos válidos con status "published"', () => {
    const validPost = {
      id: 'post-1',
      title: { es: 'Post de ejemplo', en: 'Example post' },
      content: { es: '<p>Contenido</p>', en: '<p>Content</p>' },
      slug: 'post-de-ejemplo',
      coverImage: {
        url: 'https://example.com/blog/cover.webp',
        storagePath: 'blog/post/cover.webp',
      },
      images: [],
      status: 'published' as const,
      createdAt: new Date('2026-03-10'),
      updatedAt: new Date('2026-03-14'),
    };
    const result = blogPostSchema.parse(validPost);
    expect(result.status).toBe('published');
    expect(result.slug).toBe('post-de-ejemplo');
  });

  it('[P1] 1.4-UNIT-023: acepta status "draft"', () => {
    const draftPost = {
      id: 'post-2',
      title: { es: 'Borrador', en: 'Draft' },
      content: { es: '<p>WIP</p>', en: '<p>WIP</p>' },
      slug: 'borrador',
      coverImage: { url: 'https://example.com/cover.webp', storagePath: 'blog/cover.webp' },
      images: [],
      status: 'draft' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(() => blogPostSchema.parse(draftPost)).not.toThrow();
  });

  it('[P1] 1.4-UNIT-024: rechaza status inválido', () => {
    const invalidStatus = {
      id: 'post-3',
      title: { es: 'Post', en: 'Post' },
      content: { es: '<p>C</p>', en: '<p>C</p>' },
      slug: 'post',
      coverImage: { url: 'https://example.com/cover.webp', storagePath: 'blog/cover.webp' },
      images: [],
      status: 'archived',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(() => blogPostSchema.parse(invalidStatus)).toThrow();
  });

  it('[P1] 1.4-UNIT-025: images puede ser array vacío', () => {
    const postWithNoImages = {
      id: 'post-4',
      title: { es: 'Post', en: 'Post' },
      content: { es: '<p>C</p>', en: '<p>C</p>' },
      slug: 'post',
      coverImage: { url: 'https://example.com/cover.webp', storagePath: 'blog/cover.webp' },
      images: [],
      status: 'published' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(() => blogPostSchema.parse(postWithNoImages)).not.toThrow();

    const postWithImages = {
      ...postWithNoImages,
      images: [{ url: 'https://example.com/img.webp', storagePath: 'blog/img.webp' }],
    };
    expect(() => blogPostSchema.parse(postWithImages)).not.toThrow();
  });
});

// ============================================================
// AC #6: Tipos derivados z.infer<>
// ============================================================

describe('Tipos derivados z.infer<>', () => {
  it('[P0] 1.4-UNIT-026: tipos derivados compilan y parse() retorna objeto tipado', () => {
    const locale: Locale = localeSchema.parse('es');
    expect(locale).toBe('es');

    const locStr: LocalizedString = localizedString.parse({ es: 'Hola', en: 'Hello' });
    expect(locStr.es).toBe('Hola');

    const locArr: LocalizedStringArray = localizedStringArray.parse({ es: ['a'], en: ['b'] });
    expect(locArr.es).toEqual(['a']);

    const img: StoredImage = storedImageSchema.parse({
      url: 'https://example.com/img.webp',
      storagePath: 'path/img.webp',
    });
    expect(img.url).toContain('https://');

    // Verify entity types compile correctly
    const project: Project = projectSchema.parse({
      id: 'p1',
      companyName: { es: 'E', en: 'C' },
      shortDescription: { es: 'D', en: 'D' },
      features: { es: [], en: [] },
      mainImage: { url: 'https://example.com/i.webp', storagePath: 'p/i.webp' },
      screenshots: [],
      technologies: [],
      slug: 'test',
    });
    expect(project.id).toBe('p1');

    const tech: Technology = technologySchema.parse({
      id: 't1',
      name: 'Astro',
      image: { url: 'https://example.com/l.webp', storagePath: 't/l.webp' },
      experienceYears: 1,
    });
    expect(tech.name).toBe('Astro');

    const exp: Experience = experienceSchema.parse({
      id: 'e1',
      companyName: 'Co',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: [], en: [] },
      startDate: new Date(),
      endDate: null,
    });
    expect(exp.endDate).toBeNull();

    const post: BlogPost = blogPostSchema.parse({
      id: 'b1',
      title: { es: 'T', en: 'T' },
      content: { es: 'C', en: 'C' },
      slug: 'test',
      coverImage: { url: 'https://example.com/c.webp', storagePath: 'b/c.webp' },
      images: [],
      status: 'draft' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(post.status).toBe('draft');
  });
});

// ============================================================
// Code Review: Edge case hardening
// ============================================================

describe('localizedStringArray — edge cases', () => {
  it('[P1] 1.4-UNIT-033: rechaza strings vacíos dentro de arrays', () => {
    expect(() => localizedStringArray.parse({ es: ['Feature', ''], en: ['Feature', ''] })).toThrow();
    expect(() => localizedStringArray.parse({ es: [''], en: ['valid'] })).toThrow();
  });

  it('[P1] 1.4-UNIT-034: rechaza valores no-array', () => {
    expect(() => localizedStringArray.parse({ es: 'not-array', en: 'not-array' })).toThrow();
    expect(() => localizedStringArray.parse({ es: 42, en: 42 })).toThrow();
  });
});

describe('projectSchema — edge cases', () => {
  it('[P1] 1.4-UNIT-035: rechaza technology con string vacío', () => {
    const withEmptyTech = {
      id: 'p1',
      companyName: { es: 'E', en: 'C' },
      shortDescription: { es: 'D', en: 'D' },
      features: { es: [], en: [] },
      mainImage: { url: 'https://example.com/i.webp', storagePath: 'p/i.webp' },
      screenshots: [],
      technologies: ['astro', ''],
      slug: 'test',
    };
    expect(() => projectSchema.parse(withEmptyTech)).toThrow();
  });

  it('[P1] 1.4-UNIT-036: rechaza slug con formato inválido', () => {
    const base = {
      id: 'p1',
      companyName: { es: 'E', en: 'C' },
      shortDescription: { es: 'D', en: 'D' },
      features: { es: [], en: [] },
      mainImage: { url: 'https://example.com/i.webp', storagePath: 'p/i.webp' },
      screenshots: [],
      technologies: [],
    };
    expect(() => projectSchema.parse({ ...base, slug: 'UPPERCASE' })).toThrow();
    expect(() => projectSchema.parse({ ...base, slug: 'has spaces' })).toThrow();
    expect(() => projectSchema.parse({ ...base, slug: 'special!' })).toThrow();
    expect(() => projectSchema.parse({ ...base, slug: 'valid-slug' })).not.toThrow();
    expect(() => projectSchema.parse({ ...base, slug: 'test123' })).not.toThrow();
  });
});

describe('blogPostSchema — edge cases', () => {
  it('[P1] 1.4-UNIT-037: rechaza slug con formato inválido', () => {
    const base = {
      id: 'b1',
      title: { es: 'T', en: 'T' },
      content: { es: 'C', en: 'C' },
      coverImage: { url: 'https://example.com/c.webp', storagePath: 'b/c.webp' },
      images: [],
      status: 'published' as const,
      createdAt: new Date('2026-03-10'),
      updatedAt: new Date('2026-03-14'),
    };
    expect(() => blogPostSchema.parse({ ...base, slug: 'UPPER' })).toThrow();
    expect(() => blogPostSchema.parse({ ...base, slug: 'has spaces' })).toThrow();
    expect(() => blogPostSchema.parse({ ...base, slug: 'valid-slug' })).not.toThrow();
  });

  it('[P1] 1.4-UNIT-038: rechaza updatedAt < createdAt', () => {
    const badDates = {
      id: 'b1',
      title: { es: 'T', en: 'T' },
      content: { es: 'C', en: 'C' },
      slug: 'test',
      coverImage: { url: 'https://example.com/c.webp', storagePath: 'b/c.webp' },
      images: [],
      status: 'published' as const,
      createdAt: new Date('2026-03-14'),
      updatedAt: new Date('2026-03-10'),
    };
    expect(() => blogPostSchema.parse(badDates)).toThrow();
  });
});

describe('experienceSchema — edge cases', () => {
  it('[P1] 1.4-UNIT-039: rechaza endDate < startDate', () => {
    const badDates = {
      id: 'e1',
      companyName: 'Empresa',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: [], en: [] },
      startDate: new Date('2025-01-01'),
      endDate: new Date('2020-01-01'),
    };
    expect(() => experienceSchema.parse(badDates)).toThrow();
  });

  it('[P1] 1.4-UNIT-040: acepta endDate igual a startDate', () => {
    const sameDate = {
      id: 'e1',
      companyName: 'Empresa',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: [], en: [] },
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-01'),
    };
    expect(() => experienceSchema.parse(sameDate)).not.toThrow();
  });
});

describe('Schema type safety — wrong-type inputs', () => {
  it('[P2] 1.4-UNIT-041: schemas rechazan null, undefined, y tipos incorrectos', () => {
    expect(() => localeSchema.parse(null)).toThrow();
    expect(() => localeSchema.parse(undefined)).toThrow();
    expect(() => localeSchema.parse(42)).toThrow();

    expect(() => localizedString.parse(null)).toThrow();
    expect(() => localizedString.parse('string')).toThrow();
    expect(() => localizedString.parse(42)).toThrow();

    expect(() => storedImageSchema.parse(null)).toThrow();
    expect(() => storedImageSchema.parse('string')).toThrow();
  });
});
