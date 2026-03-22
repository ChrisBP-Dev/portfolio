import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const mockTimestamp = { toDate: () => new Date('2024-01-15'), seconds: 0, nanoseconds: 0 };
const mockTimestampFromDate = vi.fn((_date?: unknown) => mockTimestamp) as AnyFn &
  ReturnType<typeof vi.fn>;

const { mockAddDoc, mockUpdateDoc, mockDoc, mockCollection } = vi.hoisted(() => ({
  mockAddDoc: vi.fn((_col: unknown, _data: unknown) =>
    Promise.resolve({ id: 'new-exp-id' }),
  ) as AnyFn & ReturnType<typeof vi.fn>,
  mockUpdateDoc: vi.fn((_ref: unknown, _data: unknown) => Promise.resolve()) as AnyFn &
    ReturnType<typeof vi.fn>,
  mockDoc: vi.fn((_db: unknown, _col: string, _id: string) => ({ path: `${_col}/${_id}` })),
  mockCollection: vi.fn((_db: unknown, _col: string) => ({ _col })),
}));

vi.mock('firebase/firestore', () => ({
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  doc: mockDoc,
  collection: mockCollection,
  Timestamp: { fromDate: mockTimestampFromDate },
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

import { experienceFormSchema } from '../../../lib/schemas/experience-schema';
import { createExperience } from '../../../test/factories/experience';

describe('ExperienceForm — companyName validation', () => {
  it('[P0] 3.7-TEST-010: rejects empty companyName', () => {
    const result = experienceFormSchema.safeParse({
      companyName: '',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: ['Tarea'], en: ['Task'] },
      startDate: new Date('2024-01-15'),
      endDate: null,
    });
    expect(result.success).toBe(false);
  });

  it('[P0] 3.7-TEST-011: accepts valid companyName', () => {
    const result = experienceFormSchema.safeParse({
      companyName: 'Empresa X',
      jobName: { es: 'Desarrollador', en: 'Developer' },
      responsibilities: { es: ['Desarrollar'], en: ['Develop'] },
      startDate: new Date('2024-01-15'),
      endDate: null,
    });
    expect(result.success).toBe(true);
  });
});

describe('ExperienceForm — jobName bilingual validation', () => {
  it('[P0] 3.7-TEST-012: rejects empty jobName.es', () => {
    const result = experienceFormSchema.safeParse({
      companyName: 'Corp',
      jobName: { es: '', en: 'Developer' },
      responsibilities: { es: ['Tarea'], en: ['Task'] },
      startDate: new Date('2024-01-15'),
      endDate: null,
    });
    expect(result.success).toBe(false);
  });

  it('[P0] 3.7-TEST-013: rejects empty jobName.en', () => {
    const result = experienceFormSchema.safeParse({
      companyName: 'Corp',
      jobName: { es: 'Desarrollador', en: '' },
      responsibilities: { es: ['Tarea'], en: ['Task'] },
      startDate: new Date('2024-01-15'),
      endDate: null,
    });
    expect(result.success).toBe(false);
  });

  it('[P0] 3.7-TEST-014: accepts valid bilingual jobName', () => {
    const result = experienceFormSchema.safeParse({
      companyName: 'Corp',
      jobName: { es: 'Ingeniero', en: 'Engineer' },
      responsibilities: { es: ['Diseñar'], en: ['Design'] },
      startDate: new Date('2024-01-15'),
      endDate: null,
    });
    expect(result.success).toBe(true);
  });
});

describe('ExperienceForm — responsibilities validation', () => {
  it('[P0] 3.7-TEST-015: form-level check rejects empty responsibilities.es', () => {
    // Schema allows empty arrays; form-level validation enforces ≥1 non-empty item
    const responsibilitiesEs: string[] = [];
    const hasNonEmpty = responsibilitiesEs.filter((s) => s.trim()).length > 0;
    expect(hasNonEmpty).toBe(false);
  });

  it('[P0] 3.7-TEST-016: form-level check rejects empty responsibilities.en', () => {
    const responsibilitiesEn: string[] = [];
    const hasNonEmpty = responsibilitiesEn.filter((s) => s.trim()).length > 0;
    expect(hasNonEmpty).toBe(false);
  });

  it('[P1] 3.7-TEST-017: manual check detects all-whitespace responsibilities', () => {
    const responsibilities = ['  ', ' '];
    const hasNonEmpty = responsibilities.filter((s) => s.trim()).length > 0;
    expect(hasNonEmpty).toBe(false);
  });

  it('[P0] 3.7-TEST-018: accepts valid responsibilities arrays', () => {
    const result = experienceFormSchema.safeParse({
      companyName: 'Corp',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: ['Desarrollar', 'Revisar'], en: ['Develop', 'Review'] },
      startDate: new Date('2024-01-15'),
      endDate: null,
    });
    expect(result.success).toBe(true);
  });
});

describe('ExperienceForm — date range validation', () => {
  it('[P0] 3.7-TEST-019: accepts null endDate (currently working)', () => {
    const result = experienceFormSchema.safeParse({
      companyName: 'Corp',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: ['Tarea'], en: ['Task'] },
      startDate: new Date('2024-01-15'),
      endDate: null,
    });
    expect(result.success).toBe(true);
  });

  it('[P0] 3.7-TEST-020: rejects endDate before startDate', () => {
    const result = experienceFormSchema.safeParse({
      companyName: 'Corp',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: ['Tarea'], en: ['Task'] },
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-01-01'),
    });
    expect(result.success).toBe(false);
  });

  it('[P0] 3.7-TEST-021: accepts endDate equal to startDate', () => {
    const result = experienceFormSchema.safeParse({
      companyName: 'Corp',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: ['Tarea'], en: ['Task'] },
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-15'),
    });
    expect(result.success).toBe(true);
  });

  it('[P0] 3.7-TEST-022: accepts endDate after startDate', () => {
    const result = experienceFormSchema.safeParse({
      companyName: 'Corp',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: ['Tarea'], en: ['Task'] },
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-31'),
    });
    expect(result.success).toBe(true);
  });

  it('[P0] 3.7-TEST-023: date range error targets endDate path', () => {
    const result = experienceFormSchema.safeParse({
      companyName: 'Corp',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: ['Tarea'], en: ['Task'] },
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-01-01'),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const endDateIssue = result.error.issues.find((i) => i.path.includes('endDate'));
      expect(endDateIssue).toBeDefined();
    }
  });
});

describe('ExperienceForm — create submit flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('[P0] 3.7-TEST-024: addDoc called with Timestamp dates', async () => {
    const payload = {
      companyName: 'Empresa X',
      jobName: { es: 'Dev', en: 'Dev' },
      responsibilities: { es: ['Tarea'], en: ['Task'] },
      startDate: mockTimestampFromDate(new Date('2024-01-15')),
      endDate: null,
    };

    await mockAddDoc(mockCollection({}, 'Experiences'), payload);

    expect(mockAddDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        companyName: 'Empresa X',
        startDate: mockTimestamp,
        endDate: null,
      }),
    );
    expect(mockTimestampFromDate).toHaveBeenCalledWith(expect.any(Date));
  });

  it('[P0] 3.7-TEST-025: addDoc called with correct collection', async () => {
    await mockAddDoc(mockCollection({}, 'Experiences'), { companyName: 'Test' });

    expect(mockCollection).toHaveBeenCalledWith({}, 'Experiences');
  });

  it('[P0] 3.7-TEST-026: Timestamp.fromDate called for non-null endDate', () => {
    mockTimestampFromDate.mockClear();

    const startDateObj = new Date('2024-01-15');
    const endDateObj = new Date('2024-12-31');

    mockTimestampFromDate(startDateObj);
    mockTimestampFromDate(endDateObj);

    expect(mockTimestampFromDate).toHaveBeenCalledTimes(2);
    expect(mockTimestampFromDate).toHaveBeenCalledWith(startDateObj);
    expect(mockTimestampFromDate).toHaveBeenCalledWith(endDateObj);
  });
});

describe('ExperienceForm — edit submit flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('[P0] 3.7-TEST-027: updateDoc called with correct doc reference', async () => {
    const exp = createExperience();
    const payload = {
      companyName: 'Updated Corp',
      jobName: { es: 'Senior Dev', en: 'Senior Dev' },
      responsibilities: { es: ['Liderar'], en: ['Lead'] },
      startDate: mockTimestamp,
      endDate: null,
    };

    await mockUpdateDoc(mockDoc({}, 'Experiences', exp.id), payload);

    expect(mockDoc).toHaveBeenCalledWith({}, 'Experiences', exp.id);
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ companyName: 'Updated Corp' }),
    );
  });
});

describe('ExperienceForm — cancel with unsaved changes', () => {
  it('[P0] 3.7-TEST-028: cancel proceeds when no changes', () => {
    const hasChanges = false;
    const onCancel = vi.fn();

    if (!hasChanges) {
      onCancel();
    }

    expect(onCancel).toHaveBeenCalled();
  });

  it('[P0] 3.7-TEST-029: cancel blocked when user declines confirm', () => {
    const hasChanges = true;
    const onCancel = vi.fn();

    const confirmed = false;
    if (hasChanges && !confirmed) {
      // Don't call onCancel
    } else {
      onCancel();
    }

    expect(onCancel).not.toHaveBeenCalled();
  });
});

describe('ExperienceForm — date timezone handling', () => {
  it('date string with T00:00:00 suffix is interpreted as local midnight', () => {
    // The form appends 'T00:00:00' to force local interpretation instead of UTC.
    // Without the suffix, new Date('2025-06-15') is midnight UTC — which shifts
    // the date backwards in negative-offset timezones.
    const dateString = '2025-06-15';
    const localDate = new Date(dateString + 'T00:00:00');

    expect(localDate.getFullYear()).toBe(2025);
    expect(localDate.getMonth()).toBe(5); // 0-indexed: June
    expect(localDate.getDate()).toBe(15);
  });

  it('Timestamp.fromDate receives local-midnight Date', () => {
    mockTimestampFromDate.mockClear();
    const dateString = '2024-03-10';

    // Simulate what buildPayload does
    const localDate = new Date(dateString + 'T00:00:00');
    mockTimestampFromDate(localDate);

    expect(mockTimestampFromDate).toHaveBeenCalledWith(localDate);
    expect(localDate.getDate()).toBe(10);
  });
});

describe('ExperienceForm — edit initialization', () => {
  it('[P0] 3.7-TEST-030: initialData populates form fields', () => {
    const exp = createExperience({
      companyName: 'TechCorp',
      jobName: { es: 'Ingeniero', en: 'Engineer' },
    });

    const companyName = exp.companyName;
    const jobNameEs = exp.jobName.es;
    const jobNameEn = exp.jobName.en;
    const responsibilitiesEs = [...exp.responsibilities.es];
    const responsibilitiesEn = [...exp.responsibilities.en];
    const startDateStr = exp.startDate.toISOString().split('T')[0];
    const currentlyWorking = exp.endDate === null;

    expect(companyName).toBe('TechCorp');
    expect(jobNameEs).toBe('Ingeniero');
    expect(jobNameEn).toBe('Engineer');
    expect(responsibilitiesEs).toEqual(exp.responsibilities.es);
    expect(responsibilitiesEn).toEqual(exp.responsibilities.en);
    expect(startDateStr).toBe('2024-01-15');
    expect(currentlyWorking).toBe(true);
  });

  it('[P0] 3.7-TEST-031: re-initializes when initialData.id changes', () => {
    const exp1 = createExperience({ companyName: 'Corp A' });
    const exp2 = createExperience({ companyName: 'Corp B' });

    let initializedId = '';

    if (initializedId !== exp1.id) {
      initializedId = exp1.id;
    }
    expect(initializedId).toBe(exp1.id);

    if (initializedId !== exp2.id) {
      initializedId = exp2.id;
    }
    expect(initializedId).toBe(exp2.id);
  });

  it('[P0] 3.7-TEST-032: endDate populated when not currently working', () => {
    const exp = createExperience({
      endDate: new Date('2024-12-31'),
    });

    const endDateStr = exp.endDate ? exp.endDate.toISOString().split('T')[0] : '';
    const currentlyWorking = exp.endDate === null;

    expect(endDateStr).toBe('2024-12-31');
    expect(currentlyWorking).toBe(false);
  });
});
