import { describe, expect, it } from 'vitest';
import { createProject, createTechnology, createExperience, createBlogPost } from '../index';

describe('Test Data Factories', () => {
  describe('createProject', () => {
    it('returns a valid Project with all required fields', () => {
      const project = createProject();

      expect(project.id).toBeDefined();
      expect(project.title.es).toBeDefined();
      expect(project.title.en).toBeDefined();
      expect(project.description.es).toBeDefined();
      expect(project.description.en).toBeDefined();
      expect(project.shortDescription.es).toBeDefined();
      expect(project.shortDescription.en).toBeDefined();
      expect(Array.isArray(project.technologies)).toBe(true);
      expect(Array.isArray(project.imageSlots)).toBe(true);
      expect(project.links).toBeDefined();
      expect(typeof project.featured).toBe('boolean');
      expect(typeof project.order).toBe('number');
      expect(project.createdAt).toBeInstanceOf(Date);
      expect(project.updatedAt).toBeInstanceOf(Date);
    });

    it('accepts overrides', () => {
      const project = createProject({ featured: true, order: 5 });

      expect(project.featured).toBe(true);
      expect(project.order).toBe(5);
    });

    it('generates unique IDs', () => {
      const a = createProject();
      const b = createProject();

      expect(a.id).not.toBe(b.id);
    });
  });

  describe('createTechnology', () => {
    it('returns a valid Technology with all required fields', () => {
      const tech = createTechnology();

      expect(tech.id).toBeDefined();
      expect(typeof tech.name).toBe('string');
      expect(typeof tech.icon).toBe('string');
      expect(typeof tech.category).toBe('string');
      expect(typeof tech.order).toBe('number');
    });

    it('accepts overrides', () => {
      const tech = createTechnology({ name: 'Svelte', category: 'ui' });

      expect(tech.name).toBe('Svelte');
      expect(tech.category).toBe('ui');
    });
  });

  describe('createExperience', () => {
    it('returns a valid Experience with all required fields', () => {
      const exp = createExperience();

      expect(exp.id).toBeDefined();
      expect(exp.company.es).toBeDefined();
      expect(exp.company.en).toBeDefined();
      expect(exp.position.es).toBeDefined();
      expect(exp.position.en).toBeDefined();
      expect(exp.description.es).toBeDefined();
      expect(exp.description.en).toBeDefined();
      expect(exp.startDate).toBeInstanceOf(Date);
      expect(typeof exp.current).toBe('boolean');
      expect(Array.isArray(exp.technologies)).toBe(true);
      expect(typeof exp.order).toBe('number');
    });

    it('accepts overrides', () => {
      const endDate = new Date(2025, 6, 1);
      const exp = createExperience({ current: false, endDate });

      expect(exp.current).toBe(false);
      expect(exp.endDate).toBe(endDate);
    });
  });

  describe('createBlogPost', () => {
    it('returns a valid BlogPost with all required fields', () => {
      const post = createBlogPost();

      expect(post.id).toBeDefined();
      expect(post.title.es).toBeDefined();
      expect(post.title.en).toBeDefined();
      expect(typeof post.slug).toBe('string');
      expect(post.content.es).toBeDefined();
      expect(post.content.en).toBeDefined();
      expect(post.excerpt.es).toBeDefined();
      expect(post.excerpt.en).toBeDefined();
      expect(Array.isArray(post.tags)).toBe(true);
      expect(typeof post.published).toBe('boolean');
      expect(post.createdAt).toBeInstanceOf(Date);
      expect(post.updatedAt).toBeInstanceOf(Date);
    });

    it('accepts overrides', () => {
      const post = createBlogPost({ published: false, publishedAt: null, tags: ['astro'] });

      expect(post.published).toBe(false);
      expect(post.publishedAt).toBeNull();
      expect(post.tags).toEqual(['astro']);
    });
  });
});
