import { describe, it, expect } from 'vitest';
import {
  isTipTapContentEmpty,
  extractImagesFromContent,
  mergeUniqueImages,
} from '../tiptap-helpers';
import type { StoredImage } from '../../schemas/shared-schemas';

const IMG_A: StoredImage = { url: 'https://storage.test/a.webp', storagePath: 'blog/1/images/a.webp' };
const IMG_B: StoredImage = { url: 'https://storage.test/b.webp', storagePath: 'blog/1/images/b.webp' };
const IMG_C: StoredImage = { url: 'https://storage.test/c.webp', storagePath: 'blog/1/images/c.webp' };

function makeContent(images: { src: string; alt?: string }[]): string {
  const imageNodes = images.map((img) => ({
    type: 'image',
    attrs: { src: img.src, ...(img.alt ? { alt: img.alt } : {}) },
  }));
  return JSON.stringify({
    type: 'doc',
    content: [
      { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
      ...imageNodes,
    ],
  });
}

describe('isTipTapContentEmpty', () => {
  it('returns true for empty doc', () => {
    expect(isTipTapContentEmpty(JSON.stringify({ type: 'doc', content: [] }))).toBe(true);
  });

  it('returns true for single empty paragraph', () => {
    expect(
      isTipTapContentEmpty(JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] })),
    ).toBe(true);
  });

  it('returns false for doc with text', () => {
    const content = JSON.stringify({
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }],
    });
    expect(isTipTapContentEmpty(content)).toBe(false);
  });

  it('returns true for invalid JSON', () => {
    expect(isTipTapContentEmpty('not json')).toBe(true);
  });

  it('returns true for empty string', () => {
    expect(isTipTapContentEmpty('')).toBe(true);
  });
});

describe('extractImagesFromContent', () => {
  it('returns empty for empty content', () => {
    const result = extractImagesFromContent('', [IMG_A]);
    expect(result).toEqual([]);
  });

  it('returns empty when no images in content', () => {
    const content = JSON.stringify({
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'No images' }] }],
    });
    expect(extractImagesFromContent(content, [IMG_A])).toEqual([]);
  });

  it('matches uploaded images present in content', () => {
    const content = makeContent([{ src: IMG_A.url }]);
    expect(extractImagesFromContent(content, [IMG_A, IMG_B])).toEqual([IMG_A]);
  });

  it('returns multiple matched images', () => {
    const content = makeContent([{ src: IMG_A.url }, { src: IMG_B.url }]);
    expect(extractImagesFromContent(content, [IMG_A, IMG_B, IMG_C])).toEqual([IMG_A, IMG_B]);
  });

  it('ignores external URLs not in uploadedImages', () => {
    const content = makeContent([
      { src: IMG_A.url },
      { src: 'https://external.com/photo.jpg' },
    ]);
    const result = extractImagesFromContent(content, [IMG_A]);
    expect(result).toEqual([IMG_A]);
  });

  it('handles malformed JSON gracefully', () => {
    expect(extractImagesFromContent('{broken', [IMG_A])).toEqual([]);
  });

  it('handles nested content with images', () => {
    const content = JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Before' },
          ],
        },
        { type: 'image', attrs: { src: IMG_B.url, alt: 'test' } },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'After' }],
        },
      ],
    });
    expect(extractImagesFromContent(content, [IMG_A, IMG_B])).toEqual([IMG_B]);
  });

  it('returns empty when uploadedImages is empty', () => {
    const content = makeContent([{ src: IMG_A.url }]);
    expect(extractImagesFromContent(content, [])).toEqual([]);
  });
});

describe('mergeUniqueImages', () => {
  it('returns empty for no lists', () => {
    expect(mergeUniqueImages()).toEqual([]);
  });

  it('returns images from single list', () => {
    expect(mergeUniqueImages([IMG_A, IMG_B])).toEqual([IMG_A, IMG_B]);
  });

  it('deduplicates by storagePath across lists', () => {
    expect(mergeUniqueImages([IMG_A, IMG_B], [IMG_B, IMG_C])).toEqual([IMG_A, IMG_B, IMG_C]);
  });

  it('deduplicates within same list', () => {
    expect(mergeUniqueImages([IMG_A, IMG_A])).toEqual([IMG_A]);
  });

  it('handles empty lists', () => {
    expect(mergeUniqueImages([], [IMG_A], [])).toEqual([IMG_A]);
  });
});
