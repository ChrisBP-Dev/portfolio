<script lang="ts">
  import { collection, getCountFromServer } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { t } from '../../lib/i18n/translations';

  const locale = 'es';

  // Collection names — local constants, NOT imported from collections.ts (Admin SDK side-effects)
  const COLLECTIONS = {
    projects: 'Projects',
    technologies: 'Technologies',
    experiences: 'Experiences',
    blogPosts: 'BlogPosts',
  } as const;

  interface DashboardCard {
    key: string;
    labelKey: string;
    path: string;
    icon: string;
    collection: string;
  }

  const cards: DashboardCard[] = [
    { key: 'projects', labelKey: 'admin.dashboard.projects', path: '/admin/projects', icon: 'projects', collection: COLLECTIONS.projects },
    { key: 'technologies', labelKey: 'admin.dashboard.technologies', path: '/admin/technologies', icon: 'technologies', collection: COLLECTIONS.technologies },
    { key: 'experiences', labelKey: 'admin.dashboard.experiences', path: '/admin/experiences', icon: 'experiences', collection: COLLECTIONS.experiences },
    { key: 'blog', labelKey: 'admin.dashboard.blog', path: '/admin/blog', icon: 'blog', collection: COLLECTIONS.blogPosts },
  ];

  let counts = $state<Record<string, number | null>>({
    projects: null,
    technologies: null,
    experiences: null,
    blog: null,
  });
  let loading = $state(true);

  $effect(() => {
    loadCounts();
  });

  async function loadCounts(): Promise<void> {
    loading = true;
    try {
      const [projects, technologies, experiences, blog] = await Promise.all([
        getCountFromServer(collection(db, COLLECTIONS.projects)),
        getCountFromServer(collection(db, COLLECTIONS.technologies)),
        getCountFromServer(collection(db, COLLECTIONS.experiences)),
        getCountFromServer(collection(db, COLLECTIONS.blogPosts)),
      ]);
      counts = {
        projects: projects.data().count,
        technologies: technologies.data().count,
        experiences: experiences.data().count,
        blog: blog.data().count,
      };
    } catch {
      // Leave counts as null — UI shows "—"
    } finally {
      loading = false;
    }
  }

  function navigateTo(path: string): void {
    window.location.href = path;
  }
</script>

<div class="p-6 lg:p-8">
  <h1 class="text-2xl font-bold text-text-primary mb-6">
    {t('admin.dashboard.title', locale)}
  </h1>

  <div
    class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"
    aria-busy={loading}
  >
    {#each cards as card (card.key)}
      {#if loading}
        <!-- Skeleton card -->
        <div class="bg-surface border border-border rounded-lg p-6 animate-pulse">
          <div class="w-8 h-8 bg-border rounded mb-4"></div>
          <div class="w-24 h-4 bg-border rounded mb-2"></div>
          <div class="w-12 h-8 bg-border rounded"></div>
        </div>
      {:else}
        <!-- Data card -->
        <a
          href={card.path}
          class="bg-surface border border-border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none group"
          onclick={(e) => { e.preventDefault(); navigateTo(card.path); }}
        >
          <div class="text-text-secondary mb-3 group-hover:text-primary transition-colors">
            {#if card.icon === 'projects'}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            {:else if card.icon === 'technologies'}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            {:else if card.icon === 'experiences'}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            {:else if card.icon === 'blog'}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            {/if}
          </div>
          <h2 class="text-sm font-medium text-text-secondary mb-1">
            {t(card.labelKey, locale)}
          </h2>
          <p class="text-3xl font-bold text-text-primary">
            {counts[card.key] !== null ? counts[card.key] : '—'}
          </p>
        </a>
      {/if}
    {/each}
  </div>
</div>
