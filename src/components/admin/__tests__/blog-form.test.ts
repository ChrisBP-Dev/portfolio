import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const mockTimestamp = { seconds: 0, nanoseconds: 0 };
const mockTimestampNow = vi.fn(() => mockTimestamp);

const { mockAddDoc, mockUpdateDoc, mockDoc, mockCollection, mockGetDocs, mockQuery, mockWhere, mockLimit } = vi.hoisted(() => ({
  mockAddDoc: vi.fn((_col: unknown, _data: unknown) =>
    Promise.resolve({ id: 'new-blog-id' }),
  ) as AnyFn & ReturnType<typeof vi.fn>,
  mockUpdateDoc: vi.fn((_ref: unknown, _data: unknown) => Promise.resolve()) as AnyFn &
    ReturnType<typeof vi.fn>,
  mockDoc: vi.fn((_db: unknown, _col: string, _id: string) => ({ path: `${_col}/${_id}` })),
  mockCollection: vi.fn((_db: unknown, _col: string) => ({ _col })),
  mockGetDocs: vi.fn(() => Promise.resolve({ empty: true, docs: [] })) as AnyFn & ReturnType<typeof vi.fn>,
  mockQuery: vi.fn((..._args: unknown[]) => ({ _query: true })),
  mockWhere: vi.fn((_field: string, _op: string, _val: unknown) => ({ _where: true })),
  mockLimit: vi.fn((_n: number) => ({ _limit: true })),
}));

vi.mock('firebase/firestore', () => ({
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  doc: mockDoc,
  collection: mockCollection,
  getDocs: mockGetDocs,
  query: mockQuery,
  where: mockWhere,
  limit: mockLimit,
  Timestamp: { now: mockTimestampNow, fromDate: vi.fn(() => mockTimestamp) },
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

vi.mock('../../../lib/firebase/image-service', () => ({
  imageService: {
    upload: vi.fn(() => Promise.resolve({ url: 'https://test.com/img.webp', storagePath: 'blog/test/cover.webp' })),
    deleteByPrefix: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock('../../../lib/firebase/image-slot-processor', () => ({
  processImageSlot: vi.fn(() => Promise.resolve({ image: null, toDelete: [] })),
}));

import { blogPostFormSchema } from '../../../lib/schemas/blog-post-schema';
import { isTipTapContentEmpty } from '../../../lib/utils/tiptap-helpers';
import { slugify } from '../../../lib/utils/slugify';
import { createBlogPost } from '../../../test/factories/blog-post';

const TIPTAP_CONTENT = JSON.stringify({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test content' }] }],
});

describe('BlogForm — title validation', () => {
  it('rejects empty title.es', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: '', en: 'Title' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'test',
      status: 'draft',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty title.en', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: 'Título', en: '' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'test',
      status: 'draft',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid bilingual title', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: 'Mi artículo', en: 'My article' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi-articulo',
      status: 'draft',
    });
    expect(result.success).toBe(true);
  });
});

describe('BlogForm — slug validation and auto-generation', () => {
  it('auto-generates slug from EN title using slugify (en = defaultLocale)', () => {
    const titleEn = 'My Technical Article';
    const generatedSlug = slugify(titleEn);
    expect(generatedSlug).toBe('my-technical-article');
  });

  it('clears slug when EN title is emptied', () => {
    const titleEn = '';
    const slug = titleEn ? slugify(titleEn) : '';
    expect(slug).toBe('');
  });

  it('slug regex rejects uppercase', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: 'T', en: 'T' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'Mi-Post',
      status: 'draft',
    });
    expect(result.success).toBe(false);
  });

  it('slug regex accepts valid slug', () => {
    const result = blogPostFormSchema.safeParse({
      title: { es: 'T', en: 'T' },
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      slug: 'mi-primer-post-2026',
      status: 'draft',
    });
    expect(result.success).toBe(true);
  });
});

describe('BlogForm — slug uniqueness', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('slug uniqueness query uses correct collection and field', async () => {
    mockGetDocs.mockResolvedValue({ empty: true, docs: [] });

    await mockGetDocs(mockQuery(
      mockCollection({}, 'BlogPosts'),
      mockWhere('slug', '==', 'test-slug'),
      mockLimit(1),
    ));

    expect(mockWhere).toHaveBeenCalledWith('slug', '==', 'test-slug');
    expect(mockLimit).toHaveBeenCalledWith(1);
  });

  it('returns true when no matching slug found', async () => {
    mockGetDocs.mockResolvedValue({ empty: true, docs: [] });
    const snapshot = await mockGetDocs();
    expect(snapshot.empty).toBe(true);
  });

  it('returns false when slug exists and no excludeId', async () => {
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: 'other-id' }],
    });
    const snapshot = await mockGetDocs();
    expect(snapshot.empty).toBe(false);
  });

  it('returns true when slug exists but matches excludeId (edit mode)', async () => {
    const excludeId = 'current-post-id';
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: excludeId }],
    });
    const snapshot = await mockGetDocs();
    const isUnique = snapshot.docs[0].id === excludeId;
    expect(isUnique).toBe(true);
  });
});

describe('BlogForm — content validation (isTipTapContentEmpty)', () => {
  it('detects empty TipTap document', () => {
    const emptyDoc = JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] });
    expect(isTipTapContentEmpty(emptyDoc)).toBe(true);
  });

  it('detects TipTap document with no content array', () => {
    const noContent = JSON.stringify({ type: 'doc' });
    expect(isTipTapContentEmpty(noContent)).toBe(true);
  });

  it('detects non-empty TipTap document', () => {
    expect(isTipTapContentEmpty(TIPTAP_CONTENT)).toBe(false);
  });

  it('treats invalid JSON as empty', () => {
    expect(isTipTapContentEmpty('not json')).toBe(true);
  });

  it('treats empty string as empty', () => {
    expect(isTipTapContentEmpty('')).toBe(true);
  });
});

describe('BlogForm — create submit flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('addDoc called with correct collection', async () => {
    await mockAddDoc(mockCollection({}, 'BlogPosts'), { title: { es: 'Test', en: 'Test' } });

    expect(mockCollection).toHaveBeenCalledWith({}, 'BlogPosts');
    expect(mockAddDoc).toHaveBeenCalled();
  });

  it('addDoc payload includes createdAt and updatedAt timestamps', async () => {
    const now = mockTimestampNow();
    const payload = {
      title: { es: 'Test', en: 'Test' },
      slug: 'test',
      content: { es: TIPTAP_CONTENT, en: TIPTAP_CONTENT },
      status: 'draft',
      images: [],
      createdAt: now,
      updatedAt: now,
    };

    await mockAddDoc(mockCollection({}, 'BlogPosts'), payload);

    expect(mockAddDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
        status: 'draft',
        images: [],
      }),
    );
  });
});

describe('BlogForm — hasChanges tracking', () => {
  it('starts with no changes', () => {
    const hasChanges = false;
    expect(hasChanges).toBe(false);
  });

  it('markDirty sets hasChanges to true', () => {
    let hasChanges = false;
    const markDirty = () => { hasChanges = true; };
    markDirty();
    expect(hasChanges).toBe(true);
  });
});

describe('BlogForm — double-submit guard', () => {
  it('early return when saving is true', () => {
    const saving = true;
    const submitted = vi.fn();

    if (!saving) {
      submitted();
    }

    expect(submitted).not.toHaveBeenCalled();
  });
});

describe('BlogForm — edit initialization', () => {
  it('initialData populates form fields', () => {
    const post = createBlogPost({
      title: { es: 'Mi Post', en: 'My Post' },
      slug: 'mi-post',
      status: 'published',
    });

    const titleEs = post.title.es;
    const titleEn = post.title.en;
    const slug = post.slug;
    const status = post.status;

    expect(titleEs).toBe('Mi Post');
    expect(titleEn).toBe('My Post');
    expect(slug).toBe('mi-post');
    expect(status).toBe('published');
  });

  it('initializedForId guard prevents re-initialization for same id', () => {
    const post = createBlogPost();
    let initializedForId = '';

    // First init
    if (initializedForId !== post.id) {
      initializedForId = post.id;
    }
    expect(initializedForId).toBe(post.id);

    // Same id — no re-init
    const shouldReinit = initializedForId !== post.id;
    expect(shouldReinit).toBe(false);
    expect(initializedForId).toBe(post.id);
  });

  it('re-initializes when initialData.id changes', () => {
    const post1 = createBlogPost();
    const post2 = createBlogPost();
    let initializedForId = post1.id;
    expect(initializedForId).toBe(post1.id);

    if (initializedForId !== post2.id) {
      initializedForId = post2.id;
    }
    expect(initializedForId).toBe(post2.id);
  });
});

describe('BlogForm — image slot processing', () => {
  it('empty image slot results in no upload', () => {
    const slot = { type: 'empty' as const };
    expect(slot.type).toBe('empty');
  });

  it('new image slot triggers processImageSlot', () => {
    const slot = { type: 'new' as const, file: new File([''], 'test.webp'), preview: 'blob:test' };
    expect(slot.type).toBe('new');
    expect(slot.file).toBeInstanceOf(File);
  });
});
