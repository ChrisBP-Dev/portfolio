<script lang="ts">
  interface Props {
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    confirming?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }

  let {
    open,
    title,
    message,
    confirmLabel,
    cancelLabel,
    confirming = false,
    onConfirm,
    onCancel,
  }: Props = $props();

  let dialogEl = $state<HTMLDivElement | null>(null);

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

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      onCancel();
      return;
    }
    if (e.key !== 'Tab' || !dialogEl) return;
    const focusable = dialogEl.querySelectorAll<HTMLElement>('button:not([disabled])');
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
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="confirm-dialog-title"
    aria-describedby="confirm-dialog-message"
    onkeydown={handleKeydown}
    onclick={handleBackdropClick}
  >
    <div
      bind:this={dialogEl}
      class="bg-surface border border-border rounded-xl shadow-lg w-full max-w-md p-6"
    >
      <h2
        id="confirm-dialog-title"
        class="text-lg font-bold text-text-primary mb-3"
      >
        {title}
      </h2>

      <p
        id="confirm-dialog-message"
        class="text-sm text-text-secondary mb-6"
      >
        {message}
      </p>

      <div class="flex justify-end gap-3">
        <button
          type="button"
          data-cancel
          onclick={onCancel}
          disabled={confirming}
          class="px-4 py-2 rounded-lg font-semibold border border-border text-text-primary transition-colors hover:bg-surface-alt disabled:opacity-50"
        >
          {cancelLabel}
        </button>

        <button
          type="button"
          onclick={onConfirm}
          disabled={confirming}
          class="px-4 py-2 rounded-lg font-semibold bg-error text-white hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {#if confirming}
            <svg class="w-4 h-4 motion-safe:animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          {/if}
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
{/if}
