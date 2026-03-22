import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
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

/** PromiseLike wrapper that also exposes cancel() for in-flight uploads. */
export interface UploadHandle extends PromiseLike<StoredImage> {
  cancel: () => void;
}

/**
 * Upload a file to Storage. Returns an UploadHandle that is both awaitable
 * (backward-compat) and cancellable via handle.cancel().
 */
function upload(
  file: File,
  path: string,
  onProgress?: (percent: number) => void,
): UploadHandle {
  let activeTask: { cancel(): void } | null = null;
  let cancelled = false;

  const promise = withRetry(async () => {
    // Bail immediately on user-initiated cancel — not retryable
    if (cancelled) throw new Error('Upload cancelled');
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    activeTask = task;

    await new Promise<void>((resolve, reject) => {
      task.on(
        'state_changed',
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress?.(percent);
        },
        (error) => reject(error),
        () => resolve(),
      );
    });

    const url = await getDownloadURL(storageRef);
    return { url, storagePath: path };
  });

  return {
    cancel() {
      cancelled = true;
      activeTask?.cancel();
    },
    then: promise.then.bind(promise),
  };
}

async function replace(
  oldImage: StoredImage,
  file: File,
  newPath: string,
  onProgress?: (percent: number) => void,
): Promise<StoredImage> {
  const newImage = await upload(file, newPath, onProgress);
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
  const result = await withRetry(() => listAll(prefixRef));
  const deleteResults = await Promise.allSettled(
    result.items.map((item) => withRetry(() => deleteObject(item))),
  );
  for (const r of deleteResults) {
    if (r.status === 'rejected') {
      console.warn('Failed to delete item during deleteByPrefix:', r.reason);
    }
  }
  await Promise.allSettled(
    result.prefixes.map((prefix) => deleteByPrefix(prefix.fullPath)),
  );
}

export const imageService = {
  upload,
  replace,
  delete: deleteSingle,
  deleteByPrefix,
};
