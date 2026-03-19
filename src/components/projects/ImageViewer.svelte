<script lang="ts">
  import { t } from '../../lib/i18n/translations';

  interface Props {
    screenshots: { url: string; alt: string }[];
    locale: 'es' | 'en';
  }

  let { screenshots, locale }: Props = $props();
  let isOpen = $state(false);
  let currentIndex = $state(0);
  let dialogRef = $state<HTMLDialogElement | null>(null);
  let galleryRef = $state<HTMLDivElement | null>(null);
  let currentImage = $derived(screenshots[currentIndex]);

  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  function open(index: number) {
    currentIndex = index;
    dialogRef?.showModal();
    isOpen = true;
  }

  function close() {
    dialogRef?.close();
    isOpen = false;
  }

  function next() {
    currentIndex = (currentIndex + 1) % screenshots.length;
  }

  function prev() {
    currentIndex = (currentIndex - 1 + screenshots.length) % screenshots.length;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialogRef) close();
  }

  $effect(() => {
    if (galleryRef) galleryRef.dataset.hydrated = 'true';
  });

  $effect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Gallery grid (visible — enables client:visible hydration) -->
<div id="screenshot-gallery" bind:this={galleryRef} class="grid grid-cols-2 sm:grid-cols-3 gap-4">
  {#each screenshots as ss, index (index)}
    <button
      type="button"
      data-screenshot-index={index}
      aria-label={`${ss.alt} ${index + 1}`}
      class="cursor-pointer rounded-lg overflow-hidden border border-border hover:border-primary transition-colors duration-200 focus:outline-2 focus:outline-primary focus:outline-offset-2"
      onclick={() => open(index)}
    >
      <img
        src={ss.url}
        alt={`${ss.alt} ${index + 1}`}
        loading="lazy"
        decoding="async"
        class="w-full h-auto object-cover"
      />
    </button>
  {/each}
</div>

<!-- Fullscreen overlay dialog -->
<dialog
  bind:this={dialogRef}
  class="fixed inset-0 w-full h-full max-w-none max-h-none m-0 p-0 bg-transparent backdrop:bg-black/80"
  class:no-transition={reducedMotion}
  oncancel={close}
  onclick={handleBackdropClick}
  aria-label={`${currentImage?.alt ?? ''} — ${currentIndex + 1} ${t('imageViewer.counter', locale)} ${screenshots.length}`}
>
  <!-- Close button -->
  <button
    class="absolute top-4 right-4 z-10 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-2 focus:outline-primary focus:outline-offset-2"
    aria-label={t('imageViewer.close', locale)}
    onclick={close}
  >
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>

  <!-- Previous arrow -->
  {#if screenshots.length > 1}
    <button
      class="absolute left-4 top-1/2 -translate-y-1/2 z-10 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-2 focus:outline-primary focus:outline-offset-2"
      aria-label={t('imageViewer.previous', locale)}
      onclick={prev}
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Next arrow -->
    <button
      class="absolute right-4 top-1/2 -translate-y-1/2 z-10 min-h-11 min-w-11 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors focus:outline-2 focus:outline-primary focus:outline-offset-2"
      aria-label={t('imageViewer.next', locale)}
      onclick={next}
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  {/if}

  <!-- Centered image -->
  <div class="flex items-center justify-center w-full h-full p-8 sm:p-12">
    <img
      src={currentImage?.url}
      alt={`${currentImage?.alt ?? ''} ${currentIndex + 1}`}
      class="max-w-full max-h-full object-contain"
    />
  </div>

  <!-- Counter (e.g., "3 de 5") -->
  {#if screenshots.length > 1}
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-body-sm px-3 py-1 rounded-full" aria-live="polite">
      {currentIndex + 1} {t('imageViewer.counter', locale)} {screenshots.length}
    </div>
  {/if}
</dialog>
