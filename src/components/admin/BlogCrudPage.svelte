<script lang="ts">
  import { deleteDoc, doc } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { imageService } from '../../lib/firebase/image-service';
  import type { BlogPostWithId } from '../../lib/schemas/blog-post-schema';
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import { getFirestoreErrorMessage } from '../../lib/utils/error-messages';
  import BlogList from './BlogList.svelte';
  import BlogForm from './BlogForm.svelte';
  import ConfirmDialog from './ConfirmDialog.svelte';
  import Toast from './Toast.svelte';

  const locale = 'es';
  const BLOG_COLLECTION = 'BlogPosts';

  let viewMode = $state<'list' | 'create' | 'edit'>('list');
  let listRef = $state<BlogList | null>(null);
  let formRef = $state<BlogForm | null>(null);
  let editingPost = $state<BlogPostWithId | null>(null);

  // Delete flow state
  let deletingPost = $state<BlogPostWithId | null>(null);
  let showDeleteDialog = $state(false);
  let deleting = $state(false);

  function navigateToList(): void {
    if (formRef?.getHasChanges() && !window.confirm(t('admin.blog.form.discardChanges', locale))) {
      return;
    }
    viewMode = 'list';
    editingPost = null;
  }

  function handleSaved(): void {
    viewMode = 'list';
    editingPost = null;
    listRef?.loadPosts();
  }

  function handleEdit(post: BlogPostWithId): void {
    editingPost = post;
    viewMode = 'edit';
  }

  function handleDeleteRequest(post: BlogPostWithId): void {
    deletingPost = post;
    showDeleteDialog = true;
  }

  function handleCancelDelete(): void {
    showDeleteDialog = false;
    deletingPost = null;
  }

  async function handleConfirmDelete(): Promise<void> {
    if (!deletingPost) return;
    deleting = true;
    try {
      // Safe-first order: delete document first, then images (Epic 3 fix D-1)
      await deleteDoc(doc(db, BLOG_COLLECTION, deletingPost.id));

      // Non-blocking image cleanup
      try {
        await imageService.deleteByPrefix(`blog/${deletingPost.id}/`);
      } catch (imgError) {
        console.warn('Image cleanup failed (orphans may remain):', imgError);
      }

      toastStore.success(t('admin.blog.deleteSuccessToast', locale));
      showDeleteDialog = false;
      deletingPost = null;
      listRef?.loadPosts();
    } catch (error) {
      console.error('Failed to delete blog post:', error);
      toastStore.error(getFirestoreErrorMessage(error, locale));
      showDeleteDialog = false;
      deletingPost = null;
    } finally {
      deleting = false;
    }
  }

  let deleteDialogMessage = $derived.by(() => {
    if (!deletingPost) return '';
    return t('admin.blog.deleteConfirmMessage', locale)
      .replace('{name}', deletingPost.title.es);
  });
</script>

<div class="p-6 lg:p-8">
  {#if viewMode === 'list'}
    <BlogList
      bind:this={listRef}
      onCreateNew={() => (viewMode = 'create')}
      onEdit={handleEdit}
      onDelete={handleDeleteRequest}
    />
  {:else}
    <div class="mb-6">
      <button
        type="button"
        onclick={navigateToList}
        class="text-sm text-text-secondary hover:text-primary transition-colors mb-2 inline-flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        {t('admin.blog.title', locale)}
      </button>
      <h1 class="text-2xl font-bold text-text-primary">
        {viewMode === 'edit'
          ? t('admin.blog.editTitle', locale)
          : t('admin.blog.createTitle', locale)}
      </h1>
    </div>
    <BlogForm
      bind:this={formRef}
      mode={viewMode === 'edit' ? 'edit' : 'create'}
      initialData={viewMode === 'edit' ? editingPost : null}
      onCancel={navigateToList}
      onSaved={handleSaved}
    />
  {/if}
</div>

<ConfirmDialog
  open={showDeleteDialog}
  title={t('admin.blog.deleteConfirmTitle', locale)}
  message={deleteDialogMessage}
  confirmLabel={deleting ? t('admin.confirm.deleting', locale) : t('admin.blog.deleteConfirmButton', locale)}
  cancelLabel={t('admin.confirm.cancel', locale)}
  confirming={deleting}
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
/>

<Toast />
