import { describe, it, expect } from 'vitest';
import {
  COLLECTION_PATHS,
  parseProject,
  parseTechnology,
  parseExperience,
  parseBlogPost,
} from '../collections';
import {
  createProject,
  createTechnology,
  createExperience,
  createBlogPost,
} from '../../../test/factories';

describe('Firebase Collections', () => {
  describe('COLLECTION_PATHS', () => {
    it('[P0] 1.10-UNIT-001: COLLECTION_PATHS has exactly 4 entries with correct Firestore collection names', () => {
      expect(Object.keys(COLLECTION_PATHS)).toHaveLength(4);
      expect(COLLECTION_PATHS.projects).toBe('Projects');
      expect(COLLECTION_PATHS.technologies).toBe('Technologies');
      expect(COLLECTION_PATHS.experiences).toBe('Experiences');
      expect(COLLECTION_PATHS.blogPosts).toBe('BlogPosts');
    });
  });

  describe('parseProject', () => {
    it('[P0] 1.10-UNIT-002: parseProject() with valid factory data returns typed Project', () => {
      const { id, ...data } = createProject();
      const result = parseProject(data as Record<string, unknown>, id);
      expect(result.id).toBe(id);
      expect(result.companyName.es).toBe('Empresa Demo');
      expect(result.slug).toBe('proyecto-demo');
    });

    it('[P1] 1.10-UNIT-003: parseProject() with missing required field throws ZodError', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, slug: _slug, ...data } = createProject();
      expect(() => parseProject(data as Record<string, unknown>, id)).toThrow();
    });
  });

  describe('parseTechnology', () => {
    it('[P0] 1.10-UNIT-004: parseTechnology() with valid factory data returns typed Technology', () => {
      const { id, ...data } = createTechnology();
      const result = parseTechnology(data as Record<string, unknown>, id);
      expect(result.id).toBe(id);
      expect(result.name).toBe('Astro');
      expect(result.experienceYears).toBe(3);
    });
  });

  describe('parseExperience', () => {
    it('[P0] 1.10-UNIT-005: parseExperience() with valid factory data (endDate null) returns typed Experience', () => {
      const { id, ...data } = createExperience();
      const result = parseExperience(data as Record<string, unknown>, id);
      expect(result.id).toBe(id);
      expect(result.endDate).toBeNull();
      expect(result.startDate).toBeInstanceOf(Date);
    });

    it('[P0] 1.10-UNIT-006: parseExperience() with Firestore-like Timestamp mock converts correctly', () => {
      const original = createExperience({
        endDate: new Date('2025-06-01'),
      });
      const { id, startDate, endDate, ...rest } = original;
      const data = {
        ...rest,
        startDate: { toDate: () => startDate },
        endDate: { toDate: () => endDate },
      };
      const result = parseExperience(data as Record<string, unknown>, id);
      expect(result.startDate).toEqual(startDate);
      expect(result.endDate).toEqual(endDate);
    });

    it('[P1] 1.10-UNIT-007: parseExperience() with endDate < startDate throws', () => {
      const { id, ...data } = createExperience({
        startDate: new Date('2025-06-01'),
        endDate: new Date('2024-01-01'),
      });
      expect(() => parseExperience(data as Record<string, unknown>, id)).toThrow();
    });
  });

  describe('parseBlogPost', () => {
    it('[P0] 1.10-UNIT-008: parseBlogPost() with valid factory data returns typed BlogPost', () => {
      const { id, ...data } = createBlogPost();
      const result = parseBlogPost(data as Record<string, unknown>, id);
      expect(result.id).toBe(id);
      expect(result.status).toBe('published');
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('[P0] 1.10-UNIT-009: parseBlogPost() with Timestamp mocks for createdAt/updatedAt converts correctly', () => {
      const original = createBlogPost();
      const { id, createdAt, updatedAt, ...rest } = original;
      const data = {
        ...rest,
        createdAt: { toDate: () => createdAt },
        updatedAt: { toDate: () => updatedAt },
      };
      const result = parseBlogPost(data as Record<string, unknown>, id);
      expect(result.createdAt).toEqual(createdAt);
      expect(result.updatedAt).toEqual(updatedAt);
    });

    it('[P1] 1.10-UNIT-010: parseBlogPost() with updatedAt < createdAt throws', () => {
      const { id, ...data } = createBlogPost({
        createdAt: new Date('2026-06-01'),
        updatedAt: new Date('2026-01-01'),
      });
      expect(() => parseBlogPost(data as Record<string, unknown>, id)).toThrow();
    });
  });
});
