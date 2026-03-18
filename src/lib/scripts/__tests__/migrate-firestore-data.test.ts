import { describe, it, expect } from 'vitest';
import {
  slugify,
  parseDateRange,
  parseExperienceYears,
  transformImageAndPath,
  migrateProject,
  migrateTechnology,
  migrateExperience,
  isAlreadyMigrated,
} from '../migrate-firestore-data';
import { projectSchema } from '../../schemas/project-schema';
import { technologySchema } from '../../schemas/technology-schema';
import { experienceSchema } from '../../schemas/experience-schema';

// --- Flutter-shaped test data (OLD schema) ---

function makeFlutterProject(overrides: Record<string, unknown> = {}) {
  return {
    companyNameEs: 'Mi Empresa',
    companyNameEn: 'My Company',
    shortDescriptionEs: 'Descripcion corta',
    shortDescriptionEn: 'Short description',
    featuresES: ['Feature uno', 'Feature dos'],
    featuresEN: ['Feature one', 'Feature two'],
    mainImage: {
      url: 'https://storage.example.com/main.png',
      localImage: '/local/path.png',
      refPath: 'projects/main.png',
    },
    screenshots: [
      {
        url: 'https://storage.example.com/shot1.png',
        localImage: '/local/shot1.png',
        refPath: 'projects/shot1.png',
      },
    ],
    technologies: ['tech-1', 'tech-2'],
    websiteUrl: 'https://example.com',
    sourceCodeUrl: 'https://github.com/example',
    ...overrides,
  };
}

function makeFlutterTechnology(overrides: Record<string, unknown> = {}) {
  return {
    name: 'React',
    image: {
      url: 'https://storage.example.com/react.png',
      localImage: '/local/react.png',
      refPath: 'technologies/react.png',
    },
    experienceTime: '3+',
    ...overrides,
  };
}

function makeFlutterExperience(overrides: Record<string, unknown> = {}) {
  return {
    companyName: 'Acme Corp',
    jobNameEs: 'Desarrollador Senior',
    jobNameEn: 'Senior Developer',
    responsabilitiesEs: ['Disenar sistemas', 'Liderar equipo'],
    responsabilitiesEn: ['Design systems', 'Lead team'],
    date: 'Jan 2024 - Present',
    ...overrides,
  };
}

// --- slugify ---

describe('slugify', () => {
  it('converts basic text to slug', () => {
    expect(slugify('My Company')).toBe('my-company');
  });

  it('removes accents and diacritics', () => {
    expect(slugify('Cafe Résumé')).toBe('cafe-resume');
  });

  it('handles special characters', () => {
    expect(slugify('Hello & World! @2024')).toBe('hello-world-2024');
  });

  it('handles leading/trailing special chars', () => {
    expect(slugify('--My Company--')).toBe('my-company');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a   b   c')).toBe('a-b-c');
  });

  it('handles Spanish characters', () => {
    expect(slugify('Compania Espanola')).toBe('compania-espanola');
    expect(slugify('Ninos Felices')).toBe('ninos-felices');
  });

  it('produces valid slug pattern', () => {
    const slug = slugify('Cafe & Bar @#$ 2024');
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });
});

// --- parseDateRange ---

describe('parseDateRange', () => {
  it('parses "Month Year - Present" format', () => {
    const result = parseDateRange('Jan 2024 - Present');
    expect(result.startDate).toBeInstanceOf(Date);
    expect(result.startDate.getFullYear()).toBe(2024);
    expect(result.startDate.getMonth()).toBe(0); // January
    expect(result.endDate).toBeNull();
  });

  it('parses "Month Year - Month Year" format', () => {
    const result = parseDateRange('Mar 2022 - Dec 2023');
    expect(result.startDate.getFullYear()).toBe(2022);
    expect(result.startDate.getMonth()).toBe(2); // March
    expect(result.endDate).toBeInstanceOf(Date);
    expect(result.endDate!.getFullYear()).toBe(2023);
    expect(result.endDate!.getMonth()).toBe(11); // December
  });

  it('handles em-dash (U+2013)', () => {
    const result = parseDateRange('2022 \u2013 2022');
    expect(result.startDate.getFullYear()).toBe(2022);
    expect(result.endDate).toBeInstanceOf(Date);
    expect(result.endDate!.getFullYear()).toBe(2022);
  });

  it('handles en-dash (U+2014)', () => {
    const result = parseDateRange('Jan 2021 \u2014 Dec 2021');
    expect(result.startDate.getFullYear()).toBe(2021);
    expect(result.endDate!.getFullYear()).toBe(2021);
  });

  it('endDate >= startDate for valid ranges', () => {
    const result = parseDateRange('Jan 2020 - Dec 2023');
    expect(result.endDate!.getTime()).toBeGreaterThanOrEqual(result.startDate.getTime());
  });

  it('returns fallback dates for unparseable strings', () => {
    const result = parseDateRange('invalid date string');
    // Should not throw, should return some dates
    expect(result.startDate).toBeInstanceOf(Date);
  });
});

// --- parseExperienceYears ---

describe('parseExperienceYears', () => {
  it('parses "2+"', () => {
    expect(parseExperienceYears('2+')).toBe(2);
  });

  it('parses "3 years"', () => {
    expect(parseExperienceYears('3 years')).toBe(3);
  });

  it('parses "over 2 years"', () => {
    expect(parseExperienceYears('over 2 years')).toBe(2);
  });

  it('returns 0 for no number found', () => {
    expect(parseExperienceYears('many')).toBe(0);
  });

  it('parses first number only', () => {
    expect(parseExperienceYears('2-3 years')).toBe(2);
  });
});

// --- transformImageAndPath ---

describe('transformImageAndPath', () => {
  it('drops localImage and renames refPath to storagePath', () => {
    const result = transformImageAndPath({
      url: 'https://storage.example.com/img.png',
      localImage: '/local/path.png',
      refPath: 'images/img.png',
    });
    expect(result).toEqual({
      url: 'https://storage.example.com/img.png',
      storagePath: 'images/img.png',
    });
    expect(result).not.toHaveProperty('localImage');
    expect(result).not.toHaveProperty('refPath');
  });
});

// --- migrateProject ---

describe('migrateProject', () => {
  it('transforms Flutter project to new schema', () => {
    const flutterData = makeFlutterProject();
    const result = migrateProject(flutterData);

    expect(result.companyName).toEqual({ es: 'Mi Empresa', en: 'My Company' });
    expect(result.shortDescription).toEqual({ es: 'Descripcion corta', en: 'Short description' });
    expect(result.features).toEqual({
      es: ['Feature uno', 'Feature dos'],
      en: ['Feature one', 'Feature two'],
    });
    expect(result.mainImage).toEqual({
      url: 'https://storage.example.com/main.png',
      storagePath: 'projects/main.png',
    });
    expect(result.screenshots).toHaveLength(1);
    expect(result.screenshots[0]).toEqual({
      url: 'https://storage.example.com/shot1.png',
      storagePath: 'projects/shot1.png',
    });
    expect(result.slug).toBe('my-company');
    expect(result.technologies).toEqual(['tech-1', 'tech-2']);
    expect(result.websiteUrl).toBe('https://example.com');
    expect(result.sourceCodeUrl).toBe('https://github.com/example');
  });

  it('passes Zod projectSchema validation', () => {
    const flutterData = makeFlutterProject();
    const result = migrateProject(flutterData);
    const parsed = projectSchema.safeParse({ ...result, id: 'test-id' });
    expect(parsed.success).toBe(true);
  });

  it('sanitizes invalid websiteUrl to undefined', () => {
    const flutterData = makeFlutterProject({ websiteUrl: 'source-code' });
    const result = migrateProject(flutterData);
    expect(result.websiteUrl).toBeUndefined();
  });

  it('sanitizes invalid sourceCodeUrl to undefined', () => {
    const flutterData = makeFlutterProject({ sourceCodeUrl: 'not-a-url' });
    const result = migrateProject(flutterData);
    expect(result.sourceCodeUrl).toBeUndefined();
  });

  it('handles empty screenshots array', () => {
    const flutterData = makeFlutterProject({ screenshots: [] });
    const result = migrateProject(flutterData);
    expect(result.screenshots).toEqual([]);
  });

  it('includes FieldValue.delete() markers for old fields', () => {
    const flutterData = makeFlutterProject();
    const result = migrateProject(flutterData);
    expect(result._deletions).toContain('companyNameEs');
    expect(result._deletions).toContain('companyNameEn');
    expect(result._deletions).toContain('shortDescriptionEs');
    expect(result._deletions).toContain('shortDescriptionEn');
    expect(result._deletions).toContain('featuresES');
    expect(result._deletions).toContain('featuresEN');
  });
});

// --- migrateTechnology ---

describe('migrateTechnology', () => {
  it('transforms Flutter technology to new schema', () => {
    const flutterData = makeFlutterTechnology();
    const result = migrateTechnology(flutterData);

    expect(result.name).toBe('React');
    expect(result.image).toEqual({
      url: 'https://storage.example.com/react.png',
      storagePath: 'technologies/react.png',
    });
    expect(result.experienceYears).toBe(3);
  });

  it('passes Zod technologySchema validation', () => {
    const flutterData = makeFlutterTechnology();
    const result = migrateTechnology(flutterData);
    const parsed = technologySchema.safeParse({ ...result, id: 'test-id' });
    expect(parsed.success).toBe(true);
  });

  it('parses "over 2 years" experience correctly', () => {
    const flutterData = makeFlutterTechnology({ experienceTime: 'over 2 years' });
    const result = migrateTechnology(flutterData);
    expect(result.experienceYears).toBe(2);
  });

  it('includes FieldValue.delete() markers for old fields', () => {
    const flutterData = makeFlutterTechnology();
    const result = migrateTechnology(flutterData);
    expect(result._deletions).toContain('experienceTime');
  });
});

// --- migrateExperience ---

describe('migrateExperience', () => {
  it('transforms Flutter experience to new schema', () => {
    const flutterData = makeFlutterExperience();
    const result = migrateExperience(flutterData);

    expect(result.companyName).toBe('Acme Corp');
    expect(result.jobName).toEqual({ es: 'Desarrollador Senior', en: 'Senior Developer' });
    expect(result.responsibilities).toEqual({
      es: ['Disenar sistemas', 'Liderar equipo'],
      en: ['Design systems', 'Lead team'],
    });
    expect(result.startDate).toBeInstanceOf(Date);
    expect(result.endDate).toBeNull();
  });

  it('passes Zod experienceSchema validation', () => {
    const flutterData = makeFlutterExperience();
    const result = migrateExperience(flutterData);
    const parsed = experienceSchema.safeParse({ ...result, id: 'test-id' });
    expect(parsed.success).toBe(true);
  });

  it('parses date with endDate correctly', () => {
    const flutterData = makeFlutterExperience({ date: 'Mar 2022 - Dec 2023' });
    const result = migrateExperience(flutterData);
    expect(result.startDate.getFullYear()).toBe(2022);
    expect(result.endDate).toBeInstanceOf(Date);
    expect(result.endDate!.getFullYear()).toBe(2023);
  });

  it('includes FieldValue.delete() markers for old fields', () => {
    const flutterData = makeFlutterExperience();
    const result = migrateExperience(flutterData);
    expect(result._deletions).toContain('jobNameEs');
    expect(result._deletions).toContain('jobNameEn');
    expect(result._deletions).toContain('responsabilitiesEs');
    expect(result._deletions).toContain('responsabilitiesEn');
    expect(result._deletions).toContain('date');
  });

  it('filters empty strings from responsibilities arrays', () => {
    const flutterData = makeFlutterExperience({
      responsabilitiesEs: ['Disenar sistemas', '', 'Liderar equipo'],
      responsabilitiesEn: ['Design systems', '', 'Lead team'],
    });
    const result = migrateExperience(flutterData);
    expect(result.responsibilities.es).toEqual(['Disenar sistemas', 'Liderar equipo']);
    expect(result.responsibilities.en).toEqual(['Design systems', 'Lead team']);
  });
});

// --- isAlreadyMigrated ---

describe('isAlreadyMigrated', () => {
  it('detects migrated Project by nested companyName', () => {
    expect(isAlreadyMigrated({ companyName: { es: 'a', en: 'b' } }, 'Projects')).toBe(true);
  });

  it('detects non-migrated Project by string companyNameEs', () => {
    expect(isAlreadyMigrated({ companyNameEs: 'a', companyNameEn: 'b' }, 'Projects')).toBe(false);
  });

  it('detects migrated Technology by experienceYears number', () => {
    expect(isAlreadyMigrated({ experienceYears: 3 }, 'Technologies')).toBe(true);
  });

  it('detects non-migrated Technology by experienceTime string', () => {
    expect(isAlreadyMigrated({ experienceTime: '3+' }, 'Technologies')).toBe(false);
  });

  it('detects migrated Experience by nested jobName', () => {
    expect(isAlreadyMigrated({ jobName: { es: 'a', en: 'b' } }, 'Experiences')).toBe(true);
  });

  it('detects non-migrated Experience by string jobNameEs', () => {
    expect(isAlreadyMigrated({ jobNameEs: 'a', jobNameEn: 'b' }, 'Experiences')).toBe(false);
  });

  it('returns false for unknown collection', () => {
    expect(isAlreadyMigrated({}, 'Unknown')).toBe(false);
  });
});
