import { describe, it, expect } from 'vitest';
import {
  blogPostSchema,
  blogPostFirestoreSchema,
  blogPostFormSchema,
} from '../schemas/blog-post-schema';

const TIPTAP_CONTENT = JSON.stringify({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test' }] }],
});

describe('blogPostSchema — base validation', () => {
  it('accepts valid blog post with all fields', () => {
    const result = blogPostSchema.safeParse({
      id: 'test-id',
      title: { es: 'Título', en: 'Title' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi-post',
      coverImage: { url: 'https://example.com/img.webp', storagePath: 'blog/cover.webp' },
      images: [],
      status: 'published',
      createdAt: new Date('2026-03-10'),
      updatedAt: new Date('2026-03-14'),
    });
    expect(result.success).toBe(true);
  });

  it('accepts blog post without coverImage (optional)', () => {
    const result = blogPostSchema.safeParse({
      id: 'test-id',
      title: { es: 'Título', en: 'Title' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi-post',
      images: [],
      status: 'draft',
      createdAt: new Date('2026-03-10'),
      updatedAt: new Date('2026-03-14'),
    });
    expect(result.success).toBe(true);
  });

  it('rejects updatedAt before createdAt', () => {
    const result = blogPostSchema.safeParse({
      id: 'test-id',
      title: { es: 'Título', en: 'Title' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi-post',
      images: [],
      status: 'draft',
      createdAt: new Date('2026-03-14'),
      updatedAt: new Date('2026-03-10'),
    });
    expect(result.success).toBe(false);
  });
});

describe('blogPostSchema — slug validation', () => {
  it('accepts valid slug with lowercase and hyphens', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: 'T', en: 'T' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi-primer-post',
      status: 'draft',
    });
    expect(result.success).toBe(true);
  });

  it('rejects slug with uppercase', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: 'T', en: 'T' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'Mi-Post',
      status: 'draft',
    });
    expect(result.success).toBe(false);
  });

  it('rejects slug with spaces', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: 'T', en: 'T' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi post',
      status: 'draft',
    });
    expect(result.success).toBe(false);
  });

  it('rejects slug with special characters', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: 'T', en: 'T' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi_post!',
      status: 'draft',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty slug', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: 'T', en: 'T' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: '',
      status: 'draft',
    });
    expect(result.success).toBe(false);
  });
});

describe('blogPostFirestoreSchema — firestore variant', () => {
  it('accepts data without id', () => {
    const result = blogPostFirestoreSchema.safeParse({
      title: { es: 'Título', en: 'Title' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi-post',
      images: [],
      status: 'published',
      createdAt: new Date('2026-03-10'),
      updatedAt: new Date('2026-03-14'),
    });
    expect(result.success).toBe(true);
  });

  it('defaults images to empty array when omitted', () => {
    const result = blogPostFirestoreSchema.safeParse({
      title: { es: 'Título', en: 'Title' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi-post',
      status: 'draft',
      createdAt: new Date('2026-03-10'),
      updatedAt: new Date('2026-03-14'),
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.images).toEqual([]);
    }
  });
});

describe('blogPostFormSchema — form variant', () => {
  it('accepts valid form data', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: 'Mi post', en: 'My post' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi-post',
      status: 'draft',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing title.es', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: '', en: 'My post' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi-post',
      status: 'draft',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid status value', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: 'T', en: 'T' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi-post',
      status: 'archived',
    });
    expect(result.success).toBe(false);
  });
});
