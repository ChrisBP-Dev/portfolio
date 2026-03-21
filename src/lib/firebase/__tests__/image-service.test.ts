import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockRef, mockUploadBytesResumable, mockGetDownloadURL, mockDeleteObject, mockListAll } =
  vi.hoisted(() => ({
    mockRef: vi.fn((_storage: unknown, _path: string) => ({ fullPath: _path })),
    mockUploadBytesResumable: vi.fn((_ref: unknown, _file: unknown) => ({
      on: (_event: string, _next: unknown, _error: unknown, complete: () => void) => {
        complete();
      },
    })),
    mockGetDownloadURL: vi.fn((_ref: unknown) =>
      Promise.resolve('https://storage.example.com/file.webp'),
    ),
    mockDeleteObject: vi.fn((_ref: unknown) => Promise.resolve()),
    mockListAll: vi.fn((_ref: unknown) =>
      Promise.resolve({
        items: [] as { fullPath: string }[],
        prefixes: [] as { fullPath: string }[],
      }),
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

import { imageService, isRetryableError, withRetry } from '../image-service';

describe('ImageService', () => {
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
    mockListAll.mockImplementation((_ref: unknown) =>
      Promise.resolve({
        items: [] as { fullPath: string }[],
        prefixes: [] as { fullPath: string }[],
      }),
    );
  });

  describe('upload', () => {
    it('uploads file and returns StoredImage with url and storagePath', async () => {
      const file = new File(['content'], 'test.webp', { type: 'image/webp' });
      const path = 'projects/abc123/main/uuid.webp';

      const result = await imageService.upload(file, path);

      expect(mockRef).toHaveBeenCalledWith({ name: 'storage-mock' }, path);
      expect(mockUploadBytesResumable).toHaveBeenCalledWith({ fullPath: path }, file);
      expect(mockGetDownloadURL).toHaveBeenCalledWith({ fullPath: path });
      expect(result).toEqual({
        url: 'https://storage.example.com/file.webp',
        storagePath: path,
      });
    });
  });

  describe('replace', () => {
    const oldImage = {
      url: 'https://storage.example.com/old.webp',
      storagePath: 'projects/abc123/main/old-uuid.webp',
    };

    it('uploads new file before deleting old (safe-first order)', async () => {
      const file = new File(['new'], 'new.webp', { type: 'image/webp' });
      const newPath = 'projects/abc123/main/new-uuid.webp';
      const callOrder: string[] = [];

      mockUploadBytesResumable.mockImplementation(() => ({
        on: (_event: string, _next: unknown, _error: unknown, complete: () => void) => {
          callOrder.push('upload');
          complete();
        },
      }));
      mockDeleteObject.mockImplementation(() => {
        callOrder.push('delete');
        return Promise.resolve();
      });

      const result = await imageService.replace(oldImage, file, newPath);

      expect(callOrder[0]).toBe('upload');
      expect(callOrder).toContain('delete');
      expect(result).toEqual({
        url: 'https://storage.example.com/file.webp',
        storagePath: newPath,
      });
    });

    it('does not call delete if upload fails', async () => {
      const file = new File(['new'], 'new.webp', { type: 'image/webp' });
      const newPath = 'projects/abc123/main/new-uuid.webp';

      mockUploadBytesResumable.mockImplementation(() => ({
        on: (_event: string, _next: unknown, errorCb: unknown) => {
          (errorCb as (e: Error) => void)(new Error('Upload failed'));
        },
      }));

      await expect(imageService.replace(oldImage, file, newPath)).rejects.toThrow('Upload failed');
      expect(mockDeleteObject).not.toHaveBeenCalled();
    });

    it('returns new image and warns if delete of old fails', async () => {
      const file = new File(['new'], 'new.webp', { type: 'image/webp' });
      const newPath = 'projects/abc123/main/new-uuid.webp';
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mockDeleteObject.mockImplementation(() => Promise.reject(new Error('Delete failed')));

      const result = await imageService.replace(oldImage, file, newPath);

      expect(result).toEqual({
        url: 'https://storage.example.com/file.webp',
        storagePath: newPath,
      });
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('delete', () => {
    it('deletes file at the correct storage path', async () => {
      const image = {
        url: 'https://storage.example.com/file.webp',
        storagePath: 'projects/abc123/main/uuid.webp',
      };

      await imageService.delete(image);

      expect(mockRef).toHaveBeenCalledWith({ name: 'storage-mock' }, image.storagePath);
      expect(mockDeleteObject).toHaveBeenCalledWith({ fullPath: image.storagePath });
    });
  });

  describe('deleteByPrefix', () => {
    it('lists all items and deletes each one', async () => {
      const items = [
        { fullPath: 'projects/abc123/img1.webp' },
        { fullPath: 'projects/abc123/img2.webp' },
      ];
      mockListAll.mockImplementation(() => Promise.resolve({ items, prefixes: [] }));

      await imageService.deleteByPrefix('projects/abc123/');

      expect(mockListAll).toHaveBeenCalled();
      expect(mockDeleteObject).toHaveBeenCalledTimes(2);
      expect(mockDeleteObject).toHaveBeenCalledWith(items[0]);
      expect(mockDeleteObject).toHaveBeenCalledWith(items[1]);
    });

    it('recurses into subdirectory prefixes', async () => {
      const nestedItems = [{ fullPath: 'projects/abc123/main/uuid.webp' }];
      mockListAll
        .mockImplementationOnce(() =>
          Promise.resolve({
            items: [],
            prefixes: [{ fullPath: 'projects/abc123/main/' }],
          }),
        )
        .mockImplementationOnce(() =>
          Promise.resolve({ items: nestedItems, prefixes: [] }),
        );

      await imageService.deleteByPrefix('projects/abc123/');

      expect(mockListAll).toHaveBeenCalledTimes(2);
      expect(mockDeleteObject).toHaveBeenCalledWith(nestedItems[0]);
    });

    it('completes without error when no items exist', async () => {
      await imageService.deleteByPrefix('projects/empty/');

      expect(mockListAll).toHaveBeenCalled();
      expect(mockDeleteObject).not.toHaveBeenCalled();
    });

    it('logs warning for individual delete failures but does not throw', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const items = [{ fullPath: 'projects/abc123/img1.webp' }];
      mockListAll.mockImplementation(() => Promise.resolve({ items, prefixes: [] }));
      mockDeleteObject.mockImplementation(() => Promise.reject(new Error('Delete fail')));

      await imageService.deleteByPrefix('projects/abc123/');

      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});

describe('isRetryableError', () => {
  it('returns true for storage/retry-limit-exceeded', () => {
    expect(isRetryableError({ code: 'storage/retry-limit-exceeded' })).toBe(true);
  });

  it('returns true for storage/canceled', () => {
    expect(isRetryableError({ code: 'storage/canceled' })).toBe(true);
  });

  it('returns true for TypeError with fetch message', () => {
    expect(isRetryableError(new TypeError('Failed to fetch'))).toBe(true);
  });

  it('returns false for storage/unauthorized', () => {
    expect(isRetryableError({ code: 'storage/unauthorized' })).toBe(false);
  });

  it('returns false for storage/object-not-found', () => {
    expect(isRetryableError({ code: 'storage/object-not-found' })).toBe(false);
  });

  it('returns false for storage/quota-exceeded', () => {
    expect(isRetryableError({ code: 'storage/quota-exceeded' })).toBe(false);
  });

  it('returns false for generic Error', () => {
    expect(isRetryableError(new Error('generic'))).toBe(false);
  });
});

describe('withRetry', () => {
  it('succeeds after one retry', async () => {
    let calls = 0;
    const fn = vi.fn(() => {
      calls++;
      if (calls === 1) {
        return Promise.reject(new TypeError('Failed to fetch'));
      }
      return Promise.resolve('success');
    });

    const result = await withRetry(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws after all retries are exhausted', async () => {
    const fn = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')));

    await expect(withRetry(fn)).rejects.toThrow('Failed to fetch');
    expect(fn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
  });

  it('throws immediately for non-retryable errors', async () => {
    const error = Object.assign(new Error('Not found'), { code: 'storage/object-not-found' });
    const fn = vi.fn(() => Promise.reject(error));

    await expect(withRetry(fn)).rejects.toThrow('Not found');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
