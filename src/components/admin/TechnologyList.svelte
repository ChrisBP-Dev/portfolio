<script lang="ts">
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

  // Drag state
  let draggedIndex = $state<number | null>(null);
  let dropTargetIndex = $state<number | null>(null);
  let reordering = $state(false);
  let canDrag = $state(false);

  // Accessibility: aria-live announcement
  let liveAnnouncement = $state('');

  $effect(() => {
    loadTechnologies();
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

  // Drag handlers — drag starts only from grip handle via canDrag flag
  function handleDragStart(e: DragEvent, index: number): void {
    if (!canDrag) {
      e.preventDefault();
      return;
    }
    draggedIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  }

  function handleDragOver(e: DragEvent, index: number): void {
    e.preventDefault();
    dropTargetIndex = index;
  }

  function handleDragLeave(): void {
    dropTargetIndex = null;
  }

  async function handleDrop(e: DragEvent, index: number): Promise<void> {
    e.preventDefault();
    if (reordering) return;
    if (draggedIndex === null || draggedIndex === index) {
      draggedIndex = null;
      dropTargetIndex = null;
      return;
    }

    // Reorder array
    const reordered = [...technologies];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, moved);

    // Assign sequential order values
    technologies = reordered.map((tech, i) => ({ ...tech, order: i }));

    liveAnnouncement = `${moved.name} movido a posición ${index + 1}`;

    draggedIndex = null;
    dropTargetIndex = null;
    canDrag = false;

    await persistOrder();
  }

  function handleDragEnd(): void {
    draggedIndex = null;
    dropTargetIndex = null;
    canDrag = false;
  }

  // Keyboard reorder — ArrowUp/ArrowDown on grip handle
  async function handleKeyboardReorder(e: KeyboardEvent, index: number): Promise<void> {
    if (reordering) return;
    let targetIndex: number | null = null;

    if (e.key === 'ArrowUp' && index > 0) {
      targetIndex = index - 1;
    } else if (e.key === 'ArrowDown' && index < technologies.length - 1) {
      targetIndex = index + 1;
    }

    if (targetIndex === null) return;
    e.preventDefault();

    const reordered = [...technologies];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    technologies = reordered.map((tech, i) => ({ ...tech, order: i }));

    liveAnnouncement = `${moved.name} ${targetIndex < index ? '↑' : '↓'} posición ${targetIndex + 1} de ${technologies.length}`;

    await persistOrder();

    // Refocus the handle at the new position
    const handle = document.querySelector(`[data-drag-index="${targetIndex}"]`) as HTMLElement | null;
    handle?.focus();
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
    <div class="space-y-3" role="list">
      {#each technologies as tech, index (tech.id)}
        <div
          draggable="true"
          ondragstart={(e) => handleDragStart(e, index)}
          ondragover={(e) => handleDragOver(e, index)}
          ondragleave={handleDragLeave}
          ondrop={(e) => handleDrop(e, index)}
          ondragend={handleDragEnd}
          role="listitem"
          class="flex items-center gap-4 bg-surface border rounded-lg p-4 transition-colors hover:border-primary/30 {draggedIndex === index ? 'opacity-50' : ''} {dropTargetIndex === index && draggedIndex !== index ? 'border-t-2 border-primary' : 'border-border'}"
        >
          <!-- Drag handle — mousedown enables drag, keyboard arrows reorder -->
          <button
            type="button"
            onmousedown={() => { canDrag = true; }}
            onkeydown={(e) => handleKeyboardReorder(e, index)}
            class="cursor-grab active:cursor-grabbing shrink-0 text-text-muted hover:text-text-secondary p-1"
            aria-label={t('admin.technologies.dragHandle', locale)}
            aria-roledescription="sortable"
            data-drag-index={index}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <circle cx="5" cy="2" r="1.5"/>
              <circle cx="11" cy="2" r="1.5"/>
              <circle cx="5" cy="8" r="1.5"/>
              <circle cx="11" cy="8" r="1.5"/>
              <circle cx="5" cy="14" r="1.5"/>
              <circle cx="11" cy="14" r="1.5"/>
            </svg>
          </button>

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
