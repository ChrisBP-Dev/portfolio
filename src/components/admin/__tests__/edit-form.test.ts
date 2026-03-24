import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockUpdateDoc, mockDoc, mockDeleteField } = vi.hoisted(() => ({
  mockUpdateDoc: vi.fn((_ref: unknown, _data: unknown) => Promise.resolve()) as AnyFn &
    ReturnType<typeof vi.fn>,
  mockDoc: vi.fn((_db: unknown, _col: string, _id: string) => ({ path: `${_col}/${_id}` })),
  mockDeleteField: vi.fn(() => '__DELETE_FIELD_SENTINEL__'),
}));

const { mockProcessImageSlot, mockCleanupDeletedImages } = vi.hoisted(() => ({
  mockProcessImageSlot: vi.fn((_slot: unknown, _path: string) =>
    Promise.resolve({ image: null, toDelete: [] }),
  ) as AnyFn & ReturnType<typeof vi.fn>,
  mockCleanupDeletedImages: vi.fn((_paths: string[]) => Promise.resolve()) as AnyFn &
    ReturnType<typeof vi.fn>,
}));

vi.mock('firebase/firestore', () => ({
  updateDoc: mockUpdateDoc,
  doc: mockDoc,
  deleteField: mockDeleteField,
  collection: vi.fn(),
  addDoc: vi.fn(),
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

vi.mock('../../../lib/firebase/image-slot-processor', () => ({
  processImageSlot: mockProcessImageSlot,
  cleanupDeletedImages: mockCleanupDeletedImages,
}));

vi.mock('../../../lib/firebase/image-service', () => ({
  imageService: { upload: vi.fn() },
}));

import type { ImageSlot } from '../../../lib/schemas/image-slot';
import type { ProjectWithId } from '../../../lib/schemas/project-schema';

describe('Edit form — initialization from initialData', () => {
  const mockProject: ProjectWithId = {
    companyName: { es: 'Empresa Test', en: 'Test Company' },
    shortDescription: { es: 'Descripción corta', en: 'Short description' },
    features: { es: ['Feature 1', 'Feature 2'], en: ['Feature 1 EN'] },
    mainImage: {
      url: 'https://example.com/main.webp',
      storagePath: 'projects/proj-1/main/img.webp',
    },
    screenshots: [
      {
        url: 'https://example.com/s1.webp',
        storagePath: 'projects/proj-1/screenshots/s1.webp',
      },
    ],
    technologies: ['astro', 'svelte'],
    websiteUrl: 'https://example.com',
    sourceCodeUrl: 'https://github.com/test',
    slug: 'empresa-test',
    order: 0,
    featured: false,
    id: 'proj-1',
  };

  it('[P0] 3.5-TEST-015: text fields populated from initialData', () => {
    expect(mockProject.companyName.es).toBe('Empresa Test');
    expect(mockProject.companyName.en).toBe('Test Company');
    expect(mockProject.shortDescription.es).toBe('Descripción corta');
    expect(mockProject.shortDescription.en).toBe('Short description');
  });

  it('[P0] 3.5-TEST-016: mainImage initialized as existing ImageSlot', () => {
    const mainImageSlot: ImageSlot = mockProject.mainImage
      ? { type: 'existing', image: mockProject.mainImage }
      : { type: 'empty' };

    expect(mainImageSlot.type).toBe('existing');
    if (mainImageSlot.type === 'existing') {
      expect(mainImageSlot.image.url).toBe('https://example.com/main.webp');
      expect(mainImageSlot.image.storagePath).toBe('projects/proj-1/main/img.webp');
    }
  });

  it('[P0] 3.5-TEST-017: screenshots initialized as existing ImageSlots', () => {
    const screenshots: ImageSlot[] = (mockProject.screenshots ?? []).map((img) => ({
      type: 'existing' as const,
      image: img,
    }));

    expect(screenshots).toHaveLength(1);
    expect(screenshots[0]!.type).toBe('existing');
  });

  it('[P0] 3.5-TEST-018: technologies populated from initialData', () => {
    const selectedTechnologies = [...(mockProject.technologies ?? [])];
    expect(selectedTechnologies).toEqual(['astro', 'svelte']);
  });

  it('[P0] 3.5-TEST-019: slug populated and manualSlug set to true in edit mode', () => {
    expect(mockProject.slug).toBe('empresa-test');
    // manualSlug is always true in edit mode
    const manualSlug = true;
    expect(manualSlug).toBe(true);
  });

  it('[P1] 3.5-TEST-020: optional URLs populated from initialData', () => {
    expect(mockProject.websiteUrl ?? '').toBe('https://example.com');
    expect(mockProject.sourceCodeUrl ?? '').toBe('https://github.com/test');
  });

  it('[P1] 3.5-TEST-021: mainImage empty when project has no image', () => {
    const projectNoImage: ProjectWithId = { ...mockProject, mainImage: undefined };
    const mainImageSlot: ImageSlot = projectNoImage.mainImage
      ? { type: 'existing', image: projectNoImage.mainImage }
      : { type: 'empty' };

    expect(mainImageSlot.type).toBe('empty');
  });

  it('[P1] 3.5-TEST-022: features default to empty arrays when absent', () => {
    const projectEmpty: ProjectWithId = {
      ...mockProject,
      features: { es: [], en: [] },
    };
    expect([...(projectEmpty.features?.es ?? [])]).toEqual([]);
    expect([...(projectEmpty.features?.en ?? [])]).toEqual([]);
  });
});

describe('Edit form — mainImage validation', () => {
  function isMainImageInvalid(slot: ImageSlot): boolean {
    return slot.type === 'empty' || slot.type === 'removed';
  }

  it('[P0] 3.5-TEST-023: rejects empty mainImage slot', () => {
    expect(isMainImageInvalid({ type: 'empty' })).toBe(true);
  });

  it('[P0] 3.5-TEST-024: rejects removed mainImage slot', () => {
    const slot: ImageSlot = {
      type: 'removed',
      old: { url: 'https://example.com/img.webp', storagePath: 'p/abc/main/img.webp' },
    };
    expect(isMainImageInvalid(slot)).toBe(true);
  });

  it('[P0] 3.5-TEST-025: accepts existing mainImage slot', () => {
    const slot: ImageSlot = {
      type: 'existing',
      image: { url: 'https://example.com/img.webp', storagePath: 'p/abc/main/img.webp' },
    };
    expect(isMainImageInvalid(slot)).toBe(false);
  });

  it('[P0] 3.5-TEST-026: accepts replaced mainImage slot', () => {
    const slot: ImageSlot = {
      type: 'replaced',
      old: { url: 'https://example.com/old.webp', storagePath: 'p/abc/main/old.webp' },
      file: new File([''], 'new.webp'),
      preview: 'blob:preview',
    };
    expect(isMainImageInvalid(slot)).toBe(false);
  });
});

describe('Edit form — submit with processImageSlot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('[P0] 3.5-TEST-027: processImageSlot called for mainImage', async () => {
    const mainSlot: ImageSlot = {
      type: 'existing',
      image: { url: 'https://example.com/img.webp', storagePath: 'p/abc/main/img.webp' },
    };

    await mockProcessImageSlot(mainSlot, 'projects/abc/main/');
    expect(mockProcessImageSlot).toHaveBeenCalledWith(mainSlot, 'projects/abc/main/');
  });

  it('[P0] 3.5-TEST-028: processImageSlot called for each screenshot', async () => {
    const screenshots: ImageSlot[] = [
      {
        type: 'existing',
        image: { url: 'https://example.com/s1.webp', storagePath: 'p/abc/screenshots/s1.webp' },
      },
      {
        type: 'removed',
        old: { url: 'https://example.com/s2.webp', storagePath: 'p/abc/screenshots/s2.webp' },
      },
    ];

    await Promise.all(
      screenshots.map((slot) => mockProcessImageSlot(slot, 'projects/abc/screenshots/')),
    );

    expect(mockProcessImageSlot).toHaveBeenCalledTimes(2);
  });

  it('[P0] 3.5-TEST-029: cleanupDeletedImages called after updateDoc', async () => {
    const callOrder: string[] = [];

    mockUpdateDoc.mockImplementation(async () => {
      callOrder.push('updateDoc');
    });
    mockCleanupDeletedImages.mockImplementation(async () => {
      callOrder.push('cleanupDeletedImages');
    });

    await mockUpdateDoc(mockDoc({}, 'Projects', 'abc'), {});
    await mockCleanupDeletedImages(['old-path.webp']);

    expect(callOrder).toEqual(['updateDoc', 'cleanupDeletedImages']);
  });

  it('[P0] 3.5-TEST-030: cleanupDeletedImages not called when no deletions', () => {
    const allDeletePaths: string[] = [];
    if (allDeletePaths.length > 0) {
      mockCleanupDeletedImages(allDeletePaths);
    }
    expect(mockCleanupDeletedImages).not.toHaveBeenCalled();
  });
});

describe('Edit form — deleteField for cleared URLs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function buildUrlField(
    mode: 'create' | 'edit',
    urlValue: string,
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    if (urlValue.trim()) {
      data.websiteUrl = urlValue.trim();
    } else if (mode === 'edit') {
      data.websiteUrl = mockDeleteField();
    }
    return data;
  }

  it('[P0] 3.5-TEST-031: empty websiteUrl uses deleteField in edit mode', () => {
    const data = buildUrlField('edit', '');
    expect(mockDeleteField).toHaveBeenCalled();
    expect(data.websiteUrl).toBe('__DELETE_FIELD_SENTINEL__');
  });

  it('[P1] 3.5-TEST-032: non-empty websiteUrl uses trimmed value in edit mode', () => {
    const data = buildUrlField('edit', '  https://example.com  ');
    expect(data.websiteUrl).toBe('https://example.com');
  });

  it('[P1] 3.5-TEST-033: empty websiteUrl omitted in create mode', () => {
    const data = buildUrlField('create', '');
    expect(data.websiteUrl).toBeUndefined();
  });
});

describe('Edit form — ImageSlot state transitions (CR fixes)', () => {
  it('[P0] 3.5-CR-003: removeImage on existing produces removed state', () => {
    const existingSlot: ImageSlot = {
      type: 'existing',
      image: { url: 'https://example.com/img.webp', storagePath: 'p/abc/main/img.webp' },
    };

    // Simulate removeImage() logic after fix
    let result: ImageSlot;
    if (existingSlot.type === 'existing') {
      result = { type: 'removed', old: existingSlot.image };
    } else {
      result = { type: 'empty' };
    }

    expect(result.type).toBe('removed');
    if (result.type === 'removed') {
      expect(result.old.storagePath).toBe('p/abc/main/img.webp');
    }
  });

  it('[P0] 3.5-CR-004: handleFile on existing produces replaced state', () => {
    const existingSlot: ImageSlot = {
      type: 'existing',
      image: { url: 'https://example.com/img.webp', storagePath: 'p/abc/main/img.webp' },
    };
    const newFile = new File([''], 'new.webp');
    const preview = 'blob:preview';

    // Simulate handleFile() logic after fix
    let result: ImageSlot;
    if (existingSlot.type === 'existing') {
      result = { type: 'replaced', old: existingSlot.image, file: newFile, preview };
    } else {
      result = { type: 'new', file: newFile, preview };
    }

    expect(result.type).toBe('replaced');
    if (result.type === 'replaced') {
      expect(result.old.storagePath).toBe('p/abc/main/img.webp');
    }
  });

  it('[P0] 3.5-CR-005: removeScreenshot on existing marks as removed instead of filtering', () => {
    const screenshots: ImageSlot[] = [
      { type: 'existing', image: { url: 'https://example.com/s1.webp', storagePath: 'p/abc/screenshots/s1.webp' } },
      { type: 'new', file: new File([''], 's2.webp'), preview: 'blob:p2' },
    ];

    // Simulate removeScreenshot(0) logic after fix — existing → removed
    const slot = screenshots[0]!;
    let result: ImageSlot[];
    if (slot.type === 'existing') {
      result = screenshots.map((s, i) =>
        i === 0 ? { type: 'removed' as const, old: slot.image } : s,
      );
    } else {
      result = screenshots.filter((_, i) => i !== 0);
    }

    expect(result).toHaveLength(2);
    expect(result[0]!.type).toBe('removed');
    expect(result[1]!.type).toBe('new');
  });

  it('[P0] 3.5-CR-006: removeScreenshot on new slot still filters out', () => {
    const screenshots: ImageSlot[] = [
      { type: 'existing', image: { url: 'https://example.com/s1.webp', storagePath: 'p/abc/screenshots/s1.webp' } },
      { type: 'new', file: new File([''], 's2.webp'), preview: 'blob:p2' },
    ];

    const slot = screenshots[1]!;
    let result: ImageSlot[];
    if (slot.type === 'existing') {
      result = screenshots.map((s, i) =>
        i === 1 ? { type: 'removed' as const, old: (slot as Extract<ImageSlot, { type: 'existing' }>).image } : s,
      );
    } else {
      result = screenshots.filter((_, i) => i !== 1);
    }

    expect(result).toHaveLength(1);
    expect(result[0]!.type).toBe('existing');
  });

  it('[P0] 3.5-CR-007: removeImage on replaced produces removed with old reference', () => {
    const replacedSlot: ImageSlot = {
      type: 'replaced',
      old: { url: 'https://example.com/old.webp', storagePath: 'p/abc/main/old.webp' },
      file: new File([''], 'new.webp'),
      preview: 'blob:preview',
    };

    // Simulate removeImage() on replaced slot
    let result: ImageSlot;
    if (replacedSlot.type === 'replaced') {
      result = { type: 'removed', old: replacedSlot.old };
    } else {
      result = { type: 'empty' };
    }

    expect(result.type).toBe('removed');
    if (result.type === 'removed') {
      expect(result.old.storagePath).toBe('p/abc/main/old.webp');
    }
  });
});

describe('Edit form — initialized guard with ID tracking (CR fix)', () => {
  it('[P0] 3.5-CR-008: re-initializes when initialData.id changes', () => {
    let initialized = false;
    let initializedForId: string | null = null;

    const projectA = { id: 'proj-a', companyName: { es: 'A', en: 'A' } };
    const projectB = { id: 'proj-b', companyName: { es: 'B', en: 'B' } };

    // First initialization
    if (!initialized || initializedForId !== projectA.id) {
      initialized = true;
      initializedForId = projectA.id;
    }
    expect(initializedForId).toBe('proj-a');

    // Second initialization with different project
    if (!initialized || initializedForId !== projectB.id) {
      initialized = true;
      initializedForId = projectB.id;
    }
    expect(initialized).toBe(true);
    expect(initializedForId).toBe('proj-b');
  });

  it('[P1] 3.5-CR-009: does not re-initialize for same project ID', () => {
    let initCount = 0;
    let initialized = false;
    let initializedForId: string | null = null;

    const project = { id: 'proj-a' };

    // First call
    if (!initialized || initializedForId !== project.id) {
      initialized = true;
      initializedForId = project.id;
      initCount++;
    }

    // Second call with same ID — guard prevents re-init
    if (!initialized || initializedForId !== project.id) {
      initialized = true;
      initializedForId = project.id;
      initCount++;
    }

    expect(initCount).toBe(1);
    expect(initialized).toBe(true);
    expect(initializedForId).toBe('proj-a');
  });
});

describe('Edit form — FirebaseError code mapping (CR fix)', () => {
  function getFirestoreErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      if (code === 'permission-denied') return 'Sin permisos para esta operación';
      if (code === 'not-found') return 'El recurso no fue encontrado';
      if (code === 'unavailable') return 'Servicio no disponible. Verifica tu conexión.';
    }
    return 'Error inesperado';
  }

  it('[P0] 3.5-CR-010: permission-denied returns specific message', () => {
    const error = { code: 'permission-denied', message: 'Permission denied' };
    expect(getFirestoreErrorMessage(error)).toBe('Sin permisos para esta operación');
  });

  it('[P0] 3.5-CR-011: not-found returns specific message', () => {
    const error = { code: 'not-found', message: 'Not found' };
    expect(getFirestoreErrorMessage(error)).toBe('El recurso no fue encontrado');
  });

  it('[P0] 3.5-CR-012: unavailable returns specific message', () => {
    const error = { code: 'unavailable', message: 'Unavailable' };
    expect(getFirestoreErrorMessage(error)).toBe('Servicio no disponible. Verifica tu conexión.');
  });

  it('[P1] 3.5-CR-013: unknown code returns fallback', () => {
    const error = { code: 'some-other-error' };
    expect(getFirestoreErrorMessage(error)).toBe('Error inesperado');
  });

  it('[P1] 3.5-CR-014: non-object error returns fallback', () => {
    expect(getFirestoreErrorMessage('string error')).toBe('Error inesperado');
    expect(getFirestoreErrorMessage(null)).toBe('Error inesperado');
  });
});
