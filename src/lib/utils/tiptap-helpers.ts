import type { StoredImage } from '../schemas/shared-schemas';

export function isTipTapContentEmpty(json: string): boolean {
  try {
    const doc = JSON.parse(json);
    if (!doc.content || doc.content.length === 0) return true;
    // Single empty paragraph = empty
    if (
      doc.content.length === 1 &&
      doc.content[0].type === 'paragraph' &&
      !doc.content[0].content
    )
      return true;
    return false;
  } catch {
    return true;
  }
}

function findImageNodes(node: unknown, urls: Set<string>): void {
  if (!node || typeof node !== 'object') return;
  const n = node as Record<string, unknown>;
  if (n.type === 'image' && typeof n.attrs === 'object' && n.attrs !== null) {
    const src = (n.attrs as Record<string, unknown>).src;
    if (typeof src === 'string') urls.add(src);
  }
  if (Array.isArray(n.content)) {
    for (const child of n.content) findImageNodes(child, urls);
  }
}

export function extractImagesFromContent(
  contentJson: string,
  uploadedImages: StoredImage[],
): StoredImage[] {
  try {
    const doc = JSON.parse(contentJson);
    const imageUrls = new Set<string>();
    findImageNodes(doc, imageUrls);
    return uploadedImages.filter((img) => imageUrls.has(img.url));
  } catch {
    return [];
  }
}

export function mergeUniqueImages(...imageLists: StoredImage[][]): StoredImage[] {
  const seen = new Set<string>();
  const result: StoredImage[] = [];
  for (const list of imageLists) {
    for (const img of list) {
      if (!seen.has(img.storagePath)) {
        seen.add(img.storagePath);
        result.push(img);
      }
    }
  }
  return result;
}
