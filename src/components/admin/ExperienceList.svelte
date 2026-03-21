<script lang="ts">
  import { collection, getDocs, query, orderBy } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { experienceFirestoreSchema } from '../../lib/schemas/experience-schema';
  import type { ExperienceWithId } from '../../lib/schemas/experience-schema';
  import { t } from '../../lib/i18n/translations';

  const locale = 'es';
  const EXPERIENCES_COLLECTION = 'Experiences';

  interface Props {
    onCreateNew: () => void;
    onEdit?: (exp: ExperienceWithId) => void;
    onDelete?: (exp: ExperienceWithId) => void;
  }

  let { onCreateNew, onEdit, onDelete }: Props = $props();

  let experiences = $state<ExperienceWithId[]>([]);
  let loading = $state(true);
  let error = $state(false);

  const dateFormatter = new Intl.DateTimeFormat('es', { year: 'numeric', month: 'short' });

  function formatDate(date: Date): string {
    return dateFormatter.format(date);
  }

  $effect(() => {
    loadExperiences();
  });

  export async function loadExperiences(): Promise<void> {
    loading = true;
    error = false;
    try {
      const q = query(collection(db, EXPERIENCES_COLLECTION), orderBy('startDate', 'desc'));
      const snapshot = await getDocs(q);
      experiences = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          const converted = {
            ...data,
            startDate: data.startDate?.toDate?.() ?? new Date(data.startDate),
            endDate: data.endDate != null ? (data.endDate?.toDate?.() ?? new Date(data.endDate)) : null,
          };
          const result = experienceFirestoreSchema.safeParse(converted);
          if (!result.success) return null;
          return { ...result.data, id: docSnap.id };
        })
        .filter((e): e is ExperienceWithId => e !== null);
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
      {t('admin.experiences.title', locale)}
    </h1>
    <button
      type="button"
      onclick={onCreateNew}
      class="px-4 py-2 rounded-lg font-semibold text-white [background:var(--brand-gradient)] min-h-11 transition-opacity hover:opacity-90"
    >
      {t('admin.experiences.createNew', locale)}
    </button>
  </div>

  {#if loading}
    <div class="space-y-3" aria-busy="true" aria-label={t('admin.experiences.loading', locale)}>
      {#each Array(4) as _, i (i)}
        <div class="bg-surface border border-border rounded-lg p-4 motion-safe:animate-pulse">
          <div class="flex items-center justify-between">
            <div class="flex-1 space-y-2">
              <div class="w-40 h-4 bg-border rounded"></div>
              <div class="w-64 h-3 bg-border rounded"></div>
            </div>
            <div class="flex gap-2">
              <div class="w-16 h-8 bg-border rounded"></div>
              <div class="w-16 h-8 bg-border rounded"></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <p class="text-red-700 dark:text-red-300">{t('admin.experiences.errorLoading', locale)}</p>
    </div>
  {:else if experiences.length === 0}
    <div class="bg-surface border border-border rounded-lg p-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-text-muted" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
      <p class="text-text-secondary mb-2">{t('admin.experiences.empty', locale)}</p>
      <button
        type="button"
        onclick={onCreateNew}
        class="text-primary font-semibold hover:underline"
      >
        {t('admin.experiences.emptyCta', locale)}
      </button>
    </div>
  {:else}
    <div class="space-y-3">
      {#each experiences as exp (exp.id)}
        <div class="bg-surface border border-border rounded-lg p-4 transition-colors hover:border-primary/30">
          <div class="flex items-center justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-text-primary truncate">
                {exp.companyName}
              </h3>
              <p class="text-sm text-text-secondary truncate">
                {exp.jobName.es} · {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : t('admin.experiences.present', locale)}
              </p>
            </div>

            <div class="flex gap-2 shrink-0">
              <button
                type="button"
                onclick={() => onEdit?.(exp)}
                class="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary hover:border-primary/30 hover:text-primary transition-colors"
              >
                {t('admin.experiences.edit', locale)}
              </button>
              <button
                type="button"
                onclick={() => onDelete?.(exp)}
                class="px-3 py-1.5 text-sm rounded-lg border border-error/30 text-error hover:bg-error/10 hover:border-error transition-colors"
              >
                {t('admin.experiences.delete', locale)}
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
