<script lang="ts">
  import { tick } from 'svelte';
  import { collection, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { experienceFormSchema } from '../../lib/schemas/experience-schema';
  import type { ExperienceWithId } from '../../lib/schemas/experience-schema';
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import BilingualField from './BilingualField.svelte';
  import BilingualArrayField from './BilingualArrayField.svelte';

  const locale = 'es';
  const EXPERIENCES_COLLECTION = 'Experiences';

  function getFirestoreErrorMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      if (code === 'permission-denied') return t('admin.error.permissionDenied', locale);
      if (code === 'not-found') return t('admin.error.notFound', locale);
      if (code === 'unavailable') return t('admin.error.unavailable', locale);
    }
    return t('admin.error.unknown', locale);
  }

  interface Props {
    mode?: 'create' | 'edit';
    initialData?: ExperienceWithId | null;
    onCancel: () => void;
    onSaved: () => void;
  }

  let { mode = 'create', initialData = null, onCancel, onSaved }: Props = $props();

  // Form state
  let companyName = $state('');
  let jobNameEs = $state('');
  let jobNameEn = $state('');
  let responsibilitiesEs = $state<string[]>(['']);
  let responsibilitiesEn = $state<string[]>(['']);
  let startDate = $state('');
  let endDate = $state('');
  let currentlyWorking = $state(false);
  let errors = $state<Record<string, string>>({});
  let saving = $state(false);
  let hasChanges = $state(false);

  // Edit mode initialization
  let initializedId = $state('');

  $effect(() => {
    if (mode === 'edit' && initialData && initializedId !== initialData.id) {
      initializedId = initialData.id;
      companyName = initialData.companyName;
      jobNameEs = initialData.jobName.es;
      jobNameEn = initialData.jobName.en;
      responsibilitiesEs = [...initialData.responsibilities.es];
      responsibilitiesEn = [...initialData.responsibilities.en];
      startDate = initialData.startDate.toISOString().split('T')[0];
      currentlyWorking = initialData.endDate === null;
      endDate = initialData.endDate ? initialData.endDate.toISOString().split('T')[0] : '';
      hasChanges = false;
      errors = {};
    }
  });

  function markDirty(): void {
    hasChanges = true;
  }

  // Validation
  function clearError(field: string): void {
    const newErrors = { ...errors };
    delete newErrors[field];
    errors = newErrors;
  }

  function validateCompanyName(): boolean {
    if (!companyName.trim()) {
      errors = { ...errors, companyName: t('admin.validation.required', locale) };
      return false;
    }
    clearError('companyName');
    return true;
  }

  function validateJobNameEs(): boolean {
    if (!jobNameEs.trim()) {
      errors = { ...errors, jobNameEs: t('admin.validation.required', locale) };
      return false;
    }
    clearError('jobNameEs');
    return true;
  }

  function validateJobNameEn(): boolean {
    if (!jobNameEn.trim()) {
      errors = { ...errors, jobNameEn: t('admin.validation.required', locale) };
      return false;
    }
    clearError('jobNameEn');
    return true;
  }

  function validateResponsibilitiesEs(): boolean {
    if (responsibilitiesEs.filter((s) => s.trim()).length === 0) {
      errors = { ...errors, responsibilitiesEs: t('admin.validation.required', locale) };
      return false;
    }
    clearError('responsibilitiesEs');
    return true;
  }

  function validateResponsibilitiesEn(): boolean {
    if (responsibilitiesEn.filter((s) => s.trim()).length === 0) {
      errors = { ...errors, responsibilitiesEn: t('admin.validation.required', locale) };
      return false;
    }
    clearError('responsibilitiesEn');
    return true;
  }

  function validateStartDate(): boolean {
    if (!startDate) {
      errors = { ...errors, startDate: t('admin.validation.required', locale) };
      return false;
    }
    clearError('startDate');
    return true;
  }

  function validateEndDate(): boolean {
    if (!currentlyWorking) {
      if (!endDate) {
        errors = { ...errors, endDate: t('admin.validation.required', locale) };
        return false;
      }
      if (startDate && new Date(endDate) < new Date(startDate)) {
        errors = { ...errors, endDate: t('admin.experiences.form.dateRangeError', locale) };
        return false;
      }
    }
    clearError('endDate');
    return true;
  }

  function validateField(field: string): void {
    switch (field) {
      case 'companyName':
        validateCompanyName();
        break;
      case 'jobNameEs':
        validateJobNameEs();
        break;
      case 'jobNameEn':
        validateJobNameEn();
        break;
      case 'startDate':
        validateStartDate();
        break;
      case 'endDate':
        validateEndDate();
        break;
    }
  }

  function validateAll(): boolean {
    const companyValid = validateCompanyName();
    const jobEsValid = validateJobNameEs();
    const jobEnValid = validateJobNameEn();
    const respEsValid = validateResponsibilitiesEs();
    const respEnValid = validateResponsibilitiesEn();
    const startValid = validateStartDate();
    const endValid = validateEndDate();

    // Zod schema validation
    const startDateObj = startDate ? new Date(startDate) : new Date('invalid');
    const endDateObj = currentlyWorking ? null : endDate ? new Date(endDate) : new Date('invalid');

    const result = experienceFormSchema.safeParse({
      companyName: companyName.trim(),
      jobName: { es: jobNameEs.trim(), en: jobNameEn.trim() },
      responsibilities: {
        es: responsibilitiesEs.filter((s) => s.trim()).map((s) => s.trim()),
        en: responsibilitiesEn.filter((s) => s.trim()).map((s) => s.trim()),
      },
      startDate: startDateObj,
      endDate: endDateObj,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = { ...errors };
      for (const issue of result.error.issues) {
        const path = issue.path[0];
        if (path === 'endDate' && !newErrors.endDate) {
          newErrors.endDate = t('admin.experiences.form.dateRangeError', locale);
        }
      }
      errors = newErrors;
    }

    return companyValid && jobEsValid && jobEnValid && respEsValid && respEnValid && startValid && endValid;
  }

  async function scrollToFirstError(): Promise<void> {
    await tick();
    const firstErrorEl = document.querySelector('[role="alert"]');
    firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function buildPayload() {
    return {
      companyName: companyName.trim(),
      jobName: { es: jobNameEs.trim(), en: jobNameEn.trim() },
      responsibilities: {
        es: responsibilitiesEs.filter((s) => s.trim()).map((s) => s.trim()),
        en: responsibilitiesEn.filter((s) => s.trim()).map((s) => s.trim()),
      },
      startDate: Timestamp.fromDate(new Date(startDate)),
      endDate: currentlyWorking ? null : Timestamp.fromDate(new Date(endDate)),
    };
  }

  async function handleCreateSubmit(): Promise<void> {
    saving = true;
    try {
      const payload = buildPayload();
      await addDoc(collection(db, EXPERIENCES_COLLECTION), payload);
      saving = false;
      toastStore.success(t('admin.experiences.createSuccessToast', locale));
      onSaved();
    } catch (error) {
      console.error('Failed to create experience:', error);
      toastStore.error(getFirestoreErrorMessage(error));
      saving = false;
    }
  }

  async function handleEditSubmit(): Promise<void> {
    if (!initialData) return;
    saving = true;
    try {
      const payload = buildPayload();
      await updateDoc(doc(db, EXPERIENCES_COLLECTION, initialData.id), payload);
      saving = false;
      toastStore.success(t('admin.experiences.editSuccessToast', locale));
      onSaved();
    } catch (error) {
      console.error('Failed to update experience:', error);
      toastStore.error(getFirestoreErrorMessage(error));
      saving = false;
    }
  }

  async function handleSubmit(): Promise<void> {
    if (!validateAll()) {
      scrollToFirstError();
      return;
    }

    if (mode === 'edit') {
      await handleEditSubmit();
    } else {
      await handleCreateSubmit();
    }
  }

  function handleCancel(): void {
    if (hasChanges) {
      const confirmed = window.confirm(t('admin.experiences.form.discardChanges', locale));
      if (!confirmed) return;
    }
    onCancel();
  }

  let saveLabel = $derived(
    mode === 'edit'
      ? t('admin.experiences.form.saveEdit', locale)
      : t('admin.experiences.form.save', locale),
  );
  let savingLabel = $derived(
    mode === 'edit'
      ? t('admin.experiences.form.savingEdit', locale)
      : t('admin.experiences.form.saving', locale),
  );
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
  class="max-w-lg space-y-6"
  novalidate
>
  <!-- Company Name -->
  <div>
    <label for="exp-companyName" class="text-sm font-medium text-text-primary">
      {t('admin.experiences.form.companyName', locale)}
      <span class="text-error" aria-hidden="true">*</span>
    </label>
    <input
      id="exp-companyName"
      type="text"
      bind:value={companyName}
      oninput={() => markDirty()}
      onblur={() => validateField('companyName')}
      aria-required="true"
      aria-invalid={!!errors.companyName}
      aria-describedby={errors.companyName ? 'exp-companyName-error' : undefined}
      class="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errors.companyName ? 'border-error' : 'border-border'}"
    />
    {#if errors.companyName}
      <p id="exp-companyName-error" class="text-xs text-error mt-1" role="alert">
        {errors.companyName}
      </p>
    {/if}
  </div>

  <!-- Job Name (Bilingual) -->
  <BilingualField
    label={t('admin.experiences.form.jobName', locale)}
    bind:nameEs={jobNameEs}
    bind:nameEn={jobNameEn}
    type="input"
    required
    errorEs={errors.jobNameEs ?? ''}
    errorEn={errors.jobNameEn ?? ''}
    onChangeEs={() => markDirty()}
    onChangeEn={() => markDirty()}
    onBlurEs={() => validateField('jobNameEs')}
    onBlurEn={() => validateField('jobNameEn')}
  />

  <!-- Responsibilities (Bilingual Array) -->
  <BilingualArrayField
    label={t('admin.experiences.form.responsibilities', locale)}
    bind:itemsEs={responsibilitiesEs}
    bind:itemsEn={responsibilitiesEn}
    required
    onChangeEs={() => markDirty()}
    onChangeEn={() => markDirty()}
  />
  {#if errors.responsibilitiesEs}
    <p id="exp-responsibilitiesEs-error" class="text-xs text-error -mt-4" role="alert">
      {errors.responsibilitiesEs}
    </p>
  {/if}
  {#if errors.responsibilitiesEn}
    <p id="exp-responsibilitiesEn-error" class="text-xs text-error -mt-4" role="alert">
      {errors.responsibilitiesEn}
    </p>
  {/if}

  <!-- Start Date -->
  <div>
    <label for="exp-startDate" class="text-sm font-medium text-text-primary">
      {t('admin.experiences.form.startDate', locale)}
      <span class="text-error" aria-hidden="true">*</span>
    </label>
    <input
      id="exp-startDate"
      type="date"
      bind:value={startDate}
      oninput={() => markDirty()}
      onblur={() => validateField('startDate')}
      aria-required="true"
      aria-invalid={!!errors.startDate}
      aria-describedby={errors.startDate ? 'exp-startDate-error' : undefined}
      class="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errors.startDate ? 'border-error' : 'border-border'}"
    />
    {#if errors.startDate}
      <p id="exp-startDate-error" class="text-xs text-error mt-1" role="alert">
        {errors.startDate}
      </p>
    {/if}
  </div>

  <!-- End Date -->
  <div>
    <label for="exp-endDate" class="text-sm font-medium text-text-primary">
      {t('admin.experiences.form.endDate', locale)}
      {#if !currentlyWorking}<span class="text-error" aria-hidden="true">*</span>{/if}
    </label>
    <input
      id="exp-endDate"
      type="date"
      bind:value={endDate}
      oninput={() => markDirty()}
      onblur={() => validateField('endDate')}
      disabled={currentlyWorking}
      aria-required={!currentlyWorking}
      aria-invalid={!!errors.endDate}
      aria-describedby={errors.endDate ? 'exp-endDate-error' : undefined}
      class="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed {errors.endDate ? 'border-error' : 'border-border'}"
    />
    {#if errors.endDate}
      <p id="exp-endDate-error" class="text-xs text-error mt-1" role="alert">
        {errors.endDate}
      </p>
    {/if}
  </div>

  <!-- Currently Working Checkbox -->
  <div class="flex items-center gap-2">
    <input
      id="exp-currentlyWorking"
      type="checkbox"
      bind:checked={currentlyWorking}
      onchange={() => {
        markDirty();
        if (currentlyWorking) {
          clearError('endDate');
        }
      }}
      class="w-4 h-4 rounded border-border text-primary focus:ring-primary"
    />
    <label for="exp-currentlyWorking" class="text-sm text-text-primary">
      {t('admin.experiences.form.currentlyWorking', locale)}
    </label>
  </div>

  <!-- Actions -->
  <div class="flex gap-3 pt-4 border-t border-border">
    <button
      type="submit"
      disabled={saving}
      class="px-6 py-3 rounded-lg font-semibold text-white [background:var(--brand-gradient)] min-h-11 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {#if saving}
        <svg
          class="w-4 h-4 motion-safe:animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
        {savingLabel}
      {:else}
        {saveLabel}
      {/if}
    </button>

    <button
      type="button"
      onclick={handleCancel}
      disabled={saving}
      class="px-6 py-3 rounded-lg font-semibold border border-border text-text-primary min-h-11 transition-colors hover:bg-surface disabled:opacity-50"
    >
      {t('admin.experiences.form.cancel', locale)}
    </button>
  </div>
</form>
