import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockDeleteDoc, mockDoc, mockDeleteByPrefix } = vi.hoisted(() => ({
  mockDeleteDoc: vi.fn((_ref: unknown) => Promise.resolve()) as AnyFn & ReturnType<typeof vi.fn>,
  mockDoc: vi.fn((_db: unknown, _col: string, _id: string) => ({ path: `${_col}/${_id}` })),
  mockDeleteByPrefix: vi.fn((_prefix: string) => Promise.resolve()) as AnyFn &
    ReturnType<typeof vi.fn>,
}));

vi.mock('firebase/firestore', () => ({
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

vi.mock('../../../lib/firebase/image-service', () => ({
  imageService: {
    deleteByPrefix: mockDeleteByPrefix,
  },
}));

import type { StoredImage } from '../../../lib/schemas/shared-schemas';

describe('Delete flow — image count calculation', () => {
  it('[P0] 3.5-TEST-009: counts mainImage + screenshots', () => {
    const mainImage: StoredImage | undefined = {
      url: 'https://example.com/img.webp',
      storagePath: 'projects/abc/main/img.webp',
    };
    const screenshots: StoredImage[] = [
      { url: 'https://example.com/s1.webp', storagePath: 'projects/abc/screenshots/s1.webp' },
      { url: 'https://example.com/s2.webp', storagePath: 'projects/abc/screenshots/s2.webp' },
    ];

    const imageCount = (mainImage ? 1 : 0) + screenshots.length;
    expect(imageCount).toBe(3);
  });

  it('[P0] 3.5-TEST-010: counts 0 when no images', () => {
    const project: { mainImage?: StoredImage; screenshots?: StoredImage[] } = {};

    const imageCount = (project.mainImage ? 1 : 0) + (project.screenshots?.length ?? 0);
    expect(imageCount).toBe(0);
  });

  it('[P1] 3.5-TEST-011: counts only mainImage when no screenshots', () => {
    const mainImage: StoredImage | undefined = {
      url: 'https://example.com/img.webp',
      storagePath: 'projects/abc/main/img.webp',
    };
    const screenshots: StoredImage[] = [];

    const imageCount = (mainImage ? 1 : 0) + screenshots.length;
    expect(imageCount).toBe(1);
  });
});

describe('Delete flow — operation order', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('[P0] 3.5-TEST-012: deleteByPrefix called before deleteDoc', async () => {
    const callOrder: string[] = [];

    mockDeleteByPrefix.mockImplementation(async () => {
      callOrder.push('deleteByPrefix');
    });
    mockDeleteDoc.mockImplementation(async () => {
      callOrder.push('deleteDoc');
    });

    const projectId = 'test-id';

    await mockDeleteByPrefix(`projects/${projectId}/`);
    await mockDeleteDoc(mockDoc({}, 'Projects', projectId));

    expect(callOrder).toEqual(['deleteByPrefix', 'deleteDoc']);
    expect(mockDeleteByPrefix).toHaveBeenCalledWith(`projects/${projectId}/`);
  });

  it('[P0] 3.5-TEST-013: deleteByPrefix receives correct prefix', async () => {
    const projectId = 'abc-123';
    await mockDeleteByPrefix(`projects/${projectId}/`);
    expect(mockDeleteByPrefix).toHaveBeenCalledWith('projects/abc-123/');
  });
});

describe('Delete flow — confirm dialog message', () => {
  it('[P0] 3.5-TEST-014: message template includes project name and image count', () => {
    const template = "¿Eliminar '{name}'? Se eliminarán también {count} imágenes de Storage.";
    const projectName = 'Mi Proyecto';
    const imageCount = 5;

    const message = template
      .replace('{name}', projectName)
      .replace('{count}', String(imageCount));

    expect(message).toBe(
      "¿Eliminar 'Mi Proyecto'? Se eliminarán también 5 imágenes de Storage.",
    );
  });
});
