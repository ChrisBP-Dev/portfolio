<script lang="ts">
  import { t } from '../../lib/i18n/translations';

  const locale = 'es';
  const MAX_ITEMS = 10;

  interface Props {
    label: string;
    itemsEs: string[];
    itemsEn: string[];
    onChangeEs?: (items: string[]) => void;
    onChangeEn?: (items: string[]) => void;
  }

  let {
    label,
    itemsEs = $bindable(),
    itemsEn = $bindable(),
    onChangeEs,
    onChangeEn,
  }: Props = $props();

  let activeTab = $state<'es' | 'en'>('es');

  function addItem(lang: 'es' | 'en'): void {
    if (lang === 'es' && itemsEs.length < MAX_ITEMS) {
      itemsEs = [...itemsEs, ''];
      onChangeEs?.(itemsEs);
    } else if (lang === 'en' && itemsEn.length < MAX_ITEMS) {
      itemsEn = [...itemsEn, ''];
      onChangeEn?.(itemsEn);
    }
  }

  function removeItem(lang: 'es' | 'en', index: number): void {
    if (lang === 'es') {
      itemsEs = itemsEs.filter((_, i) => i !== index);
      onChangeEs?.(itemsEs);
    } else {
      itemsEn = itemsEn.filter((_, i) => i !== index);
      onChangeEn?.(itemsEn);
    }
  }

  function updateItem(lang: 'es' | 'en', index: number, value: string): void {
    if (lang === 'es') {
      itemsEs = itemsEs.map((item, i) => (i === index ? value : item));
      onChangeEs?.(itemsEs);
    } else {
      itemsEn = itemsEn.map((item, i) => (i === index ? value : item));
      onChangeEn?.(itemsEn);
    }
  }
</script>

{#snippet itemList(lang: 'es' | 'en', items: string[])}
  <div class="space-y-2">
    {#each items as item, index (index)}
      <div class="flex gap-2">
        <input
          type="text"
          value={item}
          oninput={(e) => updateItem(lang, index, (e.target as HTMLInputElement).value)}
          class="flex-1 rounded-lg border border-border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
          aria-label="{label} {lang.toUpperCase()} #{index + 1}"
        />
        <button
          type="button"
          onclick={() => removeItem(lang, index)}
          class="p-2 text-text-muted hover:text-error transition-colors rounded-lg hover:bg-error/10"
          aria-label="{t('admin.projects.form.removeFeature', locale)} #{index + 1}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    {/each}
    {#if items.length < MAX_ITEMS}
      <button
        type="button"
        onclick={() => addItem(lang)}
        class="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
      >
        + {t('admin.projects.form.addFeature', locale)}
      </button>
    {/if}
  </div>
{/snippet}

<fieldset class="space-y-2">
  <legend class="text-sm font-medium text-text-primary">{label}</legend>

  <!-- Mobile: Tabs (<900px) -->
  <div class="lg:hidden">
    <div class="flex gap-1 mb-2" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'es'}
        class="px-3 py-1 rounded text-xs font-semibold transition-colors {activeTab === 'es' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-surface text-text-muted'}"
        onclick={() => (activeTab = 'es')}
      >
        {t('admin.bilingual.es', locale)}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'en'}
        class="px-3 py-1 rounded text-xs font-semibold transition-colors {activeTab === 'en' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-surface text-text-muted'}"
        onclick={() => (activeTab = 'en')}
      >
        {t('admin.bilingual.en', locale)}
      </button>
    </div>
    {#if activeTab === 'es'}
      {@render itemList('es', itemsEs)}
    {:else}
      {@render itemList('en', itemsEn)}
    {/if}
  </div>

  <!-- Desktop: Side by side (≥900px) -->
  <div class="hidden lg:grid lg:grid-cols-2 lg:gap-4">
    <div>
      <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {t('admin.bilingual.es', locale)}
      </span>
      {@render itemList('es', itemsEs)}
    </div>
    <div>
      <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        {t('admin.bilingual.en', locale)}
      </span>
      {@render itemList('en', itemsEn)}
    </div>
  </div>
</fieldset>
