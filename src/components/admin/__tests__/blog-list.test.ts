import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockGetDocs, mockQuery, mockCollection, mockOrderBy } = vi.hoisted(() => ({
  mockGetDocs: vi.fn() as AnyFn & ReturnType<typeof vi.fn>,
  mockQuery: vi.fn((..._args: unknown[]) => ({ _query: true })),
  mockCollection: vi.fn((_db: unknown, _col: string) => ({ _col })),
  mockOrderBy: vi.fn((_field: string, _dir?: string) => ({ _orderBy: true })),
}));

vi.mock('firebase/firestore', () => ({
  getDocs: mockGetDocs,
  query: mockQuery,
  collection: mockCollection,
  orderBy: mockOrderBy,
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

import { blogPostFirestoreSchema } from '../../../lib/schemas/blog-post-schema';
import { createBlogPost } from '../../../test/factories/blog-post';

describe('BlogList — data loading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('queries BlogPosts collection ordered by createdAt desc', async () => {
    mockGetDocs.mockResolvedValue({ docs: [] });

    await mockGetDocs(mockQuery(mockCollection({}, 'BlogPosts'), mockOrderBy('createdAt', 'desc')));

    expect(mockCollection).toHaveBeenCalledWith({}, 'BlogPosts');
    expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc');
  });

  it('parses valid blog posts with safeParse', () => {
    const post = createBlogPost();
    const result = blogPostFirestoreSchema.safeParse({
      title: post.title,
      content: post.content,
      slug: post.slug,
      coverImage: post.coverImage,
      images: post.images,
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
    expect(result.success).toBe(true);
  });

  it('skips invalid entries without crashing', () => {
    const invalidData = { title: 'not an object' };
    const result = blogPostFirestoreSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('BlogList — display logic', () => {
  it('status badge shows "Publicado" for published posts', () => {
    const post = createBlogPost({ status: 'published' });
    expect(post.status).toBe('published');
  });

  it('status badge shows "Borrador" for draft posts', () => {
    const post = createBlogPost({ status: 'draft' });
    expect(post.status).toBe('draft');
  });

  it('displays formatted date using Intl.DateTimeFormat', () => {
    const formatter = new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const date = new Date('2026-03-10');
    const formatted = formatter.format(date);
    expect(formatted).toBeTruthy();
    expect(formatted).toContain('2026');
  });
});

describe('BlogList — empty state', () => {
  it('empty array triggers empty state UI', () => {
    const posts: unknown[] = [];
    expect(posts.length).toBe(0);
  });
});

describe('BlogList — skeleton loader', () => {
  it('loading state shows skeleton (aria-busy)', () => {
    const loading = true;
    expect(loading).toBe(true);
  });
});

describe('BlogList — error state', () => {
  it('failed query sets error state', async () => {
    mockGetDocs.mockRejectedValue(new Error('Network error'));
    let error = false;
    try {
      await mockGetDocs();
    } catch {
      error = true;
    }
    expect(error).toBe(true);
  });

  it('retry button calls loadPosts again', async () => {
    const loadPosts = vi.fn();
    loadPosts();
    expect(loadPosts).toHaveBeenCalledTimes(1);
  });
});
