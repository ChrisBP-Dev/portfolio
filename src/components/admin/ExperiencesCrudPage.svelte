<script lang="ts">
  import { deleteDoc, doc } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import type { ExperienceWithId } from '../../lib/schemas/experience-schema';
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import { getFirestoreErrorMessage } from '../../lib/utils/error-messages';
  import ExperienceList from './ExperienceList.svelte';
  import ExperienceForm from './ExperienceForm.svelte';
  import ConfirmDialog from './ConfirmDialog.svelte';
  import Toast from './Toast.svelte';

  const locale = 'es';
  const EXPERIENCES_COLLECTION = 'Experiences';

  let viewMode = $state<'list' | 'create' | 'edit'>('list');
  let listRef = $state<ExperienceList | null>(null);
  let editingExp = $state<ExperienceWithId | null>(null);

  // Delete flow state
  let deletingExp = $state<ExperienceWithId | null>(null);
  let showDeleteDialog = $state(false);
  let deleting = $state(false);

  function handleSaved(): void {
    viewMode = 'list';
    editingExp = null;
    listRef?.loadExperiences();
  }

  function handleEdit(exp: ExperienceWithId): void {
    editingExp = exp;
    viewMode = 'edit';
  }

  function handleDeleteRequest(exp: ExperienceWithId): void {
    deletingExp = exp;
    showDeleteDialog = true;
  }

  function handleCancelDelete(): void {
    showDeleteDialog = false;
    deletingExp = null;
  }

  async function handleConfirmDelete(): Promise<void> {
    if (!deletingExp) return;
    deleting = true;
    try {
      await deleteDoc(doc(db, EXPERIENCES_COLLECTION, deletingExp.id));
      toastStore.success(t('admin.experiences.deleteSuccessToast', locale));
      showDeleteDialog = false;
      deletingExp = null;
      listRef?.loadExperiences();
    } catch (error) {
      console.error('Failed to delete experience:', error);
      toastStore.error(getFirestoreErrorMessage(error, locale));
      showDeleteDialog = false;
      deletingExp = null;
    } finally {
      deleting = false;
    }
  }

  let deleteDialogMessage = $derived.by(() => {
    if (!deletingExp) return '';
    return t('admin.experiences.deleteConfirmMessage', locale)
      .replace('{name}', deletingExp.companyName);
  });
</script>

<div class="p-6 lg:p-8">
  {#if viewMode === 'list'}
    <ExperienceList
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
          editingExp = null;
        }}
        class="text-sm text-text-secondary hover:text-primary transition-colors mb-2 inline-flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        {t('admin.experiences.title', locale)}
      </button>
      <h1 class="text-2xl font-bold text-text-primary">
        {viewMode === 'edit'
          ? t('admin.experiences.editTitle', locale)
          : t('admin.experiences.createTitle', locale)}
      </h1>
    </div>
    <ExperienceForm
      mode={viewMode === 'edit' ? 'edit' : 'create'}
      initialData={viewMode === 'edit' ? editingExp : null}
      onCancel={() => {
        viewMode = 'list';
        editingExp = null;
      }}
      onSaved={handleSaved}
    />
  {/if}
</div>

<ConfirmDialog
  open={showDeleteDialog}
  title={t('admin.experiences.deleteConfirmTitle', locale)}
  message={deleteDialogMessage}
  confirmLabel={deleting ? t('admin.confirm.deleting', locale) : t('admin.experiences.deleteConfirmButton', locale)}
  cancelLabel={t('admin.confirm.cancel', locale)}
  confirming={deleting}
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
/>

<Toast />
