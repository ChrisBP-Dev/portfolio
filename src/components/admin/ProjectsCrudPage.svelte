<script lang="ts">
  import { deleteDoc, doc } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { imageService } from '../../lib/firebase/image-service';
  import type { ProjectWithId } from '../../lib/schemas/project-schema';
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import ProjectList from './ProjectList.svelte';
  import ProjectForm from './ProjectForm.svelte';
  import ConfirmDialog from './ConfirmDialog.svelte';
  import Toast from './Toast.svelte';

  const locale = 'es';
  const PROJECTS_COLLECTION = 'Projects';

  let viewMode = $state<'list' | 'create' | 'edit'>('list');
  let listRef = $state<ProjectList | null>(null);
  let editingProject = $state<ProjectWithId | null>(null);

  // Delete flow state
  let deletingProject = $state<ProjectWithId | null>(null);
  let showDeleteDialog = $state(false);
  let deleting = $state(false);

  function handleSaved(): void {
    viewMode = 'list';
    editingProject = null;
    listRef?.loadProjects();
  }

  function handleEdit(project: ProjectWithId): void {
    editingProject = project;
    viewMode = 'edit';
  }

  function handleDeleteRequest(project: ProjectWithId): void {
    deletingProject = project;
    showDeleteDialog = true;
  }

  function handleCancelDelete(): void {
    showDeleteDialog = false;
    deletingProject = null;
  }

  async function handleConfirmDelete(): Promise<void> {
    if (!deletingProject) return;
    deleting = true;
    try {
      await imageService.deleteByPrefix(`projects/${deletingProject.id}/`);
      await deleteDoc(doc(db, PROJECTS_COLLECTION, deletingProject.id));
      toastStore.success(t('admin.projects.deleteSuccessToast', locale));
      showDeleteDialog = false;
      deletingProject = null;
      listRef?.loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      toastStore.error(t('admin.projects.deleteErrorToast', locale));
      showDeleteDialog = false;
      deletingProject = null;
    } finally {
      deleting = false;
    }
  }

  let deleteDialogMessage = $derived.by(() => {
    if (!deletingProject) return '';
    const imageCount =
      (deletingProject.mainImage ? 1 : 0) + (deletingProject.screenshots?.length ?? 0);
    return t('admin.projects.deleteConfirmMessage', locale)
      .replace('{name}', deletingProject.companyName.es)
      .replace('{count}', String(imageCount));
  });
</script>

<div class="p-6 lg:p-8">
  {#if viewMode === 'list'}
    <ProjectList
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
          editingProject = null;
        }}
        class="text-sm text-text-secondary hover:text-primary transition-colors mb-2 inline-flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>
        {t('admin.projects.title', locale)}
      </button>
      <h1 class="text-2xl font-bold text-text-primary">
        {viewMode === 'edit'
          ? t('admin.projects.editTitle', locale)
          : t('admin.projects.createTitle', locale)}
      </h1>
    </div>
    <ProjectForm
      mode={viewMode === 'edit' ? 'edit' : 'create'}
      initialData={viewMode === 'edit' ? editingProject : null}
      onCancel={() => {
        viewMode = 'list';
        editingProject = null;
      }}
      onSaved={handleSaved}
    />
  {/if}
</div>

<ConfirmDialog
  open={showDeleteDialog}
  title={t('admin.projects.deleteConfirmTitle', locale)}
  message={deleteDialogMessage}
  confirmLabel={deleting ? t('admin.confirm.deleting', locale) : t('admin.projects.deleteConfirmButton', locale)}
  cancelLabel={t('admin.confirm.cancel', locale)}
  confirming={deleting}
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
/>

<Toast />
