<script lang="ts">
  import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
  import { ref, deleteObject, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
  import { db, storage } from '../../lib/firebase/client';
  import { COLLECTION_PATHS } from '../../lib/firebase/collections';
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import { getFirestoreErrorMessage } from '../../lib/utils/error-messages';
  import { parseStoredResume, type StoredResume } from '../../lib/schemas/resume-schema';
  import Toast from './Toast.svelte';
  import ConfirmDialog from './ConfirmDialog.svelte';

  const locale = 'es';
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const STORAGE_PATH = 'resume/current.pdf';

  let loading = $state(true);
  let resume = $state<StoredResume | null>(null);
  let uploading = $state(false);
  let uploadProgress = $state<number | null>(null);
  let dragOver = $state(false);
  let fileInputRef = $state<HTMLInputElement | null>(null);
  let showDeleteDialog = $state(false);
  let deleting = $state(false);
  let activeTask = $state<ReturnType<typeof uploadBytesResumable> | null>(null);

  async function loadResume(): Promise<void> {
    loading = true;
    try {
      const docRef = doc(db, COLLECTION_PATHS.settings, 'resume');
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        try {
          resume = parseStoredResume(snapshot.data());
        } catch (parseError) {
          console.warn('Failed to parse stored resume data:', parseError);
          resume = null;
        }
      } else {
        resume = null;
      }
    } catch (error) {
      toastStore.error(getFirestoreErrorMessage(error, locale));
    } finally {
      loading = false;
    }
  }

  function validateFile(file: File): string | null {
    if (file.type !== 'application/pdf') {
      return t('admin.resume.invalidType', locale);
    }
    if (file.size > MAX_FILE_SIZE) {
      return t('admin.resume.fileTooLarge', locale);
    }
    return null;
  }

  async function uploadResume(file: File): Promise<void> {
    if (uploading) return;

    const validationError = validateFile(file);
    if (validationError) {
      toastStore.error(validationError);
      return;
    }

    uploading = true;
    uploadProgress = 0;
    const oldStoragePath = resume?.storagePath ?? null;
    let uploadedUrl: string | null = null;

    try {
      const storageRef = ref(storage, STORAGE_PATH);
      const task = uploadBytesResumable(storageRef, file);
      activeTask = task;

      await new Promise<void>((resolve, reject) => {
        task.on(
          'state_changed',
          (snapshot) => {
            uploadProgress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
          },
          (error) => reject(error),
          () => resolve(),
        );
      });

      const url = await getDownloadURL(storageRef);
      uploadedUrl = url;

      const resumeData = {
        url,
        storagePath: STORAGE_PATH,
        fileName: file.name,
        uploadedAt: new Date(),
      };

      const docRef = doc(db, COLLECTION_PATHS.settings, 'resume');
      await setDoc(docRef, resumeData);

      resume = resumeData;
      toastStore.success(t('admin.resume.uploadSuccess', locale));

      // Non-blocking cleanup of old file if replacing with different path
      if (oldStoragePath && oldStoragePath !== STORAGE_PATH) {
        deleteObject(ref(storage, oldStoragePath)).catch((err) => {
          console.warn('Failed to delete old resume from Storage:', oldStoragePath, err);
        });
      }
    } catch (error) {
      // If cancelled by user, don't show error toast
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'storage/canceled'
      ) {
        // Upload cancelled — no toast needed
      } else {
        // Rollback: if upload succeeded but Firestore write failed, clean up the uploaded file
        if (uploadedUrl) {
          deleteObject(ref(storage, STORAGE_PATH)).catch(console.warn);
        }
        toastStore.error(t('admin.resume.uploadError', locale));
      }
    } finally {
      uploading = false;
      uploadProgress = null;
      activeTask = null;
    }
  }

  function cancelUpload(): void {
    activeTask?.cancel();
    activeTask = null;
  }

  function handleFileSelect(file: File): void {
    uploadResume(file);
  }

  function handleInputChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) handleFileSelect(file);
    input.value = '';
  }

  function handleDrop(e: DragEvent): void {
    e.preventDefault();
    dragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) handleFileSelect(file);
  }

  function handleDragOver(e: DragEvent): void {
    e.preventDefault();
    dragOver = true;
  }

  function handleDragLeave(): void {
    dragOver = false;
  }

  function requestDelete(): void {
    showDeleteDialog = true;
  }

  function cancelDelete(): void {
    showDeleteDialog = false;
  }

  async function confirmDelete(): Promise<void> {
    if (!resume) return;
    deleting = true;
    try {
      const docRef = doc(db, COLLECTION_PATHS.settings, 'resume');
      await deleteDoc(docRef);

      // Non-blocking Storage cleanup
      deleteObject(ref(storage, resume.storagePath)).catch((err) => {
        console.warn('Failed to delete resume from Storage:', resume?.storagePath, err);
      });

      resume = null;
      showDeleteDialog = false;
      toastStore.success(t('admin.resume.deleteSuccess', locale));
    } catch (error) {
      toastStore.error(getFirestoreErrorMessage(error, locale));
    } finally {
      deleting = false;
    }
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Load resume on mount
  $effect(() => {
    loadResume();
  });
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-text-primary">{t('admin.resume.title', locale)}</h1>
  </div>

  {#if loading}
    <!-- Loading state -->
    <div class="flex items-center justify-center py-16">
      <div class="flex items-center gap-3 text-text-secondary">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm">Loading...</span>
      </div>
    </div>
  {:else if resume}
    <!-- Current resume view -->
    <div class="bg-surface border border-border rounded-lg overflow-hidden">
      <!-- Resume info bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-border">
        <div class="flex items-center gap-3 min-w-0">
          <div class="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-text-primary truncate">{resume.fileName}</p>
            <p class="text-xs text-text-secondary">{t('admin.resume.uploadedAt', locale)} {formatDate(resume.uploadedAt)}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <a
            href={resume.url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            {t('admin.resume.openInNewTab', locale)}
          </a>
          <button
            type="button"
            onclick={() => fileInputRef?.click()}
            disabled={uploading}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            {uploading ? t('admin.resume.uploading', locale) : t('admin.resume.replace', locale)}
          </button>
          <button
            type="button"
            onclick={requestDelete}
            disabled={uploading || deleting}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-error border border-error/30 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            {t('admin.resume.delete', locale)}
          </button>
        </div>
      </div>

      <!-- Upload progress bar -->
      {#if uploadProgress !== null}
        <div class="px-4 py-2 bg-surface-elevated">
          <div class="flex items-center gap-3">
            <div class="flex-1 h-2 bg-border rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full transition-[width] duration-200"
                style="width: {uploadProgress}%"
              ></div>
            </div>
            <span class="text-xs text-text-secondary font-medium tabular-nums">{uploadProgress}%</span>
            <button
              type="button"
              onclick={cancelUpload}
              class="text-xs font-medium text-error hover:text-error/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {t('admin.confirm.cancel', locale)}
            </button>
          </div>
        </div>
      {/if}

      <!-- PDF Preview iframe -->
      <div class="w-full" style="height: 600px;">
        <iframe
          src={resume.url}
          title={t('admin.resume.preview', locale)}
          class="w-full h-full border-0"
        ></iframe>
      </div>
    </div>

    <!-- Hidden file input for replace -->
    <input
      bind:this={fileInputRef}
      type="file"
      accept="application/pdf"
      onchange={handleInputChange}
      class="sr-only"
      aria-label={t('admin.resume.replace', locale)}
    />
  {:else}
    <!-- Empty state -->
    <div class="bg-surface border border-border rounded-lg p-12 text-center">
      <div class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-primary" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      </div>
      <h2 class="text-lg font-semibold text-text-primary mb-2">{t('admin.resume.empty', locale)}</h2>
      <p class="text-sm text-text-secondary mb-6 max-w-md mx-auto">{t('admin.resume.emptyCta', locale)}</p>

      <!-- Drop zone -->
      <div
        class="max-w-sm mx-auto border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors {dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
        onclick={() => fileInputRef?.click()}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef?.click(); }}}
        ondrop={handleDrop}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        role="button"
        tabindex="0"
      >
        {#if uploading}
          <div class="space-y-3">
            <svg class="animate-spin h-8 w-8 mx-auto text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-text-secondary">{t('admin.resume.uploading', locale)}</p>
            {#if uploadProgress !== null}
              <div class="flex items-center gap-3 max-w-xs mx-auto">
                <div class="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-full transition-[width] duration-200"
                    style="width: {uploadProgress}%"
                  ></div>
                </div>
                <span class="text-xs text-text-secondary font-medium tabular-nums">{uploadProgress}%</span>
                <button
                  type="button"
                  onclick={cancelUpload}
                  class="text-xs font-medium text-error hover:text-error/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  {t('admin.confirm.cancel', locale)}
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2 text-text-muted" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <p class="text-sm text-text-secondary">{t('admin.resume.dragOrClick', locale)}</p>
          <p class="text-xs text-text-muted mt-1">{t('admin.resume.fileFormats', locale)}</p>
        {/if}
      </div>

      <!-- Hidden file input for initial upload -->
      <input
        bind:this={fileInputRef}
        type="file"
        accept="application/pdf"
        onchange={handleInputChange}
        class="sr-only"
        aria-label={t('admin.resume.upload', locale)}
      />
    </div>
  {/if}
</div>

<!-- Delete confirmation dialog -->
<ConfirmDialog
  open={showDeleteDialog}
  title={t('admin.resume.deleteConfirm', locale)}
  message={t('admin.resume.deleteConfirm', locale)}
  confirmLabel={t('admin.resume.delete', locale)}
  cancelLabel={t('admin.confirm.cancel', locale)}
  confirming={deleting}
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
/>

<Toast />
