import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockRef, mockDeleteObject, mockUploadBytesResumable, mockGetDownloadURL } = vi.hoisted(
  () => ({
    mockRef: vi.fn((_storage: unknown, _path: string) => ({ fullPath: _path })),
    mockDeleteObject: vi.fn((_ref: unknown) => Promise.resolve()),
    mockUploadBytesResumable: vi.fn((_ref: unknown, _file: unknown) => ({
      on: (_event: string, _next: unknown, _error: unknown, complete: () => void) => {
        complete();
      },
    })),
    mockGetDownloadURL: vi.fn((_ref: unknown) =>
      Promise.resolve('https://storage.example.com/file.webp'),
    ),
  }),
);

vi.mock('firebase/storage', () => ({
  ref: mockRef,
  uploadBytesResumable: mockUploadBytesResumable,
  getDownloadURL: mockGetDownloadURL,
  deleteObject: mockDeleteObject,
  listAll: vi.fn((_ref: unknown) => Promise.resolve({ items: [], prefixes: [] })),
}));

vi.mock('../client', () => ({
  storage: { name: 'storage-mock' },
}));

// Mock crypto.randomUUID for deterministic tests
const MOCK_UUID = 'test-uuid-1234';
vi.stubGlobal('crypto', { randomUUID: () => MOCK_UUID });

import { processImageSlot, cleanupDeletedImages } from '../image-slot-processor';
import type { ImageSlot } from '../../schemas/image-slot';
import type { StoredImage } from '../../schemas/shared-schemas';

describe('processImageSlot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUploadBytesResumable.mockImplementation((_ref: unknown, _file: unknown) => ({
      on: (_event: string, _next: unknown, _error: unknown, complete: () => void) => {
        complete();
      },
    }));
    mockGetDownloadURL.mockImplementation((_ref: unknown) =>
      Promise.resolve('https://storage.example.com/file.webp'),
    );
    mockDeleteObject.mockImplementation((_ref: unknown) => Promise.resolve());
  });

  it('returns null image and empty toDelete for empty slot', async () => {
    const slot: ImageSlot = { type: 'empty' };
    const result = await processImageSlot(slot, 'projects/abc/');

    expect(result).toEqual({ image: null, toDelete: [] });
    expect(mockUploadBytesResumable).not.toHaveBeenCalled();
  });

  it('returns existing image unchanged for existing slot', async () => {
    const image: StoredImage = {
      url: 'https://storage.example.com/existing.webp',
      storagePath: 'projects/abc/main/existing.webp',
    };
    const slot: ImageSlot = { type: 'existing', image };
    const result = await processImageSlot(slot, 'projects/abc/');

    expect(result).toEqual({ image, toDelete: [] });
    expect(mockUploadBytesResumable).not.toHaveBeenCalled();
  });

  it('uploads file and returns new StoredImage for new slot', async () => {
    const file = new File(['content'], 'photo.webp', { type: 'image/webp' });
    const slot: ImageSlot = { type: 'new', file, preview: 'blob:preview' };
    const basePath = 'projects/abc/main/';

    const result = await processImageSlot(slot, basePath);

    expect(mockUploadBytesResumable).toHaveBeenCalled();
    expect(result.image).toEqual({
      url: 'https://storage.example.com/file.webp',
      storagePath: `${basePath}${MOCK_UUID}.webp`,
    });
    expect(result.toDelete).toEqual([]);
  });

  it('uploads new file and marks old for delete in replaced slot', async () => {
    const oldImage: StoredImage = {
      url: 'https://storage.example.com/old.webp',
      storagePath: 'projects/abc/main/old.webp',
    };
    const file = new File(['new'], 'new.webp', { type: 'image/webp' });
    const slot: ImageSlot = {
      type: 'replaced',
      old: oldImage,
      file,
      preview: 'blob:preview',
    };
    const basePath = 'projects/abc/main/';

    const result = await processImageSlot(slot, basePath);

    expect(mockUploadBytesResumable).toHaveBeenCalled();
    expect(result.image).toEqual({
      url: 'https://storage.example.com/file.webp',
      storagePath: `${basePath}${MOCK_UUID}.webp`,
    });
    expect(result.toDelete).toEqual([oldImage.storagePath]);
  });

  it('returns null image and marks old for delete in removed slot', async () => {
    const oldImage: StoredImage = {
      url: 'https://storage.example.com/old.webp',
      storagePath: 'projects/abc/main/old.webp',
    };
    const slot: ImageSlot = { type: 'removed', old: oldImage };

    const result = await processImageSlot(slot, 'projects/abc/');

    expect(result).toEqual({ image: null, toDelete: [oldImage.storagePath] });
    expect(mockUploadBytesResumable).not.toHaveBeenCalled();
  });
});

describe('cleanupDeletedImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteObject.mockImplementation((_ref: unknown) => Promise.resolve());
  });

  it('deletes each path provided', async () => {
    const paths = ['projects/abc/img1.webp', 'projects/abc/img2.webp'];

    await cleanupDeletedImages(paths);

    expect(mockDeleteObject).toHaveBeenCalledTimes(2);
  });

  it('does not throw when individual deletions fail', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockDeleteObject.mockImplementation(() => Promise.reject(new Error('fail')));

    await cleanupDeletedImages(['projects/abc/img1.webp']);

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('handles empty paths array without error', async () => {
    await cleanupDeletedImages([]);
    expect(mockDeleteObject).not.toHaveBeenCalled();
  });
});
