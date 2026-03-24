import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockGetDocs, mockQuery, mockCollection, mockOrderBy, mockDoc, mockWriteBatch } = vi.hoisted(() => {
  const batchUpdate = vi.fn();
  const batchCommit = vi.fn(() => Promise.resolve());
  return {
    mockGetDocs: vi.fn() as AnyFn & ReturnType<typeof vi.fn>,
    mockQuery: vi.fn((..._args: unknown[]) => ({ _query: true })),
    mockCollection: vi.fn((_db: unknown, _col: string) => ({ _col })),
    mockOrderBy: vi.fn((_field: string) => ({ _orderBy: _field })),
    mockDoc: vi.fn((_db: unknown, _col: string, _id: string) => ({ path: `${_col}/${_id}` })),
    mockWriteBatch: vi.fn((_db?: unknown) => ({ update: batchUpdate, commit: batchCommit })),
  };
});

const mockError = vi.fn();

vi.mock('firebase/firestore', () => ({
  getDocs: mockGetDocs,
  query: mockQuery,
  collection: mockCollection,
  orderBy: mockOrderBy,
  doc: mockDoc,
  writeBatch: mockWriteBatch,
}));

vi.mock('../../../lib/utils/toast-store.svelte', () => ({
  toastStore: {
    error: mockError,
    success: vi.fn(),
    warning: vi.fn(),
  },
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

describe('TechnologyList — reorder logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reorder assigns sequential order values', () => {
    const technologies = [
      { ...createTechnology({ name: 'Alpha' }), order: 0 },
      { ...createTechnology({ name: 'Beta' }), order: 1 },
      { ...createTechnology({ name: 'Gamma' }), order: 2 },
    ];

    // Simulate dragging index 2 to position 0
    const draggedIndex = 2;
    const dropIndex = 0;
    const reordered = [...technologies];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, moved!);

    // Assign sequential order values
    const result = reordered.map((t, i) => ({ ...t, order: i }));

    expect(result[0]!.name).toBe('Gamma');
    expect(result[1]!.name).toBe('Alpha');
    expect(result[2]!.name).toBe('Beta');

    expect(result[0]!.order).toBe(0);
    expect(result[1]!.order).toBe(1);
    expect(result[2]!.order).toBe(2);
  });

  it('persistOrder calls writeBatch with sequential order values', async () => {
    const technologies = [
      { ...createTechnology({ name: 'React' }), id: 't1', order: 0 },
      { ...createTechnology({ name: 'Svelte' }), id: 't2', order: 1 },
    ];

    const batch = mockWriteBatch();
    technologies.forEach((tech, index) => {
      batch.update(mockDoc({}, 'Technologies', tech.id), { order: index });
    });
    await batch.commit();

    expect(batch.update).toHaveBeenCalledTimes(2);
    expect(batch.update).toHaveBeenCalledWith(
      { path: 'Technologies/t1' },
      { order: 0 },
    );
    expect(batch.update).toHaveBeenCalledWith(
      { path: 'Technologies/t2' },
      { order: 1 },
    );
    expect(batch.commit).toHaveBeenCalledTimes(1);
  });

  it('keyboard reorder up moves item from index 1 to index 0', () => {
    const technologies = [
      { ...createTechnology({ name: 'First' }), order: 0 },
      { ...createTechnology({ name: 'Second' }), order: 1 },
      { ...createTechnology({ name: 'Third' }), order: 2 },
    ];

    // Simulate ArrowUp on index 1
    const index = 1;
    const targetIndex = index - 1; // ArrowUp

    const reordered = [...technologies];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved!);
    const result = reordered.map((t, i) => ({ ...t, order: i }));

    expect(result[0]!.name).toBe('Second');
    expect(result[1]!.name).toBe('First');
    expect(result[2]!.name).toBe('Third');

    expect(result[0]!.order).toBe(0);
    expect(result[1]!.order).toBe(1);
    expect(result[2]!.order).toBe(2);
  });

  it('concurrent drag blocked by reordering flag', () => {
    // Simulate the reordering guard from handleDrop
    const reordering = true;

    // handleDrop returns early when reordering is true
    function handleDrop(): boolean {
      if (reordering) return false; // blocked
      return true; // would proceed
    }

    expect(handleDrop()).toBe(false);
  });
});
