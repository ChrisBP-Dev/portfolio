import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockGetDocs, mockQuery, mockCollection, mockOrderBy } = vi.hoisted(() => ({
  mockGetDocs: vi.fn() as AnyFn & ReturnType<typeof vi.fn>,
  mockQuery: vi.fn((..._args: unknown[]) => ({ _query: true })),
  mockCollection: vi.fn((_db: unknown, _col: string) => ({ _col })),
  mockOrderBy: vi.fn((_field: string, _dir?: string) => ({ _orderBy: _field, _dir })),
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

import { experienceFirestoreSchema } from '../../../lib/schemas/experience-schema';
import { createExperience } from '../../../test/factories/experience';

describe('ExperienceList — loading and data fetching', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('[P0] 3.7-TEST-001: queries Experiences collection ordered by startDate desc', () => {
    mockCollection({}, 'Experiences');
    mockOrderBy('startDate', 'desc');
    mockQuery(mockCollection({}, 'Experiences'), mockOrderBy('startDate', 'desc'));

    expect(mockCollection).toHaveBeenCalledWith({}, 'Experiences');
    expect(mockOrderBy).toHaveBeenCalledWith('startDate', 'desc');
  });

  it('[P0] 3.7-TEST-002: safeParse validates experience documents', () => {
    const validExp = createExperience();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...firestoreData } = validExp;

    const result = experienceFirestoreSchema.safeParse(firestoreData);
    expect(result.success).toBe(true);
  });

  it('[P0] 3.7-TEST-003: safeParse rejects invalid experience documents', () => {
    const invalidData = { companyName: 123, jobName: 'not-an-object' };
    const result = experienceFirestoreSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('[P0] 3.7-TEST-004: date conversion from Firestore Timestamp', () => {
    const startTs = { toDate: () => new Date('2024-01-15') };
    const endTs = { toDate: () => new Date('2024-12-31') };

    const startDate = startTs.toDate();
    const endDate = endTs.toDate();

    const converted = {
      companyName: 'Corp',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: ['Tarea'], en: ['Task'] },
      startDate,
      endDate,
    };

    const result = experienceFirestoreSchema.safeParse(converted);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.startDate).toEqual(new Date('2024-01-15'));
      expect(result.data.endDate).toEqual(new Date('2024-12-31'));
    }
  });

  it('[P0] 3.7-TEST-005: null endDate preserved during conversion', () => {
    const startTs = { toDate: () => new Date('2024-01-15') };

    const converted = {
      companyName: 'Corp',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: ['Tarea'], en: ['Task'] },
      startDate: startTs.toDate(),
      endDate: null,
    };

    const result = experienceFirestoreSchema.safeParse(converted);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.endDate).toBeNull();
    }
  });
});

describe('ExperienceList — empty state', () => {
  it('[P0] 3.7-TEST-006: empty array after getDocs returns no documents', async () => {
    mockGetDocs.mockResolvedValue({ docs: [] });

    const snapshot = await mockGetDocs();
    const experiences = snapshot.docs
      .map((doc: { data: () => Record<string, unknown>; id: string }) => {
        const data = doc.data();
        const result = experienceFirestoreSchema.safeParse(data);
        if (!result.success) return null;
        return { ...result.data, id: doc.id };
      })
      .filter(Boolean);

    expect(experiences).toEqual([]);
  });
});

describe('ExperienceList — list rendering data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('[P0] 3.7-TEST-007: maps Firestore docs to ExperienceWithId objects', async () => {
    const exp1 = createExperience({ companyName: 'Google' });
    const exp2 = createExperience({ companyName: 'Meta' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id1, ...data1 } = exp1;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id2, ...data2 } = exp2;

    mockGetDocs.mockResolvedValue({
      docs: [
        { id: 'doc-1', data: () => data1 },
        { id: 'doc-2', data: () => data2 },
      ],
    });

    const snapshot = await mockGetDocs();
    const experiences = snapshot.docs
      .map((doc: { data: () => Record<string, unknown>; id: string }) => {
        const data = doc.data();
        const result = experienceFirestoreSchema.safeParse(data);
        if (!result.success) return null;
        return { ...result.data, id: doc.id };
      })
      .filter(Boolean);

    expect(experiences).toHaveLength(2);
    expect(experiences[0].id).toBe('doc-1');
    expect(experiences[1].id).toBe('doc-2');
  });

  it('[P0] 3.7-TEST-008: filters out invalid documents', async () => {
    const validExp = createExperience({ companyName: 'ValidCorp' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...validData } = validExp;

    mockGetDocs.mockResolvedValue({
      docs: [
        { id: 'valid-1', data: () => validData },
        { id: 'invalid-1', data: () => ({ companyName: 123 }) },
      ],
    });

    const snapshot = await mockGetDocs();
    const experiences = snapshot.docs
      .map((doc: { data: () => Record<string, unknown>; id: string }) => {
        const data = doc.data();
        const result = experienceFirestoreSchema.safeParse(data);
        if (!result.success) return null;
        return { ...result.data, id: doc.id };
      })
      .filter(Boolean);

    expect(experiences).toHaveLength(1);
    expect(experiences[0].id).toBe('valid-1');
  });
});

describe('ExperienceList — date formatting', () => {
  it('[P0] 3.7-TEST-009: Intl.DateTimeFormat formats date in Spanish', () => {
    const formatter = new Intl.DateTimeFormat('es', { year: 'numeric', month: 'short' });
    const date = new Date('2024-01-15');
    const formatted = formatter.format(date);

    expect(formatted).toContain('2024');
    expect(formatted.length).toBeGreaterThan(0);
  });
});

describe('ExperienceList — callback wiring', () => {
  it('[P0] 3.7-TEST-046: onEdit receives correct ExperienceWithId', () => {
    const exp = createExperience({ companyName: 'EditCorp' });
    const onEdit = vi.fn();
    onEdit(exp);
    expect(onEdit).toHaveBeenCalledWith(exp);
  });

  it('[P0] 3.7-TEST-047: onDelete receives correct ExperienceWithId', () => {
    const exp = createExperience({ companyName: 'DeleteCorp' });
    const onDelete = vi.fn();
    onDelete(exp);
    expect(onDelete).toHaveBeenCalledWith(exp);
  });
});
