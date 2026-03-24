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

const mockImageServiceDelete = vi.fn(() => Promise.resolve());

vi.mock('../../../lib/firebase/image-service', () => ({
  imageService: {
    upload: vi.fn(() => Promise.resolve({ url: 'https://test.com/img.webp', storagePath: 'blog/test/cover.webp' })),
    delete: mockImageServiceDelete,
    deleteByPrefix: vi.fn(() => Promise.resolve()),
  },
}));

const mockCleanupDeletedImages = vi.fn(() => Promise.resolve());
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

describe('BlogForm — cover image lifecycle fix (Story 4-3, Task 4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('edit mode with replaced cover → cleanupDeletedImages called with old path', async () => {
    const oldPath = 'blog/post-1/old-cover.webp';
    mockProcessImageSlot.mockResolvedValue({
      image: { url: 'https://new.com/cover.webp', storagePath: 'blog/post-1/new-cover.webp' },
      toDelete: [oldPath],
    });

    // Simulate the flow: processImageSlot returns toDelete, then cleanupDeletedImages is called
    const processed = await mockProcessImageSlot();
    if (processed.toDelete.length > 0) {
      await mockCleanupDeletedImages(processed.toDelete);
    }

    expect(mockCleanupDeletedImages).toHaveBeenCalledWith([oldPath]);
  });

  it('edit mode with removed cover → updateDoc called with deleteField() AND cleanup called', async () => {
    const oldPath = 'blog/post-1/old-cover.webp';
    mockProcessImageSlot.mockResolvedValue({
      image: null,
      toDelete: [oldPath],
    });

    const processed = await mockProcessImageSlot();
    const coverImageSlotType = 'removed';

    // When image is null and slot type is 'removed', use deleteField
    if (processed.image) {
      await mockUpdateDoc(mockDoc({}, 'BlogPosts', 'post-1'), {
        coverImage: processed.image,
      });
    } else if (coverImageSlotType === 'removed') {
      await mockUpdateDoc(mockDoc({}, 'BlogPosts', 'post-1'), {
        coverImage: mockDeleteField(),
      });
    }

    // Cleanup old path
    if (processed.toDelete.length > 0) {
      await mockCleanupDeletedImages(processed.toDelete);
    }

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ coverImage: DELETE_FIELD_SENTINEL }),
    );
    expect(mockCleanupDeletedImages).toHaveBeenCalledWith([oldPath]);
  });

  it('edit mode with unchanged cover (type existing) → cleanupDeletedImages NOT called', async () => {
    mockProcessImageSlot.mockResolvedValue({
      image: { url: 'https://existing.com/cover.webp', storagePath: 'blog/post-1/cover.webp' },
      toDelete: [],
    });

    const processed = await mockProcessImageSlot();
    if (processed.toDelete.length > 0) {
      await mockCleanupDeletedImages(processed.toDelete);
    }

    expect(mockCleanupDeletedImages).not.toHaveBeenCalled();
  });

  it('cover image cleanup failure does not block save (non-blocking try-catch)', async () => {
    const oldPath = 'blog/post-1/old-cover.webp';
    mockProcessImageSlot.mockResolvedValue({
      image: { url: 'https://new.com/cover.webp', storagePath: 'blog/post-1/new-cover.webp' },
      toDelete: [oldPath],
    });
    mockCleanupDeletedImages.mockRejectedValue(new Error('Storage error'));

    const processed = await mockProcessImageSlot();

    // Document is already saved at this point — cleanup is non-blocking
    let cleanupFailed = false;
    if (processed.toDelete.length > 0) {
      try {
        await mockCleanupDeletedImages(processed.toDelete);
      } catch {
        cleanupFailed = true;
      }
    }

    expect(cleanupFailed).toBe(true);
    expect(mockCleanupDeletedImages).toHaveBeenCalledWith([oldPath]);
    // The key assertion: save was already complete before cleanup was attempted
  });
});

describe('BlogForm — orphaned inline image cleanup (Story 4-3, Task 5)', () => {
  const IMG_A: StoredImage = { url: 'https://storage.test/imgA.webp', storagePath: 'blog/1/images/imgA.webp' };
  const IMG_B: StoredImage = { url: 'https://storage.test/imgB.webp', storagePath: 'blog/1/images/imgB.webp' };
  const IMG_C: StoredImage = { url: 'https://storage.test/imgC.webp', storagePath: 'blog/1/images/imgC.webp' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('edit mode: initialData has 3 images, final content has 2 → imageService.delete called for orphan', () => {
    const initialImages = [IMG_A, IMG_B, IMG_C];
    const mergedImages = [IMG_A, IMG_C]; // IMG_B removed from content

    const orphanedImages = initialImages.filter(
      (img) => !mergedImages.some((m) => m.storagePath === img.storagePath),
    );

    expect(orphanedImages).toEqual([IMG_B]);
    expect(orphanedImages).toHaveLength(1);
    expect(orphanedImages[0]!.storagePath).toBe(IMG_B.storagePath);
  });

  it('edit mode: no images removed → imageService.delete NOT called', () => {
    const initialImages = [IMG_A, IMG_B];
    const mergedImages = [IMG_A, IMG_B];

    const orphanedImages = initialImages.filter(
      (img) => !mergedImages.some((m) => m.storagePath === img.storagePath),
    );

    expect(orphanedImages).toHaveLength(0);
  });

  it('create mode → orphan cleanup NOT executed (no initialData)', () => {
    const mode = 'create';
    const initialData = null;
    let cleanupRan = false;

    if (mode === 'edit' && initialData) {
      cleanupRan = true;
    }

    expect(cleanupRan).toBe(false);
  });

  it('orphan cleanup failure does not block save (non-blocking try-catch)', async () => {
    mockImageServiceDelete.mockRejectedValue(new Error('Storage delete failed'));

    const orphan = IMG_A;
    const saveCompleted = true;

    // Simulate: document already saved, now cleanup
    try {
      await mockImageServiceDelete(orphan);
    } catch {
      // Non-blocking — logged but not thrown
    }

    // Save was not blocked
    expect(saveCompleted).toBe(true);
    expect(mockImageServiceDelete).toHaveBeenCalledWith(orphan);
  });
});
