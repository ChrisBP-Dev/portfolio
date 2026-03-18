import { describe, it, expect, vi } from 'vitest';
import {
  COLLECTION_PATHS,
  parseProject,
  parseTechnology,
  parseExperience,
  parseBlogPost,
  getAllTechnologies,
  getAllProjects,
  getAllExperiences,
} from '../collections';
import {
  createProject,
  createTechnology,
  createExperience,
  createBlogPost,
} from '../../../test/factories';

/** Creates a mock Firestore instance that returns the given docs for any collection query. */
function createMockDb(docs: Array<{ id: string; data: Record<string, unknown> }>) {
  const snapshot = {
    docs: docs.map((d) => ({ id: d.id, data: () => d.data })),
  };
  const query = {
    get: vi.fn().mockResolvedValue(snapshot),
    orderBy: vi.fn().mockReturnThis(),
  };
  return {
    collection: vi.fn().mockReturnValue(query),
    _query: query,
  };
}

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

  describe('getAllTechnologies', () => {
    it('[P0] 2.2-UNIT-001: returns parsed Technology[] from mock Firestore', async () => {
      const tech1 = createTechnology({ name: 'Flutter' });
      const tech2 = createTechnology({ name: 'Firebase' });
      const { id: id1, ...data1 } = tech1;
      const { id: id2, ...data2 } = tech2;
      const db = createMockDb([
        { id: id1, data: data1 as Record<string, unknown> },
        { id: id2, data: data2 as Record<string, unknown> },
      ]);

      const result = await getAllTechnologies(db as never);

      expect(result).toHaveLength(2);
      expect(result[0]!.name).toBe('Flutter');
      expect(result[1]!.name).toBe('Firebase');
      expect(db.collection).toHaveBeenCalledWith(COLLECTION_PATHS.technologies);
      expect(db._query.orderBy).toHaveBeenCalledWith('name');
    });

    it('[P1] 2.2-UNIT-002: returns empty array when no documents exist', async () => {
      const db = createMockDb([]);
      const result = await getAllTechnologies(db as never);
      expect(result).toEqual([]);
    });
  });

  describe('getAllProjects', () => {
    it('[P0] 2.2-UNIT-003: returns parsed Project[] from mock Firestore', async () => {
      const proj = createProject({ slug: 'test-proj' });
      const { id, ...data } = proj;
      const db = createMockDb([{ id, data: data as Record<string, unknown> }]);

      const result = await getAllProjects(db as never);

      expect(result).toHaveLength(1);
      expect(result[0]!.slug).toBe('test-proj');
      expect(db.collection).toHaveBeenCalledWith(COLLECTION_PATHS.projects);
    });
  });

  describe('getAllExperiences', () => {
    it('[P0] 2.2-UNIT-004: returns parsed Experience[] from mock Firestore', async () => {
      const exp = createExperience({ companyName: 'Acme Corp' });
      const { id, ...data } = exp;
      const db = createMockDb([{ id, data: data as Record<string, unknown> }]);

      const result = await getAllExperiences(db as never);

      expect(result).toHaveLength(1);
      expect(result[0]!.companyName).toBe('Acme Corp');
      expect(db.collection).toHaveBeenCalledWith(COLLECTION_PATHS.experiences);
      expect(db._query.orderBy).toHaveBeenCalledWith('startDate', 'desc');
    });
  });

  describe('toDate validation', () => {
    it('[P1] 1.10-UNIT-017: parseBlogPost() with invalid date string for createdAt throws descriptive error', () => {
      const { id, ...data } = createBlogPost();
      const invalidData = { ...data, createdAt: 'not-a-date' };
      expect(() => parseBlogPost(invalidData as Record<string, unknown>, id)).toThrow(
        'toDate: cannot parse date string "not-a-date"',
      );
    });

    it('[P1] 1.10-UNIT-018: parseExperience() with missing startDate throws descriptive error', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, startDate: _startDate, ...data } = createExperience();
      expect(() => parseExperience(data as Record<string, unknown>, id)).toThrow(
        'toDate: received undefined',
      );
    });
  });
});
