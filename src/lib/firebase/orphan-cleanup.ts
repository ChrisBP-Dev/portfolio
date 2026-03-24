import { imageService } from './image-service';
import type { StoredImage } from '../schemas/shared-schemas';

export function cleanupOrphanedImages(images: StoredImage[]): void {
  for (const img of images) {
    imageService.delete(img).catch((error) => {
      console.warn('Orphan image cleanup failed for', img.storagePath, error);
    });
  }
}
