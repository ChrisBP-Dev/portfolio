<script lang="ts">
  import { toastStore } from '../../lib/utils/toast-store.svelte';

  const toasts = $derived(toastStore.toasts);
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm" aria-live="polite">
  {#each toasts as toast (toast.id)}
    <div
      class="flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg motion-safe:animate-slide-up {toast.type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'}"
      role={toast.type === 'error' ? 'alert' : 'status'}
    >
      {#if toast.type === 'success'}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 dark:text-green-400 shrink-0 mt-0.5" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600 dark:text-red-400 shrink-0 mt-0.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      {/if}

      <p class="text-sm font-medium {toast.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}">
        {toast.message}
      </p>

      {#if toast.dismissible}
        <button
          type="button"
          onclick={() => toastStore.remove(toast.id)}
          class="ml-auto shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      {/if}
    </div>
  {/each}
</div>

<style>
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :global(.motion-safe\:animate-slide-up) {
    animation: slide-up 0.2s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.motion-safe\:animate-slide-up) {
      animation: none;
    }
  }
</style>
