<script lang="ts">
  import { imageService } from '../../lib/firebase/image-service';
  import type { UploadHandle } from '../../lib/firebase/image-service';
  import type { StoredImage } from '../../lib/schemas/shared-schemas';
  import type { ImageSlot } from '../../lib/schemas/image-slot';
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import { getFirestoreErrorMessage } from '../../lib/utils/error-messages';
  import ImageUploader from './ImageUploader.svelte';

  const locale = 'es';

  interface Props {
    open: boolean;
    postId: string;
    onClose: () => void;
    onImageUploaded: (image: StoredImage, alt: string) => void;
  }

  let { open, postId, onClose, onImageUploaded }: Props = $props();

  let dialogEl = $state<HTMLDivElement | null>(null);
  let imageSlot = $state<ImageSlot>({ type: 'empty' });
  let altText = $state('');
  let uploading = $state(false);
  let uploadProgress = $state<number | null>(null);
  let activeHandle = $state<UploadHandle | null>(null);

  const canInsert = $derived(imageSlot.type === 'new');

  // Body scroll lock
  $effect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  });

  // Auto-focus cancel button on open
  $effect(() => {
    if (open && dialogEl) {
      const cancelBtn = dialogEl.querySelector<HTMLElement>('[data-cancel]');
      cancelBtn?.focus();
    }
  });

  // Cleanup on unmount: cancel active upload, revoke objectURLs
  $effect(() => {
    return () => {
      activeHandle?.cancel();
      if (imageSlot.type === 'new' || imageSlot.type === 'replaced') {
        URL.revokeObjectURL(imageSlot.preview);
      }
    };
  });

  function resetState(): void {
    if (imageSlot.type === 'new' || imageSlot.type === 'replaced') {
      URL.revokeObjectURL(imageSlot.preview);
    }
    imageSlot = { type: 'empty' };
    altText = '';
    uploading = false;
    uploadProgress = null;
    activeHandle = null;
  }

  function handleCancel(): void {
    if (uploading) {
      activeHandle?.cancel();
    }
    resetState();
    onClose();
  }

  async function handleInsert(): Promise<void> {
    if (imageSlot.type !== 'new' || uploading) return;

    uploading = true;
    uploadProgress = 0;

    const path = `blog/${postId}/images/${crypto.randomUUID()}.webp`;
    const handle = imageService.upload(imageSlot.file, path, (p) => {
      uploadProgress = p;
    });
    activeHandle = handle;

    try {
      const storedImage = await handle;
      const alt = altText.trim();
      resetState();
      onImageUploaded(storedImage, alt);
      onClose();
    } catch (error) {
      uploading = false;
      uploadProgress = null;
      activeHandle = null;
      toastStore.error(getFirestoreErrorMessage(error, locale));
    }
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && !uploading) {
      handleCancel();
      return;
    }
    if (e.key !== 'Tab' || !dialogEl) return;
    const focusable = dialogEl.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [role="button"]:not([disabled]), [tabindex="0"]',
    );
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget && !uploading) {
      handleCancel();
    }
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="image-upload-dialog-title"
    onkeydown={handleKeydown}
    onclick={handleBackdropClick}
  >
    <div
      bind:this={dialogEl}
      class="bg-surface border border-border rounded-xl shadow-lg w-full max-w-md p-6"
    >
      <h2
        id="image-upload-dialog-title"
        class="text-lg font-bold text-text-primary mb-4"
      >
        {t('admin.blog.insertImageTitle', locale)}
      </h2>

      <!-- ImageUploader -->
      <ImageUploader
        label={t('admin.blog.insertImage', locale)}
        bind:slot={imageSlot}
        uploadProgress={uploading ? uploadProgress : null}
      />

      <!-- Alt text input -->
      <div class="mt-4">
        <label for="image-alt-text" class="text-sm font-medium text-text-primary">
          {t('admin.blog.imageAltText', locale)}
        </label>
        <input
          id="image-alt-text"
          type="text"
          bind:value={altText}
          disabled={uploading}
          class="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
        />
      </div>

      <!-- Upload progress bar -->
      {#if uploading && uploadProgress !== null}
        <div class="mt-4">
          <div
            class="h-2 bg-border rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={uploadProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              class="h-full bg-primary rounded-full transition-[width] duration-200"
              style="width: {uploadProgress}%"
            ></div>
          </div>
          <p class="text-xs text-text-secondary mt-1">{t('admin.blog.uploading', locale)}</p>
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          type="button"
          data-cancel
          onclick={handleCancel}
          disabled={uploading}
          class="px-4 py-2 rounded-lg font-semibold border border-border text-text-primary transition-colors hover:bg-surface-alt disabled:opacity-50"
        >
          {t('admin.blog.form.cancel', locale)}
        </button>

        <button
          type="button"
          onclick={handleInsert}
          disabled={!canInsert || uploading}
          aria-busy={uploading}
          class="px-4 py-2 rounded-lg font-semibold text-white [background:var(--brand-gradient)] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {#if uploading}
            <svg class="w-4 h-4 motion-safe:animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          {/if}
          {t('admin.blog.insertButton', locale)}
        </button>
      </div>
    </div>
  </div>
{/if}
