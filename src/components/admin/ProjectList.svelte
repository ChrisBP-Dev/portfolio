<script lang="ts">
  import Sortable from 'sortablejs';
  import { collection, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { projectFirestoreSchema } from '../../lib/schemas/project-schema';
  import type { ProjectWithId } from '../../lib/schemas/project-schema';
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';

  const locale = 'es';
  const PROJECTS_COLLECTION = 'Projects';

  interface Props {
    onCreateNew: () => void;
    onEdit?: (project: ProjectWithId) => void;
    onDelete?: (project: ProjectWithId) => void;
  }

  let { onCreateNew, onEdit, onDelete }: Props = $props();

  let projects = $state<ProjectWithId[]>([]);
  let loading = $state(true);
  let error = $state(false);
  let reordering = $state(false);

  // Accessibility: aria-live announcement
  let liveAnnouncement = $state('');

  // Featured count
  let featuredCount = $derived(projects.filter(p => p.featured).length);

  // SortableJS instance + list element ref
  let listEl = $state<HTMLElement | null>(null);
  let sortableInstance: Sortable | null = null;

  $effect(() => {
    loadProjects();
  });

  // Initialize SortableJS when list element is available
  $effect(() => {
    if (!listEl) return;

    sortableInstance = Sortable.create(listEl, {
      handle: '[data-drag-handle]',
      animation: 150,
      ghostClass: 'opacity-50',
      chosenClass: 'border-primary',
      onEnd: (evt) => {
        const { oldIndex, newIndex, from, item } = evt;
        if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;

        // Revert SortableJS DOM change — let Svelte manage the DOM
        from.removeChild(item);
        from.insertBefore(item, from.children[oldIndex] ?? null);

        const reordered = [...projects];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);
        projects = reordered.map((p, i) => ({ ...p, order: i }));

        liveAnnouncement = `${moved.companyName[locale]} movido a posición ${newIndex + 1}`;

        persistOrder();
      },
    });

    return () => {
      sortableInstance?.destroy();
      sortableInstance = null;
    };
  });

  // Disable sorting during persist
  $effect(() => {
    sortableInstance?.option('disabled', reordering);
  });

  export async function loadProjects(): Promise<void> {
    loading = true;
    error = false;
    try {
      const snapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
      projects = snapshot.docs
        .map((doc) => {
          const result = projectFirestoreSchema.safeParse(doc.data());
          if (!result.success) return null;
          return { ...result.data, id: doc.id };
        })
        .filter((p): p is ProjectWithId => p !== null)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.slug ?? '').localeCompare(b.slug ?? ''));
    } catch {
      error = true;
    } finally {
      loading = false;
    }
  }

  async function persistOrder(): Promise<void> {
    reordering = true;
    try {
      const batch = writeBatch(db);
      projects.forEach((project, index) => {
        batch.update(doc(db, PROJECTS_COLLECTION, project.id), { order: index });
      });
      await batch.commit();
    } catch {
      toastStore.error(t('admin.projects.reorderError', locale));
      await loadProjects();
    } finally {
      reordering = false;
    }
  }

  async function handleToggleFeatured(project: ProjectWithId): Promise<void> {
    if (!project.featured && featuredCount >= 3) {
      toastStore.warning(t('admin.projects.maxFeatured', locale));
      return;
    }
    const newFeatured = !project.featured;
    try {
      await updateDoc(doc(db, PROJECTS_COLLECTION, project.id), { featured: newFeatured });
      const idx = projects.findIndex(p => p.id === project.id);
      if (idx !== -1) projects[idx] = { ...projects[idx], featured: newFeatured };
    } catch {
      toastStore.error(t('admin.projects.featuredToggleError', locale));
    }
  }
</script>

<div>
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-text-primary">
      {t('admin.projects.title', locale)}
    </h1>
    <button
      type="button"
      onclick={onCreateNew}
      class="px-4 py-2 rounded-lg font-semibold text-white [background:var(--brand-gradient)] min-h-11 transition-opacity hover:opacity-90"
    >
      {t('admin.projects.createNew', locale)}
    </button>
  </div>

  {#if loading}
    <!-- Skeleton loading -->
    <div class="space-y-3" aria-busy="true" aria-label={t('admin.projects.loading', locale)}>
      {#each Array(4) as _, i (i)}
        <div class="flex items-center gap-4 bg-surface border border-border rounded-lg p-4 motion-safe:animate-pulse">
          <div class="w-16 h-16 bg-border rounded-lg shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="w-48 h-4 bg-border rounded"></div>
            <div class="w-24 h-3 bg-border rounded"></div>
          </div>
          <div class="flex gap-2">
            <div class="w-16 h-8 bg-border rounded"></div>
            <div class="w-16 h-8 bg-border rounded"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <p class="text-red-700 dark:text-red-300">{t('admin.projects.errorLoading', locale)}</p>
    </div>
  {:else if projects.length === 0}
    <!-- Empty state -->
    <div class="bg-surface border border-border rounded-lg p-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-text-muted" aria-hidden="true">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
      <p class="text-text-secondary mb-2">{t('admin.projects.empty', locale)}</p>
      <button
        type="button"
        onclick={onCreateNew}
        class="text-primary font-semibold hover:underline"
      >
        {t('admin.projects.emptyCta', locale)}
      </button>
    </div>
  {:else}
    <!-- Project list -->
    <div class="space-y-3" role="list" bind:this={listEl}>
      {#each projects as project (project.id)}
        <div
          role="listitem"
          class="flex items-center gap-4 bg-surface border border-border rounded-lg p-4 transition-colors hover:border-primary/30"
        >
          <!-- Drag handle -->
          <div
            data-drag-handle
            class="cursor-grab active:cursor-grabbing shrink-0 text-text-muted hover:text-text-secondary p-1 touch-none"
            aria-label={t('admin.projects.dragHandle', locale)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <circle cx="5" cy="2" r="1.5"/>
              <circle cx="11" cy="2" r="1.5"/>
              <circle cx="5" cy="8" r="1.5"/>
              <circle cx="11" cy="8" r="1.5"/>
              <circle cx="5" cy="14" r="1.5"/>
              <circle cx="11" cy="14" r="1.5"/>
            </svg>
          </div>

          {#if project.mainImage?.url}
            <img
              src={project.mainImage.url}
              alt={project.companyName[locale]}
              class="w-16 h-16 object-cover rounded-lg shrink-0"
            />
          {:else}
            <div class="w-16 h-16 bg-border rounded-lg shrink-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          {/if}

          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-text-primary truncate">
              {project.companyName[locale]}
            </h3>
            <p class="text-sm text-text-muted truncate">{project.slug}</p>
          </div>

          <!-- Featured star toggle -->
          <button
            type="button"
            onclick={() => handleToggleFeatured(project)}
            class="shrink-0 p-1.5 rounded-lg transition-colors {project.featured ? 'text-yellow-500 hover:text-yellow-600' : 'text-text-muted hover:text-yellow-500'}"
            aria-label="{t('admin.projects.featured', locale)}: {project.companyName[locale]}"
            data-testid="featured-toggle-{project.id}"
          >
            {#if project.featured}
              <!-- Filled star -->
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            {:else}
              <!-- Outline star -->
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            {/if}
          </button>

          <div class="flex gap-2 shrink-0">
            <button
              type="button"
              onclick={() => onEdit?.(project)}
              class="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary hover:border-primary/30 hover:text-primary transition-colors"
            >
              {t('admin.projects.edit', locale)}
            </button>
            <button
              type="button"
              onclick={() => onDelete?.(project)}
              class="px-3 py-1.5 text-sm rounded-lg border border-error/30 text-error hover:bg-error/10 hover:border-error transition-colors"
            >
              {t('admin.projects.delete', locale)}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Screen reader announcements for reorder -->
  <div aria-live="polite" aria-atomic="true" class="sr-only">{liveAnnouncement}</div>
</div>
