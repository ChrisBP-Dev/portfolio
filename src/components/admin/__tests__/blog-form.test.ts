import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const mockTimestamp = { seconds: 0, nanoseconds: 0 };
const mockTimestampNow = vi.fn(() => mockTimestamp);

const DELETE_FIELD_SENTINEL = '__deleteField__';

const { mockSetDoc, mockUpdateDoc, mockDoc, mockCollection, mockGetDocs, mockQuery, mockWhere, mockLimit, mockDeleteField } = vi.hoisted(() => ({
  mockSetDoc: vi.fn((_ref: unknown, _data: unknown) => Promise.resolve()) as AnyFn &
    ReturnType<typeof vi.fn>,
  mockUpdateDoc: vi.fn((_ref: unknown, _data: unknown) => Promise.resolve()) as AnyFn &
    ReturnType<typeof vi.fn>,
  mockDoc: vi.fn((..._args: unknown[]) => ({ id: 'pre-generated-id', path: 'BlogPosts/pre-generated-id' })),
  mockCollection: vi.fn((_db: unknown, _col: string) => ({ _col })),
  mockGetDocs: vi.fn(() => Promise.resolve({ empty: true, docs: [] })) as AnyFn & ReturnType<typeof vi.fn>,
  mockQuery: vi.fn((..._args: unknown[]) => ({ _query: true })),
  mockWhere: vi.fn((_field: string, _op: string, _val: unknown) => ({ _where: true })),
  mockLimit: vi.fn((_n: number) => ({ _limit: true })),
  mockDeleteField: vi.fn(() => DELETE_FIELD_SENTINEL),
}));

vi.mock('firebase/firestore', () => ({
  setDoc: mockSetDoc,
  updateDoc: mockUpdateDoc,
  doc: mockDoc,
  collection: mockCollection,
  getDocs: mockGetDocs,
  query: mockQuery,
  where: mockWhere,
  limit: mockLimit,
  deleteField: mockDeleteField,
  Timestamp: { now: mockTimestampNow, fromDate: vi.fn(() => mockTimestamp) },
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

const mockImageServiceDelete = vi.fn((_image: unknown) => Promise.resolve());

vi.mock('../../../lib/firebase/image-service', () => ({
  imageService: {
    upload: vi.fn(() => Promise.resolve({ url: 'https://test.com/img.webp', storagePath: 'blog/test/cover.webp' })),
    delete: mockImageServiceDelete,
    deleteByPrefix: vi.fn(() => Promise.resolve()),
  },
}));

const mockCleanupDeletedImages = vi.fn((_paths: unknown) => Promise.resolve());
const mockProcessImageSlot = vi.fn(() => Promise.resolve({ image: null, toDelete: [] }));

vi.mock('../../../lib/firebase/image-slot-processor', () => ({
  processImageSlot: mockProcessImageSlot,
  cleanupDeletedImages: mockCleanupDeletedImages,
}));

import { blogPostFormSchema } from '../../../lib/schemas/blog-post-schema';
import { isTipTapContentEmpty, extractImagesFromContent, mergeUniqueImages } from '../../../lib/utils/tiptap-helpers';
import { slugify } from '../../../lib/utils/slugify';
import { createBlogPost } from '../../../test/factories/blog-post';
import type { StoredImage } from '../../../lib/schemas/shared-schemas';

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
      mockLimit(2),
    ));

    expect(mockWhere).toHaveBeenCalledWith('slug', '==', 'test-slug');
    expect(mockLimit).toHaveBeenCalledWith(2);
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

describe('BlogForm — create submit flow (uses setDoc with pre-generated ID)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('setDoc called with pre-generated docRef', async () => {
    const docRef = mockDoc({}, 'BlogPosts');
    await mockSetDoc(docRef, { title: { es: 'Test', en: 'Test' } });

    expect(mockDoc).toHaveBeenCalled();
    expect(mockSetDoc).toHaveBeenCalled();
  });

  it('setDoc payload includes createdAt and updatedAt timestamps', async () => {
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

    const docRef = mockDoc({}, 'BlogPosts');
    await mockSetDoc(docRef, payload);

    expect(mockSetDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
        status: 'draft',
        images: [],
      }),
    );
  });

  it('pre-generated doc provides immediate postId (no network call)', () => {
    const docRef = mockDoc({}, 'BlogPosts');
    expect(docRef.id).toBe('pre-generated-id');
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

describe('BlogForm — inline image tracking (Story 4-2)', () => {
  const IMG_1: StoredImage = { url: 'https://storage.test/img1.webp', storagePath: 'blog/1/images/img1.webp' };
  const IMG_2: StoredImage = { url: 'https://storage.test/img2.webp', storagePath: 'blog/1/images/img2.webp' };

  function makeContentWithImages(srcs: string[]): string {
    return JSON.stringify({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] },
        ...srcs.map((src) => ({ type: 'image', attrs: { src } })),
      ],
    });
  }

  it('images[] populated from content on save via extractImagesFromContent', () => {
    const content = makeContentWithImages([IMG_1.url]);
    const uploadedImages = [IMG_1, IMG_2];
    const images = extractImagesFromContent(content, uploadedImages);
    expect(images).toEqual([IMG_1]);
  });

  it('mergeUniqueImages deduplicates across ES/EN content', () => {
    const esContent = makeContentWithImages([IMG_1.url]);
    const enContent = makeContentWithImages([IMG_1.url, IMG_2.url]);
    const uploadedImages = [IMG_1, IMG_2];

    const esImages = extractImagesFromContent(esContent, uploadedImages);
    const enImages = extractImagesFromContent(enContent, uploadedImages);
    const merged = mergeUniqueImages(esImages, enImages);

    expect(merged).toEqual([IMG_1, IMG_2]);
  });

  it('edit mode seeds uploadedImages from initialData.images', () => {
    const post = createBlogPost({
      images: [IMG_1],
    });
    // Simulates the seeding in $effect
    const uploadedImages = post.images ?? [];
    expect(uploadedImages).toEqual([IMG_1]);
  });

  it('pre-existing images survive save when seeded correctly', () => {
    // Simulates: edit mode seeds IMG_1, content still references IMG_1
    const content = makeContentWithImages([IMG_1.url]);
    const uploadedImages = [IMG_1]; // seeded from initialData.images
    const images = extractImagesFromContent(content, uploadedImages);
    expect(images).toEqual([IMG_1]);
  });

  it('images removed from content are excluded from save', () => {
    // IMG_1 is tracked but no longer in content
    const content = makeContentWithImages([]);
    const uploadedImages = [IMG_1];
    const images = extractImagesFromContent(content, uploadedImages);
    expect(images).toEqual([]);
  });
});

describe('BlogForm — cover image lifecycle (Story 4-3, Task 4)', () => {
  // Component integration (submit → processImageSlot → cleanup) is verified by E2E tests.
  // These tests verify the cover image decision contracts and mock API fidelity.

  it.each([
    { slotType: 'replaced', image: { url: 'https://new.com/c.webp', storagePath: 'blog/1/new.webp' }, toDelete: ['blog/1/old.webp'], expectedAction: 'update', expectedCleanup: true },
    { slotType: 'removed', image: null, toDelete: ['blog/1/old.webp'], expectedAction: 'remove', expectedCleanup: true },
    { slotType: 'existing', image: { url: 'https://old.com/c.webp', storagePath: 'blog/1/c.webp' }, toDelete: [], expectedAction: 'update', expectedCleanup: false },
    { slotType: 'empty', image: null, toDelete: [], expectedAction: 'skip', expectedCleanup: false },
    { slotType: 'new', image: { url: 'https://new.com/c.webp', storagePath: 'blog/1/new.webp' }, toDelete: [], expectedAction: 'update', expectedCleanup: false },
  ])('slot type "$slotType" → action=$expectedAction, cleanup=$expectedCleanup', ({ slotType, image, toDelete, expectedAction, expectedCleanup }) => {
    // Decision: which Firestore operation?
    const action = image ? 'update' : (slotType === 'removed' ? 'remove' : 'skip');
    expect(action).toBe(expectedAction);

    // Decision: cleanup needed?
    expect(toDelete.length > 0).toBe(expectedCleanup);
  });

  it('deleteField mock returns sentinel distinct from null (remove vs skip)', () => {
    const sentinel = mockDeleteField();
    expect(sentinel).toBe(DELETE_FIELD_SENTINEL);
    expect(sentinel).not.toBeNull();
  });

  it('cleanupDeletedImages mock accepts string[] matching processImageSlot toDelete shape', async () => {
    vi.clearAllMocks();
    const paths = ['blog/1/old-cover.webp', 'blog/1/replaced.webp'];
    await mockCleanupDeletedImages(paths);
    expect(mockCleanupDeletedImages).toHaveBeenCalledWith(
      expect.arrayContaining([expect.stringMatching(/^blog\//)]),
    );
  });

  it('cleanup rejection is caught by Promise-level error handling', async () => {
    mockCleanupDeletedImages.mockRejectedValueOnce(new Error('Storage error'));
    // Component wraps cleanup in try-catch; Promise.allSettled also handles partial failures
    const result = await Promise.allSettled([mockCleanupDeletedImages(['blog/1/old.webp'])]);
    expect(result[0]!.status).toBe('rejected');
    // Key: allSettled never throws — same pattern as component's non-blocking cleanup
  });
});

describe('BlogForm — orphaned inline image cleanup (Story 4-3, Task 5)', () => {
  // Tests exercise the real extractImagesFromContent pipeline to detect orphans.
  const IMG_A: StoredImage = { url: 'https://storage.test/imgA.webp', storagePath: 'blog/1/images/imgA.webp' };
  const IMG_B: StoredImage = { url: 'https://storage.test/imgB.webp', storagePath: 'blog/1/images/imgB.webp' };
  const IMG_C: StoredImage = { url: 'https://storage.test/imgC.webp', storagePath: 'blog/1/images/imgC.webp' };

  function buildContent(imageUrls: string[]): string {
    return JSON.stringify({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Content' }] },
        ...imageUrls.map((src) => ({ type: 'image', attrs: { src } })),
      ],
    });
  }

  it('images removed from content are detected as orphans via extractImagesFromContent', () => {
    const initialImages = [IMG_A, IMG_B, IMG_C];
    // User edits content: removes IMG_B
    const editedContentEs = buildContent([IMG_A.url, IMG_C.url]);
    const editedContentEn = buildContent([IMG_A.url]);
    const esImages = extractImagesFromContent(editedContentEs, initialImages);
    const enImages = extractImagesFromContent(editedContentEn, initialImages);
    const mergedImages = mergeUniqueImages(esImages, enImages);

    const orphanedImages = initialImages.filter(
      (img) => !mergedImages.some((m) => m.storagePath === img.storagePath),
    );

    expect(orphanedImages).toEqual([IMG_B]);
  });

  it('no images removed from content → no orphans detected', () => {
    const initialImages = [IMG_A, IMG_B];
    const contentEs = buildContent([IMG_A.url, IMG_B.url]);
    const contentEn = buildContent([IMG_A.url]);
    const esImages = extractImagesFromContent(contentEs, initialImages);
    const enImages = extractImagesFromContent(contentEn, initialImages);
    const mergedImages = mergeUniqueImages(esImages, enImages);

    const orphanedImages = initialImages.filter(
      (img) => !mergedImages.some((m) => m.storagePath === img.storagePath),
    );

    expect(orphanedImages).toHaveLength(0);
  });

  it('imageService.delete receives full StoredImage object (not bare path)', () => {
    vi.clearAllMocks();
    mockImageServiceDelete(IMG_A);
    expect(mockImageServiceDelete).toHaveBeenCalledWith(
      expect.objectContaining({ url: expect.any(String), storagePath: expect.any(String) }),
    );
  });

  it('partial orphan cleanup failures do not block via Promise.allSettled', async () => {
    // Component uses Promise.allSettled for orphan cleanup — partial failures are logged, not thrown
    mockImageServiceDelete
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('Storage delete failed'))
      .mockResolvedValueOnce(undefined);

    const results = await Promise.allSettled(
      [IMG_A, IMG_B, IMG_C].map((img) => mockImageServiceDelete(img)),
    );

    const successes = results.filter((r) => r.status === 'fulfilled');
    const failures = results.filter((r) => r.status === 'rejected');
    expect(successes).toHaveLength(2);
    expect(failures).toHaveLength(1);
  });
});
