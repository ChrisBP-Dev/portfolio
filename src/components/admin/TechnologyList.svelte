<script lang="ts">
  import Sortable from 'sortablejs';
  import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { technologyFirestoreSchema } from '../../lib/schemas/technology-schema';
  import type { TechnologyWithId } from '../../lib/schemas/technology-schema';
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';

  const locale = 'es';
  const TECHNOLOGIES_COLLECTION = 'Technologies';

  interface Props {
    onCreateNew: () => void;
    onEdit?: (tech: TechnologyWithId) => void;
    onDelete?: (tech: TechnologyWithId) => void;
  }

  let { onCreateNew, onEdit, onDelete }: Props = $props();

  let technologies = $state<TechnologyWithId[]>([]);
  let loading = $state(true);
  let error = $state(false);
  let reordering = $state(false);

  // Accessibility: aria-live announcement
  let liveAnnouncement = $state('');

  // SortableJS instance + list element ref
  let listEl = $state<HTMLElement | null>(null);
  let sortableInstance: Sortable | null = null;

  $effect(() => {
    loadTechnologies();
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

        const reordered = [...technologies];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);
        technologies = reordered.map((tech, i) => ({ ...tech, order: i }));

        liveAnnouncement = `${moved.name} movido a posición ${newIndex + 1}`;

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

  export async function loadTechnologies(): Promise<void> {
    loading = true;
    error = false;
    try {
      const snapshot = await getDocs(collection(db, TECHNOLOGIES_COLLECTION));
      technologies = snapshot.docs
        .map((d) => {
          const result = technologyFirestoreSchema.safeParse(d.data());
          if (!result.success) return null;
          return { ...result.data, id: d.id };
        })
        .filter((t): t is TechnologyWithId => t !== null)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.name ?? '').localeCompare(b.name ?? ''));
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
      technologies.forEach((tech, index) => {
        batch.update(doc(db, TECHNOLOGIES_COLLECTION, tech.id), { order: index });
      });
      await batch.commit();
    } catch {
      toastStore.error(t('admin.technologies.reorderError', locale));
      await loadTechnologies();
    } finally {
      reordering = false;
    }
  }
</script>

<div>
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-text-primary">
      {t('admin.technologies.title', locale)}
    </h1>
    <button
      type="button"
      onclick={onCreateNew}
      class="px-4 py-2 rounded-lg font-semibold text-white [background:var(--brand-gradient)] min-h-11 transition-opacity hover:opacity-90"
    >
      {t('admin.technologies.createNew', locale)}
    </button>
  </div>

  {#if loading}
    <div class="space-y-3" aria-busy="true" aria-label={t('admin.technologies.loading', locale)}>
      {#each Array(4) as _, i (i)}
        <div class="flex items-center gap-4 bg-surface border border-border rounded-lg p-4 motion-safe:animate-pulse">
          <div class="w-8 h-8 bg-border rounded shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="w-32 h-4 bg-border rounded"></div>
          </div>
          <div class="w-16 h-5 bg-border rounded"></div>
          <div class="flex gap-2">
            <div class="w-16 h-8 bg-border rounded"></div>
            <div class="w-16 h-8 bg-border rounded"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <p class="text-red-700 dark:text-red-300">{t('admin.technologies.errorLoading', locale)}</p>
    </div>
  {:else if technologies.length === 0}
    <div class="bg-surface border border-border rounded-lg p-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-text-muted" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>
      <p class="text-text-secondary mb-2">{t('admin.technologies.empty', locale)}</p>
      <button
        type="button"
        onclick={onCreateNew}
        class="text-primary font-semibold hover:underline"
      >
        {t('admin.technologies.emptyCta', locale)}
      </button>
    </div>
  {:else}
    <!-- Technology list -->
    <div class="space-y-3" role="list" bind:this={listEl}>
      {#each technologies as tech (tech.id)}
        <div
          role="listitem"
          class="flex items-center gap-4 bg-surface border border-border rounded-lg p-4 transition-colors hover:border-primary/30"
        >
          <!-- Drag handle -->
          <div
            data-drag-handle
            class="cursor-grab active:cursor-grabbing shrink-0 text-text-muted hover:text-text-secondary p-1 touch-none"
            aria-label={t('admin.technologies.dragHandle', locale)}
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

          <img
            src={tech.image.url}
            alt={tech.name}
            class="w-8 h-8 object-contain rounded shrink-0"
          />

          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-text-primary truncate">
              {tech.name}
            </h3>
          </div>

          <span class="text-sm text-text-muted shrink-0">
            {tech.experienceYears} {t('admin.technologies.form.experienceYearsUnit', locale)}
          </span>

          <div class="flex gap-2 shrink-0">
            <button
              type="button"
              onclick={() => onEdit?.(tech)}
              class="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary hover:border-primary/30 hover:text-primary transition-colors"
            >
              {t('admin.technologies.edit', locale)}
            </button>
            <button
              type="button"
              onclick={() => onDelete?.(tech)}
              class="px-3 py-1.5 text-sm rounded-lg border border-error/30 text-error hover:bg-error/10 hover:border-error transition-colors"
            >
              {t('admin.technologies.delete', locale)}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Screen reader announcements for reorder -->
  <div aria-live="polite" aria-atomic="true" class="sr-only">{liveAnnouncement}</div>
</div>
