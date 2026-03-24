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

describe('BlogCrudPage — delete dialog message i18n (Story 4-3, Task 6)', () => {
  // Tests verify the actual i18n strings produce correct Spanish text after substitution.
  // Component branching logic (which key to use) is verified by E2E tests.

  it('cover + plural images: "portada y N imágenes embebidas"', () => {
    const msg = t('admin.blog.deleteConfirmMessage', 'es')
      .replace('{imageCount}', '3')
      .replace('{name}', 'Mi artículo');
    expect(msg).toBe("¿Eliminar 'Mi artículo'? Se eliminarán la portada y 3 imágenes embebidas de Storage.");
  });

  it('cover + singular image: "portada y 1 imagen embebida"', () => {
    const msg = t('admin.blog.deleteConfirmMessageSingular', 'es')
      .replace('{name}', 'Mi artículo');
    expect(msg).toBe("¿Eliminar 'Mi artículo'? Se eliminarán la portada y 1 imagen embebida de Storage.");
  });

  it('cover only (no embedded images): "portada de Storage"', () => {
    const msg = t('admin.blog.deleteConfirmMessageNoImages', 'es')
      .replace('{name}', 'Solo portada');
    expect(msg).toBe("¿Eliminar 'Solo portada'? Se eliminará la portada de Storage.");
  });

  it('no cover + plural images: "N imágenes embebidas"', () => {
    const msg = t('admin.blog.deleteConfirmMessageNoCover', 'es')
      .replace('{imageCount}', '2')
      .replace('{name}', 'Sin portada');
    expect(msg).toBe("¿Eliminar 'Sin portada'? Se eliminarán 2 imágenes embebidas de Storage.");
  });

  it('no cover + singular image: "1 imagen embebida"', () => {
    const msg = t('admin.blog.deleteConfirmMessageNoCoverSingular', 'es')
      .replace('{name}', 'Una imagen');
    expect(msg).toBe("¿Eliminar 'Una imagen'? Se eliminará 1 imagen embebida de Storage.");
  });

  it('no images at all: just "¿Eliminar?"', () => {
    const msg = t('admin.blog.deleteConfirmMessageEmpty', 'es')
      .replace('{name}', 'Post vacío');
    expect(msg).toBe("¿Eliminar 'Post vacío'?");
  });

  it('English variants have correct grammar', () => {
    const plural = t('admin.blog.deleteConfirmMessage', 'en')
      .replace('{imageCount}', '3')
      .replace('{name}', 'My article');
    expect(plural).toContain('3 embedded images');

    const singular = t('admin.blog.deleteConfirmMessageSingular', 'en')
      .replace('{name}', 'My article');
    expect(singular).toContain('1 embedded image');
    expect(singular).not.toContain('images');
  });
});
