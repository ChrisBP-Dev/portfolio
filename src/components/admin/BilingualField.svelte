<script lang="ts">
  import { t } from '../../lib/i18n/translations';

  const locale = 'es';

  interface Props {
    label: string;
    nameEs: string;
    nameEn: string;
    type?: 'input' | 'textarea';
    required?: boolean;
    errorEs?: string;
    errorEn?: string;
    onChangeEs?: (value: string) => void;
    onChangeEn?: (value: string) => void;
  }

  let {
    label,
    nameEs = $bindable(),
    nameEn = $bindable(),
    type = 'input',
    required = false,
    errorEs = '',
    errorEn = '',
    onChangeEs,
    onChangeEn,
  }: Props = $props();

  let activeTab = $state<'es' | 'en'>('es');

  const esId = $derived(`field-es-${label.toLowerCase().replace(/\s+/g, '-')}`);
  const enId = $derived(`field-en-${label.toLowerCase().replace(/\s+/g, '-')}`);
  const esErrorId = $derived(`${esId}-error`);
  const enErrorId = $derived(`${enId}-error`);
</script>

<fieldset class="space-y-2">
  <legend class="text-sm font-medium text-text-primary">
    {label}
    {#if required}<span class="text-error" aria-hidden="true">*</span>{/if}
  </legend>

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
      <div>
        {#if type === 'textarea'}
          <textarea
            id={esId}
            bind:value={nameEs}
            oninput={() => onChangeEs?.(nameEs)}
            aria-required={required}
            aria-invalid={!!errorEs}
            aria-describedby={errorEs ? esErrorId : undefined}
            class="w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errorEs ? 'border-error' : 'border-border'}"
            rows="3"
          ></textarea>
        {:else}
          <input
            id={esId}
            type="text"
            bind:value={nameEs}
            oninput={() => onChangeEs?.(nameEs)}
            aria-required={required}
            aria-invalid={!!errorEs}
            aria-describedby={errorEs ? esErrorId : undefined}
            class="w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errorEs ? 'border-error' : 'border-border'}"
          />
        {/if}
        {#if errorEs}
          <p id={esErrorId} class="text-xs text-error mt-1" role="alert">{errorEs}</p>
        {/if}
      </div>
    {:else}
      <div>
        {#if type === 'textarea'}
          <textarea
            id={enId}
            bind:value={nameEn}
            oninput={() => onChangeEn?.(nameEn)}
            aria-required={required}
            aria-invalid={!!errorEn}
            aria-describedby={errorEn ? enErrorId : undefined}
            class="w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errorEn ? 'border-error' : 'border-border'}"
            rows="3"
          ></textarea>
        {:else}
          <input
            id={enId}
            type="text"
            bind:value={nameEn}
            oninput={() => onChangeEn?.(nameEn)}
            aria-required={required}
            aria-invalid={!!errorEn}
            aria-describedby={errorEn ? enErrorId : undefined}
            class="w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errorEn ? 'border-error' : 'border-border'}"
          />
        {/if}
        {#if errorEn}
          <p id={enErrorId} class="text-xs text-error mt-1" role="alert">{errorEn}</p>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Desktop: Side by side (≥900px) -->
  <div class="hidden lg:grid lg:grid-cols-2 lg:gap-4">
    <div>
      <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {t('admin.bilingual.es', locale)}
      </span>
      {#if type === 'textarea'}
        <textarea
          id={esId}
          bind:value={nameEs}
          oninput={() => onChangeEs?.(nameEs)}
          aria-required={required}
          aria-invalid={!!errorEs}
          aria-describedby={errorEs ? esErrorId : undefined}
          class="w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errorEs ? 'border-error' : 'border-border'}"
          rows="3"
        ></textarea>
      {:else}
        <input
          id={esId}
          type="text"
          bind:value={nameEs}
          oninput={() => onChangeEs?.(nameEs)}
          aria-required={required}
          aria-invalid={!!errorEs}
          aria-describedby={errorEs ? esErrorId : undefined}
          class="w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errorEs ? 'border-error' : 'border-border'}"
        />
      {/if}
      {#if errorEs}
        <p id={esErrorId} class="text-xs text-error mt-1" role="alert">{errorEs}</p>
      {/if}
    </div>

    <div>
      <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        {t('admin.bilingual.en', locale)}
      </span>
      {#if type === 'textarea'}
        <textarea
          id={enId}
          bind:value={nameEn}
          oninput={() => onChangeEn?.(nameEn)}
          aria-required={required}
          aria-invalid={!!errorEn}
          aria-describedby={errorEn ? enErrorId : undefined}
          class="w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errorEn ? 'border-error' : 'border-border'}"
          rows="3"
        ></textarea>
      {:else}
        <input
          id={enId}
          type="text"
          bind:value={nameEn}
          oninput={() => onChangeEn?.(nameEn)}
          aria-required={required}
          aria-invalid={!!errorEn}
          aria-describedby={errorEn ? enErrorId : undefined}
          class="w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errorEn ? 'border-error' : 'border-border'}"
        />
      {/if}
      {#if errorEn}
        <p id={enErrorId} class="text-xs text-error mt-1" role="alert">{errorEn}</p>
      {/if}
    </div>
  </div>
</fieldset>
