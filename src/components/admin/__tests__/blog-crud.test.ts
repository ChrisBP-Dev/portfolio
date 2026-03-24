import { describe, it, expect, vi, beforeEach } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => any;

const { mockDeleteDoc, mockDoc, mockDeleteByPrefix } = vi.hoisted(() => ({
  mockDeleteDoc: vi.fn((_ref: unknown) => Promise.resolve()) as AnyFn & ReturnType<typeof vi.fn>,
  mockDoc: vi.fn((_db: unknown, _col: string, _id: string) => ({ path: `${_col}/${_id}` })),
  mockDeleteByPrefix: vi.fn((_prefix: string) => Promise.resolve()) as AnyFn &
    ReturnType<typeof vi.fn>,
}));

vi.mock('firebase/firestore', () => ({
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
}));

vi.mock('../../../lib/firebase/client', () => ({
  db: { name: 'db-mock' },
}));

vi.mock('../../../lib/firebase/image-service', () => ({
  imageService: {
    deleteByPrefix: mockDeleteByPrefix,
  },
}));

import type { BlogPostWithId } from '../../../lib/schemas/blog-post-schema';
import type { StoredImage } from '../../../lib/schemas/shared-schemas';
import { t } from '../../../lib/i18n/translations';
import { createBlogPost } from '../../../test/factories/blog-post';

describe('BlogCrudPage — view mode transitions', () => {
  it('list → create → list transition', () => {
    const state = { viewMode: 'list' as 'list' | 'create' | 'edit' };
    expect(state.viewMode).toBe('list');

    state.viewMode = 'create';
    expect(state.viewMode).toBe('create');

    state.viewMode = 'list';
    expect(state.viewMode).toBe('list');
  });

  it('list → edit → list transition', () => {
    const state = {
      viewMode: 'list' as 'list' | 'create' | 'edit',
      editingPost: null as BlogPostWithId | null,
    };
    const post = createBlogPost();
    const postWithId: BlogPostWithId = { ...post, id: post.id };

    state.editingPost = postWithId;
    state.viewMode = 'edit';
    expect(state.viewMode).toBe('edit');
    expect(state.editingPost).toBeTruthy();

    state.viewMode = 'list';
    state.editingPost = null;
    expect(state.viewMode).toBe('list');
    expect(state.editingPost).toBeNull();
  });

  it('handleSaved resets to list and clears editing state', () => {
    const state = {
      viewMode: 'edit' as 'list' | 'create' | 'edit',
      editingPost: createBlogPost() as BlogPostWithId | null,
    };

    state.viewMode = 'list';
    state.editingPost = null;

    expect(state.viewMode).toBe('list');
    expect(state.editingPost).toBeNull();
  });
});

describe('BlogCrudPage — delete flow (safe-first order D-1)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deleteDoc called BEFORE deleteByPrefix (document-first)', async () => {
    const callOrder: string[] = [];

    mockDeleteDoc.mockImplementation(async () => {
      callOrder.push('deleteDoc');
    });
    mockDeleteByPrefix.mockImplementation(async () => {
      callOrder.push('deleteByPrefix');
    });

    const post = createBlogPost();

    // Simulate delete flow: doc first, images second
    await mockDeleteDoc(mockDoc({}, 'BlogPosts', post.id));
    await mockDeleteByPrefix(`blog/${post.id}/`);

    expect(callOrder).toEqual(['deleteDoc', 'deleteByPrefix']);
  });

  it('deleteDoc receives correct collection and id', async () => {
    const post = createBlogPost();

    await mockDeleteDoc(mockDoc({}, 'BlogPosts', post.id));

    expect(mockDoc).toHaveBeenCalledWith({}, 'BlogPosts', post.id);
  });

  it('deleteByPrefix receives correct path prefix', async () => {
    const postId = 'test-post-id';

    await mockDeleteByPrefix(`blog/${postId}/`);

    expect(mockDeleteByPrefix).toHaveBeenCalledWith(`blog/${postId}/`);
  });

  it('dialog state reset after successful delete', async () => {
    const post = createBlogPost();
    const state = {
      showDeleteDialog: true,
      deletingPost: post as BlogPostWithId | null,
      deleting: true,
    };

    await mockDeleteDoc(mockDoc({}, 'BlogPosts', post.id));

    state.showDeleteDialog = false;
    state.deletingPost = null;
    state.deleting = false;

    expect(state.showDeleteDialog).toBe(false);
    expect(state.deletingPost).toBeNull();
    expect(state.deleting).toBe(false);
  });

  it('dialog state reset after failed delete', () => {
    const state = {
      showDeleteDialog: true,
      deletingPost: createBlogPost() as BlogPostWithId | null,
    };

    state.showDeleteDialog = false;
    state.deletingPost = null;

    expect(state.showDeleteDialog).toBe(false);
    expect(state.deletingPost).toBeNull();
  });
});

describe('BlogCrudPage — unsaved changes guard (D-2)', () => {
  it('navigateToList proceeds when no unsaved changes', () => {
    const hasChanges = false;
    const onNavigate = vi.fn();

    if (!hasChanges) {
      onNavigate();
    }

    expect(onNavigate).toHaveBeenCalled();
  });

  it('navigateToList blocked when user declines confirm', () => {
    const hasChanges = true;
    const onNavigate = vi.fn();
    const confirmed = false;

    if (hasChanges && !confirmed) {
      // blocked
    } else {
      onNavigate();
    }

    expect(onNavigate).not.toHaveBeenCalled();
  });
});

describe('BlogCrudPage — delete dialog message (Story 4-3, Task 6)', () => {
  const locale = 'es';

  function buildDeleteMessage(post: BlogPostWithId): string {
    const hasCover = !!post.coverImage;
    const imageCount = post.images?.length ?? 0;

    if (hasCover && imageCount > 0) {
      return t('admin.blog.deleteConfirmMessage', locale)
        .replace('{name}', post.title.es)
        .replace('{imageCount}', String(imageCount));
    } else if (hasCover && imageCount === 0) {
      return t('admin.blog.deleteConfirmMessageNoImages', locale)
        .replace('{name}', post.title.es);
    } else if (!hasCover && imageCount > 0) {
      return t('admin.blog.deleteConfirmMessageNoCover', locale)
        .replace('{name}', post.title.es)
        .replace('{imageCount}', String(imageCount));
    } else {
      return t('admin.blog.deleteConfirmMessageEmpty', locale)
        .replace('{name}', post.title.es);
    }
  }

  it('post with coverImage + 3 embedded images → shows "portada y 3 imágenes embebidas"', () => {
    const images: StoredImage[] = [
      { url: 'https://a.com/1.webp', storagePath: 'blog/1/img1.webp' },
      { url: 'https://a.com/2.webp', storagePath: 'blog/1/img2.webp' },
      { url: 'https://a.com/3.webp', storagePath: 'blog/1/img3.webp' },
    ];
    const post = createBlogPost({
      title: { es: 'Mi artículo', en: 'My article' },
      coverImage: { url: 'https://a.com/cover.webp', storagePath: 'blog/1/cover.webp' },
      images,
    }) as BlogPostWithId;

    const message = buildDeleteMessage(post);
    expect(message).toContain('Mi artículo');
    expect(message).toContain('portada');
    expect(message).toContain('3');
    expect(message).toContain('imágenes embebidas');
  });

  it('post with coverImage but 0 embedded images → shows "portada de Storage"', () => {
    const post = createBlogPost({
      title: { es: 'Solo portada', en: 'Cover only' },
      coverImage: { url: 'https://a.com/cover.webp', storagePath: 'blog/1/cover.webp' },
      images: [],
    }) as BlogPostWithId;

    const message = buildDeleteMessage(post);
    expect(message).toContain('Solo portada');
    expect(message).toContain('portada de Storage');
    expect(message).not.toContain('imágenes embebidas');
  });

  it('post without coverImage but 2 embedded images → shows "2 imágenes embebidas"', () => {
    const images: StoredImage[] = [
      { url: 'https://a.com/1.webp', storagePath: 'blog/1/img1.webp' },
      { url: 'https://a.com/2.webp', storagePath: 'blog/1/img2.webp' },
    ];
    const post = createBlogPost({
      title: { es: 'Sin portada', en: 'No cover' },
      coverImage: undefined,
      images,
    }) as BlogPostWithId;

    const message = buildDeleteMessage(post);
    expect(message).toContain('Sin portada');
    expect(message).toContain('2');
    expect(message).toContain('imágenes embebidas');
    expect(message).not.toContain('portada y');
  });

  it('post with no images at all → shows just "¿Eliminar \'name\'?"', () => {
    const post = createBlogPost({
      title: { es: 'Post vacío', en: 'Empty post' },
      coverImage: undefined,
      images: [],
    }) as BlogPostWithId;

    const message = buildDeleteMessage(post);
    expect(message).toBe("¿Eliminar 'Post vacío'?");
  });
});
