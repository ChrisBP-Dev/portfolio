<script lang="ts">
  import { collection, getDocs, query, orderBy } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { projectFirestoreSchema } from '../../lib/schemas/project-schema';
  import type { ProjectWithId } from '../../lib/schemas/project-schema';
  import { t } from '../../lib/i18n/translations';

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

  $effect(() => {
    loadProjects();
  });

  export async function loadProjects(): Promise<void> {
    loading = true;
    error = false;
    try {
      const q = query(collection(db, PROJECTS_COLLECTION), orderBy('slug'));
      const snapshot = await getDocs(q);
      projects = snapshot.docs
        .map((doc) => {
          const result = projectFirestoreSchema.safeParse(doc.data());
          if (!result.success) return null;
          return { ...result.data, id: doc.id };
        })
        .filter((p): p is ProjectWithId => p !== null);
    } catch {
      error = true;
    } finally {
      loading = false;
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
    <div class="space-y-3">
      {#each projects as project (project.id)}
        <div class="flex items-center gap-4 bg-surface border border-border rounded-lg p-4 transition-colors hover:border-primary/30">
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
</div>
