import { ref, deleteObject } from 'firebase/storage';
import { storage } from './client';
import { imageService, withRetry } from './image-service';
import type { StoredImage } from '../schemas/shared-schemas';
import type { ImageSlot } from '../schemas/image-slot';

export type ProcessedSlot = {
  image: StoredImage | null;
  toDelete: string[];
};

export async function processImageSlot(
  slot: ImageSlot,
  basePath: string,
): Promise<ProcessedSlot> {
  switch (slot.type) {
    case 'empty':
      return { image: null, toDelete: [] };
    case 'existing':
      return { image: slot.image, toDelete: [] };
    case 'new': {
      const image = await imageService.upload(
        slot.file,
        basePath + crypto.randomUUID() + '.webp',
      );
      return { image, toDelete: [] };
    }
    case 'replaced': {
      const image = await imageService.upload(
        slot.file,
        basePath + crypto.randomUUID() + '.webp',
      );
      return { image, toDelete: [slot.old.storagePath] };
    }
    case 'removed':
      return { image: null, toDelete: [slot.old.storagePath] };
  }
}

export async function cleanupDeletedImages(paths: string[]): Promise<void> {
  const results = await Promise.allSettled(
    paths.map((path) => withRetry(() => deleteObject(ref(storage, path)))),
  );
  for (const r of results) {
    if (r.status === 'rejected') {
      console.warn('Failed to cleanup deleted image:', r.reason);
    }
  }
}
