<script lang="ts">
  import { cubicInOut } from 'svelte/easing';
  import { navItems, localizeHref } from '../../data/navigation';
  import { t } from '../../lib/i18n/translations';
  import logoSrc from '../../assets/logo/cbp-short-logo-dark.png';

  interface Props {
    currentPage?: string;
    locale: 'es' | 'en';
  }

  let { currentPage = 'home', locale }: Props = $props();

  let isOpen = $state(false);
  let triggerRef = $state(null) as HTMLButtonElement | null;

  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  function slideDown(_node: Element) {
    return {
      duration: reducedMotion ? 0 : 300,
      easing: cubicInOut,
      css: (t: number) => `transform: translateY(${(1 - t) * -100}%)`,
    };
  }

  function toggle() {
    isOpen = !isOpen;
  }

  function close() {
    isOpen = false;
    triggerRef?.focus();
  }

  $effect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const mq = window.matchMedia('(min-width: 1024px)');
    const handleResize = () => { if (mq.matches) close(); };
    mq.addEventListener('change', handleResize);

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close();
        return;
      }

      if (e.key === 'Tab') {
        const menu = document.getElementById('mobile-menu-overlay');
        if (!menu) return;

        const focusable = menu.querySelectorAll<HTMLElement>('a[href], button');
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeydown);
      mq.removeEventListener('change', handleResize);
    };
  });
</script>

<button
  bind:this={triggerRef}
  class="lg:hidden min-h-11 min-w-11 flex items-center justify-center text-text-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
  aria-label={isOpen ? t('mobile.close', locale) : t('mobile.open', locale)}
  aria-expanded={isOpen}
  onclick={toggle}
>
  {#if isOpen}
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  {:else}
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  {/if}
</button>

{#if isOpen}
  <div
    id="mobile-menu-overlay"
    class="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center"
    transition:slideDown
  >
    <div class="absolute top-4 left-4">
      <img src={logoSrc} alt="ChrisBP" class="h-10 w-auto" />
    </div>

    <button
      class="absolute top-4 right-4 min-h-11 min-w-11 flex items-center justify-center text-text-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
      aria-label={t('mobile.close', locale)}
      onclick={close}
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <nav class="flex flex-col items-center gap-8" aria-label={t('nav.aria', locale)}>
      {#each navItems as item (item.key)}
        <a
          href={localizeHref(item.href, locale)}
          class="text-heading-2 font-semibold transition-colors min-h-11 flex items-center focus:outline-2 focus:outline-offset-2 focus:outline-primary {currentPage === item.key ? 'text-primary' : 'text-text-secondary hover:text-primary'}"
          aria-current={currentPage === item.key ? 'page' : undefined}
          onclick={close}
        >
          {item.label[locale]}
        </a>
      {/each}
    </nav>
  </div>
{/if}
