<script lang="ts">
  import { t } from '../../lib/i18n/translations';

  const locale = 'es';

  interface Props {
    label: string;
    nameEs: string;
    nameEn: string;
    type?: 'input' | 'textarea';
    required?: boolean;
    idPrefix?: string;
    errorEs?: string;
    errorEn?: string;
    onChangeEs?: (value: string) => void;
    onChangeEn?: (value: string) => void;
    onBlurEs?: () => void;
    onBlurEn?: () => void;
  }

  let {
    label,
    nameEs = $bindable(),
    nameEn = $bindable(),
    type = 'input',
    required = false,
    idPrefix,
    errorEs = '',
    errorEn = '',
    onChangeEs,
    onChangeEn,
    onBlurEs,
    onBlurEn,
  }: Props = $props();

  let activeTab = $state<'es' | 'en'>('es');

  const labelSlug = $derived(label.toLowerCase().replace(/\s+/g, '-'));
  const base = $derived(idPrefix ?? `field-${labelSlug}`);
  const esId = $derived(idPrefix ? `${base}-es` : `field-es-${labelSlug}`);
  const enId = $derived(idPrefix ? `${base}-en` : `field-en-${labelSlug}`);
  const esErrorId = $derived(`${esId}-error`);
  const enErrorId = $derived(`${enId}-error`);
  const tabEsId = $derived(`tab-es-${idPrefix ?? labelSlug}`);
  const tabEnId = $derived(`tab-en-${idPrefix ?? labelSlug}`);
  const panelEsId = $derived(`panel-es-${idPrefix ?? labelSlug}`);
  const panelEnId = $derived(`panel-en-${idPrefix ?? labelSlug}`);
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
        id={tabEsId}
        aria-selected={activeTab === 'es'}
        aria-controls={panelEsId}
        class="px-3 py-1 rounded text-xs font-semibold transition-colors {activeTab === 'es' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-surface text-text-muted'}"
        onclick={() => (activeTab = 'es')}
      >
        {t('admin.bilingual.es', locale)}
      </button>
      <button
        type="button"
        role="tab"
        id={tabEnId}
        aria-selected={activeTab === 'en'}
        aria-controls={panelEnId}
        class="px-3 py-1 rounded text-xs font-semibold transition-colors {activeTab === 'en' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-surface text-text-muted'}"
        onclick={() => (activeTab = 'en')}
      >
        {t('admin.bilingual.en', locale)}
      </button>
    </div>

    {#if activeTab === 'es'}
      <div role="tabpanel" id={panelEsId} aria-labelledby={tabEsId}>
        {#if type === 'textarea'}
          <textarea
            id={esId}
            bind:value={nameEs}
            oninput={() => onChangeEs?.(nameEs)}
            onblur={() => onBlurEs?.()}
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
            onblur={() => onBlurEs?.()}
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
      <div role="tabpanel" id={panelEnId} aria-labelledby={tabEnId}>
        {#if type === 'textarea'}
          <textarea
            id={enId}
            bind:value={nameEn}
            oninput={() => onChangeEn?.(nameEn)}
            onblur={() => onBlurEn?.()}
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
            onblur={() => onBlurEn?.()}
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
          onblur={() => onBlurEs?.()}
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
          onblur={() => onBlurEs?.()}
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
      <span class="inline-block px-2 py-0.5 rounded text-xs font-semibold mb-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
        {t('admin.bilingual.en', locale)}
      </span>
      {#if type === 'textarea'}
        <textarea
          id={enId}
          bind:value={nameEn}
          oninput={() => onChangeEn?.(nameEn)}
          onblur={() => onBlurEn?.()}
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
          onblur={() => onBlurEn?.()}
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
