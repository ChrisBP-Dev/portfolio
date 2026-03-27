<script lang="ts">
  import { signOut } from 'firebase/auth';
  import { auth } from '../../lib/firebase/client';
  import { t } from '../../lib/i18n/translations';

  const locale = 'es';

  let { currentPath }: { currentPath: string } = $props();

  let mobileOpen = $state(false);
  let hamburgerButton = $state<HTMLButtonElement | null>(null);

  interface NavItem {
    path: string;
    labelKey: string;
    icon: string;
  }

  const navItems: NavItem[] = [
    { path: '/admin', labelKey: 'admin.sidebar.dashboard', icon: 'dashboard' },
    { path: '/admin/projects', labelKey: 'admin.sidebar.projects', icon: 'projects' },
    { path: '/admin/technologies', labelKey: 'admin.sidebar.technologies', icon: 'technologies' },
    { path: '/admin/experiences', labelKey: 'admin.sidebar.experiences', icon: 'experiences' },
    { path: '/admin/blog', labelKey: 'admin.sidebar.blog', icon: 'blog' },
    { path: '/admin/resume', labelKey: 'admin.sidebar.resume', icon: 'resume' },
  ];

  function isActive(itemPath: string): boolean {
    if (itemPath === '/admin') return currentPath === '/admin' || currentPath === '/admin/';
    return currentPath === itemPath || currentPath.startsWith(itemPath + '/');
  }

  function openMobileDrawer(): void {
    mobileOpen = true;
  }

  function closeMobileDrawer(): void {
    mobileOpen = false;
    hamburgerButton?.focus();
  }

  function handleDrawerKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      closeMobileDrawer();
      return;
    }
    if (e.key === 'Tab') {
      const drawer = e.currentTarget as HTMLElement;
      const focusable = drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
  }

  async function handleLogout(): Promise<void> {
    try {
      await signOut(auth);
    } catch {
      // signOut failed — redirect anyway
    }
    window.location.href = '/admin/login';
  }

  // Focus first item and lock body scroll when mobile drawer opens
  $effect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        const drawer = document.getElementById('admin-sidebar-drawer');
        const firstFocusable = drawer?.querySelector<HTMLElement>('a[href], button');
        firstFocusable?.focus();
      });
    }
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<!-- Mobile hamburger button -->
<button
  bind:this={hamburgerButton}
  class="fixed top-4 left-4 z-40 sm:hidden p-2 rounded-md bg-surface border border-border text-text-primary hover:bg-surface/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
  onclick={openMobileDrawer}
  aria-expanded={mobileOpen}
  aria-controls="admin-sidebar-drawer"
  aria-label={t('admin.sidebar.toggle', locale)}
>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
</button>

<!-- Desktop / Tablet sidebar -->
<nav
  class="group hidden sm:flex sm:flex-col sm:fixed sm:inset-y-0 sm:left-0 sm:z-30 sm:w-16 sm:hover:w-64 lg:w-64 bg-surface border-r border-border overflow-x-hidden sidebar-transition"
  aria-label="Admin navigation"
>
  <div class="flex flex-col h-full py-4">
    <!-- Nav items -->
    <div class="flex-1 flex flex-col gap-1 px-2">
      {#each navItems as item (item.path)}
        <a
          href={item.path}
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none {isActive(item.path) ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}"
          aria-current={isActive(item.path) ? 'page' : undefined}
        >
          <span class="flex-shrink-0 w-5 h-5">
            {#if item.icon === 'dashboard'}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
              </svg>
            {:else if item.icon === 'projects'}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            {:else if item.icon === 'technologies'}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            {:else if item.icon === 'experiences'}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            {:else if item.icon === 'blog'}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            {:else if item.icon === 'resume'}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            {/if}
          </span>
          <span class="hidden lg:inline group-hover:inline truncate">{t(item.labelKey, locale)}</span>
        </a>
      {/each}
    </div>

    <!-- Logout button -->
    <div class="px-2 mt-2 border-t border-border pt-2">
      <button
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        onclick={handleLogout}
      >
        <span class="flex-shrink-0 w-5 h-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </span>
        <span class="hidden lg:inline group-hover:inline">{t('admin.logout', locale)}</span>
      </button>
    </div>
  </div>
</nav>

<!-- Mobile drawer overlay -->
{#if mobileOpen}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    id="admin-sidebar-drawer"
    class="fixed inset-0 z-50 sm:hidden"
    onkeydown={handleDrawerKeydown}
  >
    <!-- Backdrop -->
    <button
      class="absolute inset-0 bg-black/50 cursor-default"
      onclick={closeMobileDrawer}
      aria-label="Close menu"
      tabindex="-1"
    ></button>

    <!-- Drawer panel -->
    <nav
      class="relative w-64 h-full bg-surface shadow-lg drawer-slide-in"
      role="dialog"
      aria-modal="true"
      aria-label="Admin navigation"
    >
      <div class="flex flex-col h-full py-4">
        <!-- Close button -->
        <div class="px-4 mb-4 flex justify-end">
          <button
            class="p-1.5 rounded-md text-text-secondary hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            onclick={closeMobileDrawer}
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Nav items -->
        <div class="flex-1 flex flex-col gap-1 px-2">
          {#each navItems as item (item.path)}
            <a
              href={item.path}
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none {isActive(item.path) ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'}"
              aria-current={isActive(item.path) ? 'page' : undefined}
              onclick={() => closeMobileDrawer()}
            >
              <span class="flex-shrink-0 w-5 h-5">
                {#if item.icon === 'dashboard'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                  </svg>
                {:else if item.icon === 'projects'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                {:else if item.icon === 'technologies'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                {:else if item.icon === 'experiences'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                {:else if item.icon === 'blog'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                {:else if item.icon === 'resume'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                {/if}
              </span>
              <span>{t(item.labelKey, locale)}</span>
            </a>
          {/each}
        </div>

        <!-- Logout button -->
        <div class="px-2 mt-2 border-t border-border pt-2">
          <button
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            onclick={handleLogout}
          >
            <span class="flex-shrink-0 w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </span>
            <span>{t('admin.logout', locale)}</span>
          </button>
        </div>
      </div>
    </nav>
  </div>
{/if}

<style>
  .sidebar-transition {
    transition: width 200ms ease-in-out;
  }

  .drawer-slide-in {
    animation: slideIn 200ms ease-out;
  }

  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .sidebar-transition {
      transition: none;
    }
    .drawer-slide-in {
      animation: none;
    }
  }
</style>
