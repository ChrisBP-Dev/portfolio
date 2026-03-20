import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './client';
import type { StoredImage } from '../schemas/shared-schemas';

const RETRY_BASE_MS = 300;
const MAX_RETRIES = 2;

export function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('fetch')) return true;
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    return code === 'storage/retry-limit-exceeded' || code === 'storage/canceled';
  }
  return false;
}

export async function withRetry<T>(fn: () => Promise<T>, maxRetries = MAX_RETRIES): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_BASE_MS * 2 ** attempt));
    }
  }
  throw lastError;
}

async function upload(file: File, path: string): Promise<StoredImage> {
  return withRetry(async () => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, storagePath: path };
  });
}

async function replace(
  oldImage: StoredImage,
  file: File,
  newPath: string,
): Promise<StoredImage> {
  const newImage = await upload(file, newPath);
  try {
    await withRetry(() => deleteObject(ref(storage, oldImage.storagePath)));
  } catch (error) {
    console.warn('Failed to delete old image during replace, orphan left:', oldImage.storagePath, error);
  }
  return newImage;
}

async function deleteSingle(image: StoredImage): Promise<void> {
  await withRetry(() => deleteObject(ref(storage, image.storagePath)));
}

async function deleteByPrefix(pathPrefix: string): Promise<void> {
  const prefixRef = ref(storage, pathPrefix);
  const result = await listAll(prefixRef);
  const results = await Promise.allSettled(result.items.map((item) => deleteObject(item)));
  for (const r of results) {
    if (r.status === 'rejected') {
      console.warn('Failed to delete item during deleteByPrefix:', r.reason);
    }
  }
}

export const imageService = {
  upload,
  replace,
  delete: deleteSingle,
  deleteByPrefix,
};
