<script lang="ts">
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import type { ImageSlot } from '../../lib/schemas/image-slot';

  const locale = 'es';
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  interface Props {
    label: string;
    slot: ImageSlot;
    required?: boolean;
    error?: string;
    onChange?: (slot: ImageSlot) => void;
  }

  let { label, slot = $bindable(), required = false, error = '', onChange }: Props = $props();

  let dragOver = $state(false);
  let fileInputRef = $state<HTMLInputElement | null>(null);

  const preview = $derived(
    slot.type === 'new' ? slot.preview :
    slot.type === 'existing' ? slot.image.url :
    slot.type === 'replaced' ? slot.preview :
    null
  );

  const fieldId = $derived(`img-${label.toLowerCase().replace(/\s+/g, '-')}`);
  const errorId = $derived(`${fieldId}-error`);

  function handleFile(file: File): void {
    if (file.size > MAX_FILE_SIZE) {
      toastStore.error(t('admin.validation.fileTooLarge', locale));
      return;
    }
    if (!file.type.startsWith('image/')) return;

    // Revoke previous object URL to prevent memory leak
    if (slot.type === 'new' || slot.type === 'replaced') {
      URL.revokeObjectURL(slot.preview);
    }

    const objectUrl = URL.createObjectURL(file);
    if (slot.type === 'existing') {
      slot = { type: 'replaced', old: slot.image, file, preview: objectUrl };
    } else {
      slot = { type: 'new', file, preview: objectUrl };
    }
    onChange?.(slot);
  }

  function handleInputChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) handleFile(file);
    input.value = '';
  }

  function handleDrop(e: DragEvent): void {
    e.preventDefault();
    dragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: DragEvent): void {
    e.preventDefault();
    dragOver = true;
  }

  function handleDragLeave(): void {
    dragOver = false;
  }

  function removeImage(): void {
    if (slot.type === 'new' || slot.type === 'replaced') {
      URL.revokeObjectURL(slot.preview);
    }
    if (slot.type === 'existing') {
      slot = { type: 'removed', old: slot.image };
    } else if (slot.type === 'replaced') {
      slot = { type: 'removed', old: slot.old };
    } else {
      slot = { type: 'empty' };
    }
    onChange?.(slot);
  }

  // Cleanup object URLs on component destroy
  $effect(() => {
    return () => {
      if (slot.type === 'new' || slot.type === 'replaced') {
        URL.revokeObjectURL(slot.preview);
      }
    };
  });
</script>

<div class="space-y-1">
  <label for={fieldId} class="text-sm font-medium text-text-primary">
    {label}
    {#if required}<span class="text-error" aria-hidden="true">*</span>{/if}
  </label>

  {#if preview}
    <!-- Preview state -->
    <div class="relative w-full max-w-xs">
      <img
        src={preview}
        alt={label}
        class="w-full h-48 object-cover rounded-lg border border-border"
      />
      {#if slot.type === 'existing'}
        <span class="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded bg-blue-500 text-white">{t('admin.imageStatus.existing', locale)}</span>
      {:else if slot.type === 'new'}
        <span class="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded bg-green-500 text-white">{t('admin.imageStatus.new', locale)}</span>
      {:else if slot.type === 'replaced'}
        <span class="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded bg-orange-500 text-white">{t('admin.imageStatus.replaced', locale)}</span>
      {/if}
      <button
        type="button"
        onclick={removeImage}
        class="absolute top-2 right-2 p-1 bg-surface/90 border border-border rounded-full hover:bg-error/10 hover:text-error transition-colors"
        aria-label={t('admin.projects.form.removeImage', locale)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  {:else}
    <!-- Empty state — drop zone -->
    <div
      class="w-full max-w-xs border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors {dragOver ? 'border-primary bg-primary/5' : error ? 'border-error' : 'border-border hover:border-primary/50'}"
      onclick={() => fileInputRef?.click()}
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef?.click(); }}}
      ondrop={handleDrop}
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      role="button"
      tabindex="0"
      aria-describedby={error ? errorId : undefined}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2 text-text-muted" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <p class="text-sm text-text-secondary">{t('admin.projects.form.dragOrClick', locale)}</p>
      <p class="text-xs text-text-muted mt-1">{t('admin.projects.form.imageFormats', locale)}</p>
    </div>

    <input
      bind:this={fileInputRef}
      id={fieldId}
      type="file"
      accept="image/*"
      onchange={handleInputChange}
      class="sr-only"
      aria-label={label}
    />
  {/if}

  {#if error}
    <p id={errorId} class="text-xs text-error" role="alert">{error}</p>
  {/if}
</div>
