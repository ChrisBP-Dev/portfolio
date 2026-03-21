<script lang="ts">
  import { deleteDoc, doc } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { imageService } from '../../lib/firebase/image-service';
  import type { TechnologyWithId } from '../../lib/schemas/technology-schema';
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import { getFirestoreErrorMessage } from '../../lib/utils/error-messages';
  import TechnologyList from './TechnologyList.svelte';
  import TechnologyForm from './TechnologyForm.svelte';
  import ConfirmDialog from './ConfirmDialog.svelte';
  import Toast from './Toast.svelte';

  const locale = 'es';
  const TECHNOLOGIES_COLLECTION = 'Technologies';

  let viewMode = $state<'list' | 'create' | 'edit'>('list');
  let listRef = $state<TechnologyList | null>(null);
  let editingTech = $state<TechnologyWithId | null>(null);

  // Delete flow state
  let deletingTech = $state<TechnologyWithId | null>(null);
  let showDeleteDialog = $state(false);
  let deleting = $state(false);

  function handleSaved(): void {
    viewMode = 'list';
    editingTech = null;
    listRef?.loadTechnologies();
  }

  function handleEdit(tech: TechnologyWithId): void {
    editingTech = tech;
    viewMode = 'edit';
  }

  function handleDeleteRequest(tech: TechnologyWithId): void {
    deletingTech = tech;
    showDeleteDialog = true;
  }

  function handleCancelDelete(): void {
    showDeleteDialog = false;
    deletingTech = null;
  }

  async function handleConfirmDelete(): Promise<void> {
    if (!deletingTech) return;
    deleting = true;
    try {
      await imageService.delete(deletingTech.image);
      await deleteDoc(doc(db, TECHNOLOGIES_COLLECTION, deletingTech.id));
      toastStore.success(t('admin.technologies.deleteSuccessToast', locale));
      showDeleteDialog = false;
      deletingTech = null;
      listRef?.loadTechnologies();
    } catch (error) {
      console.error('Failed to delete technology:', error);
      toastStore.error(getFirestoreErrorMessage(error, locale));
      showDeleteDialog = false;
      deletingTech = null;
    } finally {
      deleting = false;
    }
  }

  let deleteDialogMessage = $derived.by(() => {
    if (!deletingTech) return '';
    return t('admin.technologies.deleteConfirmMessage', locale)
      .replace('{name}', deletingTech.name);
  });
</script>

<div class="p-6 lg:p-8">
  {#if viewMode === 'list'}
    <TechnologyList
      bind:this={listRef}
      onCreateNew={() => (viewMode = 'create')}
      onEdit={handleEdit}
      onDelete={handleDeleteRequest}
    />
  {:else}
    <div class="mb-6">
      <button
        type="button"
        onclick={() => {
          viewMode = 'list';
          editingTech = null;
        }}
        class="text-sm text-text-secondary hover:text-primary transition-colors mb-2 inline-flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        {t('admin.technologies.title', locale)}
      </button>
      <h1 class="text-2xl font-bold text-text-primary">
        {viewMode === 'edit'
          ? t('admin.technologies.editTitle', locale)
          : t('admin.technologies.createTitle', locale)}
      </h1>
    </div>
    <TechnologyForm
      mode={viewMode === 'edit' ? 'edit' : 'create'}
      initialData={viewMode === 'edit' ? editingTech : null}
      onCancel={() => {
        viewMode = 'list';
        editingTech = null;
      }}
      onSaved={handleSaved}
    />
  {/if}
</div>

<ConfirmDialog
  open={showDeleteDialog}
  title={t('admin.technologies.deleteConfirmTitle', locale)}
  message={deleteDialogMessage}
  confirmLabel={deleting ? t('admin.confirm.deleting', locale) : t('admin.technologies.deleteConfirmButton', locale)}
  cancelLabel={t('admin.confirm.cancel', locale)}
  confirming={deleting}
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
/>

<Toast />
