import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { StoredImage } from '../../schemas/shared-schemas';

const { mockDelete } = vi.hoisted(() => ({
  mockDelete: vi.fn((_image: StoredImage) => Promise.resolve()),
}));

vi.mock('../image-service', () => ({
  imageService: {
    delete: mockDelete,
  },
}));

import { cleanupOrphanedImages } from '../orphan-cleanup';

describe('cleanupOrphanedImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls delete for each image', () => {
    const images: StoredImage[] = [
      { url: 'https://example.com/a.webp', storagePath: 'blog/1/a.webp' },
      { url: 'https://example.com/b.webp', storagePath: 'blog/1/b.webp' },
    ];

    cleanupOrphanedImages(images);

    expect(mockDelete).toHaveBeenCalledTimes(2);
    expect(mockDelete).toHaveBeenCalledWith(images[0]);
    expect(mockDelete).toHaveBeenCalledWith(images[1]);
  });

  it('does not call delete when array is empty', () => {
    cleanupOrphanedImages([]);

    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('logs warning on failure without throwing', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = new Error('storage/object-not-found');
    mockDelete.mockRejectedValueOnce(error);

    const image: StoredImage = {
      url: 'https://example.com/fail.webp',
      storagePath: 'blog/1/fail.webp',
    };

    // Should not throw
    cleanupOrphanedImages([image]);

    // Wait for the promise rejection to be caught
    await vi.waitFor(() => {
      expect(warnSpy).toHaveBeenCalledWith(
        'Orphan image cleanup failed for',
        'blog/1/fail.webp',
        error,
      );
    });

    warnSpy.mockRestore();
  });

  it('processes all images without short-circuiting on failure', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockDelete.mockRejectedValueOnce(new Error('fail-1'));
    mockDelete.mockResolvedValueOnce(undefined);
    mockDelete.mockRejectedValueOnce(new Error('fail-3'));

    const images: StoredImage[] = [
      { url: 'https://example.com/1.webp', storagePath: 'path/1.webp' },
      { url: 'https://example.com/2.webp', storagePath: 'path/2.webp' },
      { url: 'https://example.com/3.webp', storagePath: 'path/3.webp' },
    ];

    cleanupOrphanedImages(images);

    expect(mockDelete).toHaveBeenCalledTimes(3);

    // Wait for rejections to be caught
    await vi.waitFor(() => {
      expect(warnSpy).toHaveBeenCalledTimes(2);
    });

    warnSpy.mockRestore();
  });
});
