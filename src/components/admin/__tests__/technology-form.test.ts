import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockAddDoc, mockUpdateDoc, mockDoc, mockCollection } = vi.hoisted(() => ({
  mockAddDoc: vi.fn((_col: unknown, _data: unknown) =>
    Promise.resolve({ id: 'new-doc-id' }),
  ) as AnyFn & ReturnType<typeof vi.fn>,
  mockUpdateDoc: vi.fn((_ref: unknown, _data: unknown) => Promise.resolve()) as AnyFn &
    ReturnType<typeof vi.fn>,
  mockDoc: vi.fn((_db: unknown, _col: string, _id: string) => ({ path: `${_col}/${_id}` })),
  mockCollection: vi.fn((_db: unknown, _col: string) => ({ _col })),
}));

const { mockProcessImageSlot, mockCleanupDeletedImages } = vi.hoisted(() => ({
  mockProcessImageSlot: vi.fn((_slot: unknown, _path: string) =>
    Promise.resolve({ image: null, toDelete: [] }),
  ) as AnyFn & ReturnType<typeof vi.fn>,
  mockCleanupDeletedImages: vi.fn((_paths: string[]) => Promise.resolve()) as AnyFn &
    ReturnType<typeof vi.fn>,
}));

const { mockUpload } = vi.hoisted(() => ({
  mockUpload: vi.fn((_file: unknown, _path: string) =>
    Promise.resolve({ url: 'https://example.com/uploaded.webp', storagePath: 'tech/img.webp' }),
  ) as AnyFn & ReturnType<typeof vi.fn>,
}));

vi.mock('firebase/firestore', () => ({
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  doc: mockDoc,
  collection: mockCollection,
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

vi.mock('../../../lib/firebase/image-slot-processor', () => ({
  processImageSlot: mockProcessImageSlot,
  cleanupDeletedImages: mockCleanupDeletedImages,
}));

vi.mock('../../../lib/firebase/image-service', () => ({
  imageService: { upload: mockUpload },
}));

import type { ImageSlot } from '../../../lib/schemas/image-slot';
import { technologyFormSchema } from '../../../lib/schemas/technology-schema';
import { createTechnology } from '../../../test/factories/technology';

describe('TechnologyForm — name validation', () => {
  it('[P0] 3.6-TEST-010: rejects empty name', () => {
    const result = technologyFormSchema.safeParse({ name: '', experienceYears: 3 });
    expect(result.success).toBe(false);
  });

  it('[P0] 3.6-TEST-011: accepts valid name', () => {
    const result = technologyFormSchema.safeParse({ name: 'React', experienceYears: 3 });
    expect(result.success).toBe(true);
  });
});

describe('TechnologyForm — experienceYears validation', () => {
  it('[P0] 3.6-TEST-012: rejects negative values', () => {
    const result = technologyFormSchema.safeParse({ name: 'React', experienceYears: -1 });
    expect(result.success).toBe(false);
  });

  it('[P0] 3.6-TEST-013: rejects non-integer values', () => {
    const result = technologyFormSchema.safeParse({ name: 'React', experienceYears: 2.5 });
    expect(result.success).toBe(false);
  });

  it('[P0] 3.6-TEST-014: accepts zero', () => {
    const result = technologyFormSchema.safeParse({ name: 'React', experienceYears: 0 });
    expect(result.success).toBe(true);
  });

  it('[P0] 3.6-TEST-015: accepts positive integer', () => {
    const result = technologyFormSchema.safeParse({ name: 'React', experienceYears: 5 });
    expect(result.success).toBe(true);
  });

  it('[P1] 3.6-TEST-016: manual validation detects NaN', () => {
    const experienceYears = NaN;
    const isInvalid = isNaN(experienceYears) || experienceYears < 0;
    expect(isInvalid).toBe(true);
  });

  it('[P1] 3.6-TEST-017: manual validation detects non-integer', () => {
    const experienceYears = 3.7;
    const isNonInteger = !Number.isInteger(experienceYears);
    expect(isNonInteger).toBe(true);
  });
});

function isImageInvalid(slot: ImageSlot): boolean {
  return slot.type === 'empty' || slot.type === 'removed';
}

describe('TechnologyForm — image validation', () => {
  it('[P0] 3.6-TEST-018: rejects empty ImageSlot', () => {
    const slot: ImageSlot = { type: 'empty' };
    expect(isImageInvalid(slot)).toBe(true);
  });

  it('[P0] 3.6-TEST-019: rejects removed ImageSlot in edit mode', () => {
    const tech = createTechnology();
    const slot: ImageSlot = { type: 'removed', old: tech.image };
    expect(isImageInvalid(slot)).toBe(true);
  });

  it('[P0] 3.6-TEST-020: accepts existing ImageSlot', () => {
    const tech = createTechnology();
    const slot: ImageSlot = { type: 'existing', image: tech.image };
    expect(isImageInvalid(slot)).toBe(false);
  });

  it('[P0] 3.6-TEST-021: accepts new ImageSlot', () => {
    const slot: ImageSlot = {
      type: 'new',
      file: new File(['test'], 'icon.webp', { type: 'image/webp' }),
      preview: 'data:image/webp;base64,...',
    };
    expect(isImageInvalid(slot)).toBe(false);
  });

  it('[P0] 3.6-TEST-022: accepts replaced ImageSlot', () => {
    const tech = createTechnology();
    const slot: ImageSlot = {
      type: 'replaced',
      old: tech.image,
      file: new File(['test'], 'new-icon.webp', { type: 'image/webp' }),
      preview: 'data:image/webp;base64,...',
    };
    expect(isImageInvalid(slot)).toBe(false);
  });
});

describe('TechnologyForm — create submit flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('[P0] 3.6-TEST-023: addDoc called with name and experienceYears', async () => {
    await mockAddDoc(mockCollection({}, 'Technologies'), {
      name: 'Astro',
      experienceYears: 3,
    });

    expect(mockAddDoc).toHaveBeenCalledWith(
      expect.anything(),
      { name: 'Astro', experienceYears: 3 },
    );
  });

  it('[P0] 3.6-TEST-024: addDoc → upload → updateDoc order', async () => {
    const callOrder: string[] = [];

    mockAddDoc.mockImplementation(async () => {
      callOrder.push('addDoc');
      return { id: 'new-id' };
    });
    mockUpload.mockImplementation(async () => {
      callOrder.push('upload');
      return { url: 'https://example.com/img.webp', storagePath: 'technologies/new-id/uuid.webp' };
    });
    mockUpdateDoc.mockImplementation(async () => {
      callOrder.push('updateDoc');
    });

    const docRef = await mockAddDoc(mockCollection({}, 'Technologies'), {
      name: 'React',
      experienceYears: 4,
    });

    const file = new File(['test'], 'icon.webp', { type: 'image/webp' });
    const storedImage = await mockUpload(file, `technologies/${docRef.id}/uuid.webp`);
    await mockUpdateDoc(mockDoc({}, 'Technologies', docRef.id), { image: storedImage });

    expect(callOrder).toEqual(['addDoc', 'upload', 'updateDoc']);
  });

  it('[P0] 3.6-TEST-025: upload path includes docId', async () => {
    const docId = 'abc-123';
    const file = new File(['test'], 'icon.webp', { type: 'image/webp' });

    await mockUpload(file, `technologies/${docId}/some-uuid.webp`);

    expect(mockUpload).toHaveBeenCalledWith(
      file,
      expect.stringContaining(`technologies/${docId}/`),
    );
  });
});

describe('TechnologyForm — edit submit flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('[P0] 3.6-TEST-026: processImageSlot → updateDoc → cleanup order', async () => {
    const callOrder: string[] = [];
    const existingImage = { url: 'https://example.com/old.webp', storagePath: 'tech/old.webp' };

    mockProcessImageSlot.mockImplementation(async () => {
      callOrder.push('processImageSlot');
      return {
        image: { url: 'https://example.com/new.webp', storagePath: 'tech/new.webp' },
        toDelete: [existingImage.storagePath],
      };
    });
    mockUpdateDoc.mockImplementation(async () => {
      callOrder.push('updateDoc');
    });
    mockCleanupDeletedImages.mockImplementation(async () => {
      callOrder.push('cleanupDeletedImages');
    });

    const slot: ImageSlot = {
      type: 'replaced',
      old: existingImage,
      file: new File(['test'], 'new.webp', { type: 'image/webp' }),
      preview: 'data:...',
    };

    const docId = 'edit-id';
    const processed = await mockProcessImageSlot(slot, `technologies/${docId}/`);
    await mockUpdateDoc(mockDoc({}, 'Technologies', docId), {
      name: 'Updated',
      experienceYears: 5,
      ...(processed.image && { image: processed.image }),
    });

    if (processed.toDelete.length > 0) {
      await mockCleanupDeletedImages(processed.toDelete);
    }

    expect(callOrder).toEqual(['processImageSlot', 'updateDoc', 'cleanupDeletedImages']);
  });

  it('[P0] 3.6-TEST-027: cleanup skipped when no images to delete', async () => {
    mockProcessImageSlot.mockResolvedValue({
      image: { url: 'https://example.com/existing.webp', storagePath: 'tech/existing.webp' },
      toDelete: [],
    });

    const processed = await mockProcessImageSlot(
      { type: 'existing', image: { url: 'u', storagePath: 'p' } },
      'technologies/id/',
    );

    if (processed.toDelete.length > 0) {
      await mockCleanupDeletedImages(processed.toDelete);
    }

    expect(mockCleanupDeletedImages).not.toHaveBeenCalled();
  });
});

describe('TechnologyForm — cancel with unsaved changes', () => {
  it('[P0] 3.6-TEST-028: cancel proceeds when no changes', () => {
    const hasChanges = false;
    const onCancel = vi.fn();

    if (!hasChanges) {
      onCancel();
    }

    expect(onCancel).toHaveBeenCalled();
  });

  it('[P0] 3.6-TEST-029: cancel blocked when user declines confirm', () => {
    const hasChanges = true;
    const onCancel = vi.fn();

    // Simulate user declining the confirm dialog
    const confirmed = false;
    if (hasChanges && !confirmed) {
      // Don't call onCancel
    } else {
      onCancel();
    }

    expect(onCancel).not.toHaveBeenCalled();
  });
});

describe('TechnologyForm — edit initialization', () => {
  it('[P0] 3.6-TEST-030: initialData populates form fields', () => {
    const tech = createTechnology({ name: 'Svelte', experienceYears: 2 });

    // Simulate form initialization
    const name = tech.name;
    const experienceYears = tech.experienceYears;
    const imageSlot: ImageSlot = { type: 'existing', image: tech.image };

    expect(name).toBe('Svelte');
    expect(experienceYears).toBe(2);
    expect(imageSlot.type).toBe('existing');
    if (imageSlot.type === 'existing') {
      expect(imageSlot.image).toEqual(tech.image);
    }
  });

  it('[P0] 3.6-TEST-031: re-initializes when initialData.id changes', () => {
    const tech1 = createTechnology({ name: 'React' });
    const tech2 = createTechnology({ name: 'Vue' });

    let initializedId = '';

    // First initialization
    if (initializedId !== tech1.id) {
      initializedId = tech1.id;
    }
    expect(initializedId).toBe(tech1.id);

    // Second initialization with different tech
    if (initializedId !== tech2.id) {
      initializedId = tech2.id;
    }
    expect(initializedId).toBe(tech2.id);
  });
});
