/**
 * ATDD Unit Tests — Story 1.4: Factory Validation con Zod Schemas
 *
 * TDD RED PHASE: Todos los tests usan it.skip() porque los schemas
 * y las factories actualizadas no están implementados aún.
 * Remover .skip() después de implementar schemas y actualizar factories.
 *
 * Cobertura: Factories producen datos válidos contra Zod schemas (AC implícito)
 */
import { describe, expect, it } from 'vitest';

// Estos imports fallarán hasta que schemas y factories se implementen
// import { projectSchema } from '../../../lib/schemas/project-schema';
// import { technologySchema } from '../../../lib/schemas/technology-schema';
// import { experienceSchema } from '../../../lib/schemas/experience-schema';
// import { blogPostSchema } from '../../../lib/schemas/blog-post-schema';
// import { createProject, createTechnology, createExperience, createBlogPost } from '../index';

// ============================================================
// Factory → Schema Validation (P0)
// ============================================================

describe('Factory → Schema Validation', () => {
  describe('createProject', () => {
    it.skip('[P0] 1.4-UNIT-027: createProject() pasa projectSchema.parse()', () => {
      // import { projectSchema } from '../../../lib/schemas/project-schema';
      // import { createProject } from '../index';
      //
      // const project = createProject();
      // expect(() => projectSchema.parse(project)).not.toThrow();
      //
      // const parsed = projectSchema.parse(project);
      // expect(parsed.id).toBeDefined();
      // expect(parsed.companyName.es).toBeDefined();
      // expect(parsed.companyName.en).toBeDefined();
      // expect(parsed.slug).toBeDefined();
    });
  });

  describe('createTechnology', () => {
    it.skip('[P0] 1.4-UNIT-028: createTechnology() pasa technologySchema.parse()', () => {
      // import { technologySchema } from '../../../lib/schemas/technology-schema';
      // import { createTechnology } from '../index';
      //
      // const tech = createTechnology();
      // expect(() => technologySchema.parse(tech)).not.toThrow();
      //
      // const parsed = technologySchema.parse(tech);
      // expect(parsed.name).toBeDefined();
      // expect(parsed.experienceYears).toBeGreaterThanOrEqual(0);
      // expect(Number.isInteger(parsed.experienceYears)).toBe(true);
    });
  });

  describe('createExperience', () => {
    it.skip('[P0] 1.4-UNIT-029: createExperience() pasa experienceSchema.parse()', () => {
      // import { experienceSchema } from '../../../lib/schemas/experience-schema';
      // import { createExperience } from '../index';
      //
      // const exp = createExperience();
      // expect(() => experienceSchema.parse(exp)).not.toThrow();
      //
      // const parsed = experienceSchema.parse(exp);
      // expect(parsed.companyName).toBeDefined();
      // expect(parsed.jobName.es).toBeDefined();
      // expect(parsed.startDate).toBeInstanceOf(Date);
      // expect(parsed.endDate).toBeNull(); // default = empleo actual
    });
  });

  describe('createBlogPost', () => {
    it.skip('[P0] 1.4-UNIT-030: createBlogPost() pasa blogPostSchema.parse()', () => {
      // import { blogPostSchema } from '../../../lib/schemas/blog-post-schema';
      // import { createBlogPost } from '../index';
      //
      // const post = createBlogPost();
      // expect(() => blogPostSchema.parse(post)).not.toThrow();
      //
      // const parsed = blogPostSchema.parse(post);
      // expect(parsed.title.es).toBeDefined();
      // expect(parsed.slug).toBeDefined();
      // expect(parsed.status).toBe('published');
      // expect(parsed.createdAt).toBeInstanceOf(Date);
      // expect(parsed.updatedAt).toBeInstanceOf(Date);
    });
  });
});

// ============================================================
// Factory Overrides (P2)
// ============================================================

describe('Factory Overrides', () => {
  it.skip('[P2] 1.4-UNIT-031: cada factory acepta y aplica overrides', () => {
    // import { projectSchema } from '../../../lib/schemas/project-schema';
    // import { technologySchema } from '../../../lib/schemas/technology-schema';
    // import { experienceSchema } from '../../../lib/schemas/experience-schema';
    // import { blogPostSchema } from '../../../lib/schemas/blog-post-schema';
    // import { createProject, createTechnology, createExperience, createBlogPost } from '../index';
    //
    // // Project overrides
    // const project = createProject({ slug: 'custom-slug' });
    // expect(project.slug).toBe('custom-slug');
    // expect(() => projectSchema.parse(project)).not.toThrow();
    //
    // // Technology overrides
    // const tech = createTechnology({ name: 'Svelte', experienceYears: 5 });
    // expect(tech.name).toBe('Svelte');
    // expect(tech.experienceYears).toBe(5);
    // expect(() => technologySchema.parse(tech)).not.toThrow();
    //
    // // Experience overrides
    // const endDate = new Date('2025-06-01');
    // const exp = createExperience({ endDate });
    // expect(exp.endDate).toBe(endDate);
    // expect(() => experienceSchema.parse(exp)).not.toThrow();
    //
    // // BlogPost overrides
    // const post = createBlogPost({ status: 'draft' });
    // expect(post.status).toBe('draft');
    // expect(() => blogPostSchema.parse(post)).not.toThrow();
  });
});

// ============================================================
// Factory Unique IDs (P2)
// ============================================================

describe('Factory Unique IDs', () => {
  it.skip('[P2] 1.4-UNIT-032: cada factory genera IDs únicos', () => {
    // import { createProject, createTechnology, createExperience, createBlogPost } from '../index';
    //
    // const projectA = createProject();
    // const projectB = createProject();
    // expect(projectA.id).not.toBe(projectB.id);
    //
    // const techA = createTechnology();
    // const techB = createTechnology();
    // expect(techA.id).not.toBe(techB.id);
    //
    // const expA = createExperience();
    // const expB = createExperience();
    // expect(expA.id).not.toBe(expB.id);
    //
    // const postA = createBlogPost();
    // const postB = createBlogPost();
    // expect(postA.id).not.toBe(postB.id);
  });
});
