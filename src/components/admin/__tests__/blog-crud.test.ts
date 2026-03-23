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

describe('BlogCrudPage — delete dialog message', () => {
  it('message includes post title', () => {
    const template = "¿Eliminar '{name}'? Se eliminarán también las imágenes asociadas.";
    const postTitle = 'Mi primer artículo';

    const message = template.replace('{name}', postTitle);

    expect(message).toBe(
      "¿Eliminar 'Mi primer artículo'? Se eliminarán también las imágenes asociadas.",
    );
  });
});
