<script lang="ts">
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import type { ImageSlot } from '../../lib/schemas/image-slot';

  const locale = 'es';
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  interface Props {
    screenshots: ImageSlot[];
    onChange?: (screenshots: ImageSlot[]) => void;
  }

  let { screenshots = $bindable(), onChange }: Props = $props();

  let fileInputRef = $state<HTMLInputElement | null>(null);
  let dragOver = $state(false);

  function addFiles(files: FileList): void {
    const newSlots: ImageSlot[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toastStore.error(t('admin.validation.fileTooLarge', locale));
        continue;
      }
      if (!file.type.startsWith('image/')) continue;
      newSlots.push({ type: 'new', file, preview: URL.createObjectURL(file) });
    }
    if (newSlots.length > 0) {
      screenshots = [...screenshots, ...newSlots];
      onChange?.(screenshots);
    }
  }

  function removeScreenshot(index: number): void {
    const slot = screenshots[index];
    if (slot && (slot.type === 'new' || slot.type === 'replaced')) {
      URL.revokeObjectURL(slot.preview);
    }
    screenshots = screenshots.filter((_, i) => i !== index);
    onChange?.(screenshots);
  }

  function handleInputChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      addFiles(input.files);
    }
    input.value = '';
  }

  function handleDrop(e: DragEvent): void {
    e.preventDefault();
    dragOver = false;
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  function getPreview(slot: ImageSlot): string | null {
    if (slot.type === 'new') return slot.preview;
    if (slot.type === 'existing') return slot.image.url;
    if (slot.type === 'replaced') return slot.preview;
    return null;
  }
</script>

<div class="space-y-3">
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    {#each screenshots as slot, index (index)}
      {@const preview = getPreview(slot)}
      {#if preview}
        <div class="relative group">
          <img
            src={preview}
            alt="Screenshot {index + 1}"
            class="w-full h-24 object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onclick={() => removeScreenshot(index)}
            class="absolute top-1 right-1 p-1 bg-surface/90 border border-border rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-error/10 hover:text-error transition-all"
            aria-label="{t('admin.projects.form.removeImage', locale)} {index + 1}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      {/if}
    {/each}

    <!-- Add button -->
    <div
      class="h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors {dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
      onclick={() => fileInputRef?.click()}
      onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef?.click(); }}}
      ondrop={handleDrop}
      ondragover={(e) => { e.preventDefault(); dragOver = true; }}
      ondragleave={() => { dragOver = false; }}
      role="button"
      tabindex="0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted mb-1" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      <span class="text-xs text-text-muted">{t('admin.projects.form.addScreenshot', locale)}</span>
    </div>
  </div>

  <input
    bind:this={fileInputRef}
    type="file"
    accept="image/*"
    multiple
    onchange={handleInputChange}
    class="sr-only"
    aria-label={t('admin.projects.form.addScreenshot', locale)}
  />
</div>
