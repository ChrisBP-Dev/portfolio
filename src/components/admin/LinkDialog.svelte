<script lang="ts">
  import { t } from '../../lib/i18n/translations';

  const locale = 'es';

  interface Props {
    open: boolean;
    initialUrl?: string;
    onApply: (url: string) => void;
    onRemove: () => void;
    onCancel: () => void;
  }

  let {
    open,
    initialUrl = '',
    onApply,
    onRemove,
    onCancel,
  }: Props = $props();

  let dialogEl = $state<HTMLDivElement | null>(null);
  let url = $state('');
  let validationError = $state('');

  const isEditing = $derived(initialUrl !== '');
  const title = $derived(
    isEditing
      ? t('admin.blog.linkDialogEditTitle', locale)
      : t('admin.blog.linkDialogTitle', locale),
  );

  // Sync url state when dialog opens
  $effect(() => {
    if (open) {
      url = initialUrl;
      validationError = '';
    }
  });

  // Body scroll lock
  $effect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  });

  // Auto-focus URL input on open
  $effect(() => {
    if (open && dialogEl) {
      const input = dialogEl.querySelector<HTMLInputElement>('input[type="url"]');
      input?.focus();
      input?.select();
    }
  });

  function isValidUrl(value: string): boolean {
    if (!value.trim()) return false;
    return /^(https?:\/\/|mailto:).+/.test(value.trim());
  }

  function handleApply(): void {
    const trimmed = url.trim();
    if (!isValidUrl(trimmed)) {
      validationError = t('admin.blog.linkDialogInvalidUrl', locale);
      return;
    }
    validationError = '';
    onApply(trimmed);
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      onCancel();
      return;
    }
    if (e.key === 'Enter' && (e.target as HTMLElement)?.tagName === 'INPUT') {
      e.preventDefault();
      handleApply();
      return;
    }
    if (e.key !== 'Tab' || !dialogEl) return;
    const focusable = dialogEl.querySelectorAll<HTMLElement>(
      'input:not([disabled]), button:not([disabled])',
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
    if (e.target === e.currentTarget) {
      onCancel();
    }
  }
</script>

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="link-dialog-title"
    onkeydown={handleKeydown}
    onclick={handleBackdropClick}
  >
    <div
      bind:this={dialogEl}
      class="bg-surface border border-border rounded-xl shadow-lg w-full max-w-md p-6"
    >
      <h2
        id="link-dialog-title"
        class="text-lg font-bold text-text-primary mb-4"
      >
        {title}
      </h2>

      <div class="mb-4">
        <label for="link-dialog-url" class="block text-sm font-medium text-text-secondary mb-1">
          URL
        </label>
        <input
          id="link-dialog-url"
          type="url"
          bind:value={url}
          placeholder={t('admin.blog.linkDialogPlaceholder', locale)}
          aria-invalid={validationError ? 'true' : undefined}
          aria-describedby={validationError ? 'link-dialog-error' : undefined}
          class="w-full px-3 py-2 rounded-lg border text-sm bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary {validationError ? 'border-error' : 'border-border'}"
        />
        {#if validationError}
          <p id="link-dialog-error" class="text-xs text-error mt-1" role="alert">
            {validationError}
          </p>
        {/if}
      </div>

      <div class="flex justify-between">
        <div>
          {#if isEditing}
            <button
              type="button"
              onclick={onRemove}
              class="px-3 py-2 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors"
            >
              {t('admin.blog.linkDialogRemove', locale)}
            </button>
          {/if}
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            onclick={onCancel}
            class="px-4 py-2 rounded-lg font-semibold text-sm border border-border text-text-primary transition-colors hover:bg-surface-alt"
          >
            {t('admin.blog.linkDialogCancel', locale)}
          </button>
          <button
            type="button"
            onclick={handleApply}
            class="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-colors [background:var(--brand-gradient)] hover:opacity-90"
          >
            {t('admin.blog.linkDialogApply', locale)}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
