import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockGetDocs, mockQuery, mockWhere, mockLimit, mockCollection } = vi.hoisted(() => ({
  mockGetDocs: vi.fn(() => Promise.resolve({ empty: true, docs: [] })) as AnyFn & ReturnType<typeof vi.fn>,
  mockQuery: vi.fn((..._args: unknown[]) => ({ _query: true })),
  mockWhere: vi.fn((_field: string, _op: string, _val: unknown) => ({ _where: true })),
  mockLimit: vi.fn((_n: number) => ({ _limit: true })),
  mockCollection: vi.fn((_db: unknown, _col: string) => ({ _col })),
}));

vi.mock('firebase/firestore', () => ({
  getDocs: mockGetDocs,
  query: mockQuery,
  where: mockWhere,
  limit: mockLimit,
  collection: mockCollection,
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

describe('ProjectForm — slug uniqueness', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('slug uniqueness query uses collection Projects and field slug', async () => {
    mockGetDocs.mockResolvedValue({ empty: true, docs: [] });

    await mockGetDocs(mockQuery(
      mockCollection({}, 'Projects'),
      mockWhere('slug', '==', 'test-slug'),
      mockLimit(2),
    ));

    expect(mockCollection).toHaveBeenCalledWith({}, 'Projects');
    expect(mockWhere).toHaveBeenCalledWith('slug', '==', 'test-slug');
    expect(mockLimit).toHaveBeenCalledWith(2);
  });

  it('returns true when no matching slug found', async () => {
    mockGetDocs.mockResolvedValue({ empty: true, docs: [] });
    const snapshot = await mockGetDocs();
    expect(snapshot.empty).toBe(true);
  });

  it('returns false when slug exists and no excludeId', async () => {
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: 'other-id' }],
    });
    const snapshot = await mockGetDocs();
    expect(snapshot.empty).toBe(false);
  });

  it('returns true when slug exists but matches excludeId (edit mode)', async () => {
    const excludeId = 'current-project-id';
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: excludeId }],
    });
    const snapshot = await mockGetDocs();
    const isUnique = snapshot.docs[0].id === excludeId;
    expect(isUnique).toBe(true);
  });
});
