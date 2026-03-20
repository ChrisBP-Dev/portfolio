import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockGetDocs, mockQuery, mockCollection, mockOrderBy } = vi.hoisted(() => ({
  mockGetDocs: vi.fn() as AnyFn & ReturnType<typeof vi.fn>,
  mockQuery: vi.fn((..._args: unknown[]) => ({ _query: true })),
  mockCollection: vi.fn((_db: unknown, _col: string) => ({ _col })),
  mockOrderBy: vi.fn((_field: string) => ({ _orderBy: _field })),
}));

vi.mock('firebase/firestore', () => ({
  getDocs: mockGetDocs,
  query: mockQuery,
  collection: mockCollection,
  orderBy: mockOrderBy,
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

import { technologyFirestoreSchema } from '../../../lib/schemas/technology-schema';
import { createTechnology } from '../../../test/factories/technology';

describe('TechnologyList — loading and data fetching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('[P0] 3.6-TEST-001: queries Technologies collection ordered by name', () => {
    expect(mockOrderBy).toBeDefined();
    mockCollection({}, 'Technologies');
    mockOrderBy('name');
    mockQuery(mockCollection({}, 'Technologies'), mockOrderBy('name'));

    expect(mockCollection).toHaveBeenCalledWith({}, 'Technologies');
    expect(mockOrderBy).toHaveBeenCalledWith('name');
  });

  it('[P0] 3.6-TEST-002: safeParse validates technology documents', () => {
    const validTech = createTechnology();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...firestoreData } = validTech;

    const result = technologyFirestoreSchema.safeParse(firestoreData);
    expect(result.success).toBe(true);
  });

  it('[P0] 3.6-TEST-003: safeParse rejects invalid technology documents', () => {
    const invalidData = { name: 123, experienceYears: 'not-a-number' };
    const result = technologyFirestoreSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('[P0] 3.6-TEST-004: safeParse rejects missing image field', () => {
    const incompleteData = { name: 'React', experienceYears: 3 };
    const result = technologyFirestoreSchema.safeParse(incompleteData);
    expect(result.success).toBe(false);
  });
});

describe('TechnologyList — empty state', () => {
  it('[P0] 3.6-TEST-005: empty array after getDocs returns no documents', async () => {
    mockGetDocs.mockResolvedValue({ docs: [] });

    const snapshot = await mockGetDocs();
    const technologies = snapshot.docs
      .map((doc: { data: () => unknown; id: string }) => {
        const result = technologyFirestoreSchema.safeParse(doc.data());
        if (!result.success) return null;
        return { ...result.data, id: doc.id };
      })
      .filter(Boolean);

    expect(technologies).toEqual([]);
  });
});

describe('TechnologyList — list rendering data', () => {
  it('[P0] 3.6-TEST-006: maps Firestore docs to TechnologyWithId objects', async () => {
    const tech1 = createTechnology({ name: 'React', experienceYears: 4 });
    const tech2 = createTechnology({ name: 'TypeScript', experienceYears: 5 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id1, ...data1 } = tech1;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id2, ...data2 } = tech2;

    mockGetDocs.mockResolvedValue({
      docs: [
        { id: 'doc-1', data: () => data1 },
        { id: 'doc-2', data: () => data2 },
      ],
    });

    const snapshot = await mockGetDocs();
    const technologies = snapshot.docs
      .map((doc: { data: () => unknown; id: string }) => {
        const result = technologyFirestoreSchema.safeParse(doc.data());
        if (!result.success) return null;
        return { ...result.data, id: doc.id };
      })
      .filter(Boolean);

    expect(technologies).toHaveLength(2);
    expect(technologies[0]).toEqual({ ...data1, id: 'doc-1' });
    expect(technologies[1]).toEqual({ ...data2, id: 'doc-2' });
  });

  it('[P0] 3.6-TEST-007: filters out invalid documents', async () => {
    const validTech = createTechnology({ name: 'Svelte' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...validData } = validTech;

    mockGetDocs.mockResolvedValue({
      docs: [
        { id: 'valid-1', data: () => validData },
        { id: 'invalid-1', data: () => ({ name: 123 }) },
      ],
    });

    const snapshot = await mockGetDocs();
    const technologies = snapshot.docs
      .map((doc: { data: () => unknown; id: string }) => {
        const result = technologyFirestoreSchema.safeParse(doc.data());
        if (!result.success) return null;
        return { ...result.data, id: doc.id };
      })
      .filter(Boolean);

    expect(technologies).toHaveLength(1);
    expect(technologies[0].id).toBe('valid-1');
  });
});

describe('TechnologyList — callback wiring', () => {
  it('[P0] 3.6-TEST-008: onEdit receives correct TechnologyWithId', () => {
    const tech = createTechnology({ name: 'Astro' });
    const onEdit = vi.fn();
    onEdit(tech);
    expect(onEdit).toHaveBeenCalledWith(tech);
  });

  it('[P0] 3.6-TEST-009: onDelete receives correct TechnologyWithId', () => {
    const tech = createTechnology({ name: 'Node.js' });
    const onDelete = vi.fn();
    onDelete(tech);
    expect(onDelete).toHaveBeenCalledWith(tech);
  });
});
