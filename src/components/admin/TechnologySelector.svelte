<script lang="ts">
  import { collection, getDocs, query, orderBy } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { technologyFirestoreSchema } from '../../lib/schemas/technology-schema';
  import { t } from '../../lib/i18n/translations';
  import type { Technology } from '../../lib/schemas/technology-schema';

  const locale = 'es';
  const TECHNOLOGIES_COLLECTION = 'Technologies';

  interface Props {
    selected: string[];
    onChange?: (selected: string[]) => void;
  }

  let { selected = $bindable(), onChange }: Props = $props();

  let technologies = $state<Technology[]>([]);
  let loading = $state(true);

  $effect(() => {
    loadTechnologies();
  });

  async function loadTechnologies(): Promise<void> {
    loading = true;
    try {
      const q = query(collection(db, TECHNOLOGIES_COLLECTION), orderBy('name'));
      const snapshot = await getDocs(q);
      technologies = snapshot.docs
        .map((doc) => {
          const result = technologyFirestoreSchema.safeParse(doc.data());
          if (!result.success) return null;
          return { ...result.data, id: doc.id };
        })
        .filter((t): t is Technology => t !== null);
    } catch {
      technologies = [];
    } finally {
      loading = false;
    }
  }

  function toggleTechnology(id: string): void {
    if (selected.includes(id)) {
      selected = selected.filter((s) => s !== id);
    } else {
      selected = [...selected, id];
    }
    onChange?.(selected);
  }
</script>

<div>
  {#if loading}
    <div class="flex gap-2 flex-wrap">
      {#each Array(6) as _, i (i)}
        <div class="h-9 w-20 bg-border rounded-lg motion-safe:animate-pulse"></div>
      {/each}
    </div>
  {:else if technologies.length === 0}
    <p class="text-sm text-text-muted">{t('admin.projects.form.noTechnologies', locale)}</p>
  {:else}
    <div class="flex gap-2 flex-wrap" role="group" aria-label={t('admin.projects.form.technologies', locale)}>
      {#each technologies as tech (tech.id)}
        <button
          type="button"
          onclick={() => toggleTechnology(tech.id)}
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors {selected.includes(tech.id) ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-text-secondary hover:border-primary/30'}"
          aria-pressed={selected.includes(tech.id)}
        >
          {#if tech.image?.url}
            <img src={tech.image.url} alt="" class="w-4 h-4 object-contain" aria-hidden="true" />
          {/if}
          {tech.name}
        </button>
      {/each}
    </div>
  {/if}
</div>
