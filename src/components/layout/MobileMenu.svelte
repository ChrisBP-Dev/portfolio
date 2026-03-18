<script lang="ts">
  import logoSrc from '../../assets/logo/cbp-short-logo-dark.png';

  let { currentPage = 'home' }: { currentPage: string } = $props();

  let isOpen = $state(false);

  const navItems = [
    { label: 'Home', href: '/', key: 'home' },
    { label: 'Projects', href: '/projects', key: 'projects' },
    { label: 'Experience', href: '/experience', key: 'experience' },
    { label: 'Blog', href: '/blog', key: 'blog' },
    { label: 'Contact', href: '/contact', key: 'contact' },
  ];

  function toggle() {
    isOpen = !isOpen;
  }

  function close() {
    isOpen = false;
  }

  $effect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close();
        return;
      }

      if (e.key === 'Tab') {
        const menu = document.getElementById('mobile-menu-overlay');
        if (!menu) return;

        const focusable = menu.querySelectorAll<HTMLElement>('a[href], button');
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
    };
  });
</script>

<button
  class="lg:hidden min-h-11 min-w-11 flex items-center justify-center text-text-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
  aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
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
    class="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center mobile-overlay motion-reduce:transition-none"
  >
    <div class="absolute top-4 left-4">
      <img src={logoSrc} alt="ChrisBP" class="h-10 w-auto" />
    </div>

    <button
      class="absolute top-4 right-4 min-h-11 min-w-11 flex items-center justify-center text-text-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
      aria-label="Cerrar menú"
      onclick={close}
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <nav class="flex flex-col items-center gap-8" aria-label="Navegación principal">
      {#each navItems as item}
        <a
          href={item.href}
          class="text-heading-2 font-semibold transition-colors min-h-11 flex items-center focus:outline-2 focus:outline-offset-2 focus:outline-primary {currentPage === item.key ? 'text-primary' : 'text-text-secondary hover:text-primary'}"
          aria-current={currentPage === item.key ? 'page' : undefined}
          onclick={close}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </div>
{/if}

<style>
  .mobile-overlay {
    animation: slideDown 300ms ease-in-out;
  }

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mobile-overlay {
      animation: none;
    }
  }
</style>
