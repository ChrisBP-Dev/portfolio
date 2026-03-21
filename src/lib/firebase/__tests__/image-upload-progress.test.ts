import { describe, it, expect, vi, beforeEach } from 'vitest';

type StateChangedCallback = (snapshot: {
  bytesTransferred: number;
  totalBytes: number;
  state: string;
}) => void;
type ErrorCallback = (error: Error) => void;
type CompleteCallback = () => void;

const { mockRef, mockUploadBytesResumable, mockGetDownloadURL, mockDeleteObject, mockListAll } =
  vi.hoisted(() => ({
    mockRef: vi.fn((_storage: unknown, _path: string) => ({ fullPath: _path })),
    mockUploadBytesResumable: vi.fn(),
    mockGetDownloadURL: vi.fn((_ref: unknown) =>
      Promise.resolve('https://storage.example.com/file.webp'),
    ),
    mockDeleteObject: vi.fn((_ref: unknown) => Promise.resolve()),
    mockListAll: vi.fn((_ref: unknown) =>
      Promise.resolve({ items: [] as { fullPath: string }[], prefixes: [] as { fullPath: string }[] }),
    ),
  }));

vi.mock('firebase/storage', () => ({
  ref: mockRef,
  uploadBytesResumable: mockUploadBytesResumable,
  getDownloadURL: mockGetDownloadURL,
  deleteObject: mockDeleteObject,
  listAll: mockListAll,
}));

vi.mock('../client', () => ({
  storage: { name: 'storage-mock' },
}));

import { imageService } from '../image-service';

describe('[P0] image-service upload progress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUploadBytesResumable.mockImplementation(() => ({
      on: (
        _event: string,
        next: StateChangedCallback,
        _error: ErrorCallback,
        complete: CompleteCallback,
      ) => {
        next({ bytesTransferred: 50, totalBytes: 100, state: 'running' });
        next({ bytesTransferred: 100, totalBytes: 100, state: 'running' });
        complete();
      },
    }));
    mockGetDownloadURL.mockImplementation(() =>
      Promise.resolve('https://storage.example.com/file.webp'),
    );
    mockDeleteObject.mockImplementation(() => Promise.resolve());
  });

  it('3.8-TEST-013: calls uploadBytesResumable instead of uploadBytes', async () => {
    const file = new File(['content'], 'test.webp', { type: 'image/webp' });
    const path = 'technologies/abc/uuid.webp';

    await imageService.upload(file, path);

    expect(mockUploadBytesResumable).toHaveBeenCalledWith({ fullPath: path }, file);
  });

  it('3.8-TEST-014: onProgress callback receives percentage', async () => {
    const file = new File(['content'], 'test.webp', { type: 'image/webp' });
    const path = 'technologies/abc/uuid.webp';
    const progressValues: number[] = [];

    await imageService.upload(file, path, (p) => progressValues.push(p));

    expect(progressValues).toEqual([50, 100]);
  });

  it('3.8-TEST-015: upload without onProgress still works', async () => {
    const file = new File(['content'], 'test.webp', { type: 'image/webp' });
    const path = 'technologies/abc/uuid.webp';

    const result = await imageService.upload(file, path);

    expect(result).toEqual({
      url: 'https://storage.example.com/file.webp',
      storagePath: path,
    });
  });

  it('3.8-TEST-016: replace passes onProgress to upload', async () => {
    const file = new File(['content'], 'test.webp', { type: 'image/webp' });
    const oldImage = { url: 'https://old.com/img.webp', storagePath: 'old/path.webp' };
    const newPath = 'new/path.webp';
    const progressValues: number[] = [];

    await imageService.replace(oldImage, file, newPath, (p) => progressValues.push(p));

    expect(progressValues).toEqual([50, 100]);
    expect(mockUploadBytesResumable).toHaveBeenCalled();
  });
});
