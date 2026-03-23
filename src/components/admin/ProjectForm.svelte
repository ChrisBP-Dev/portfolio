<script lang="ts">
  import { tick } from 'svelte';
  import { collection, addDoc, updateDoc, deleteDoc, doc, deleteField } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { imageService, type UploadHandle } from '../../lib/firebase/image-service';
  import {
    processImageSlot,
    cleanupDeletedImages,
  } from '../../lib/firebase/image-slot-processor';
  import { projectFormSchema } from '../../lib/schemas/project-schema';
  import type { ProjectWithId } from '../../lib/schemas/project-schema';
  import { t } from '../../lib/i18n/translations';
  import { slugify } from '../../lib/utils/slugify';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import { getFirestoreErrorMessage } from '../../lib/utils/error-messages';
  import type { ImageSlot } from '../../lib/schemas/image-slot';
  import BilingualField from './BilingualField.svelte';
  import BilingualArrayField from './BilingualArrayField.svelte';
  import ImageUploader from './ImageUploader.svelte';
  import ScreenshotManager from './ScreenshotManager.svelte';
  import TechnologySelector from './TechnologySelector.svelte';

  const locale = 'es';
  const PROJECTS_COLLECTION = 'Projects';

  interface Props {
    mode?: 'create' | 'edit';
    initialData?: ProjectWithId | null;
    onCancel: () => void;
    onSaved: () => void;
  }

  let { mode = 'create', initialData = null, onCancel, onSaved }: Props = $props();

  // Form state
  let companyNameEs = $state('');
  let companyNameEn = $state('');
  let shortDescriptionEs = $state('');
  let shortDescriptionEn = $state('');
  let featuresEs = $state<string[]>([]);
  let featuresEn = $state<string[]>([]);
  let mainImageSlot = $state<ImageSlot>({ type: 'empty' });
  let screenshots = $state<ImageSlot[]>([]);
  let selectedTechnologies = $state<string[]>([]);
  let websiteUrl = $state('');
  let sourceCodeUrl = $state('');
  let slug = $state('');
  let manualSlug = $state(false);
  let saving = $state(false);
  let hasChanges = $state(false);
  let mainImageProgress = $state<number | null>(null);

  // Validation errors
  let errors = $state<Record<string, string>>({});

  // Edit mode initialization — flag guard prevents infinite loop
  let initialized = false;
  let initializedForId: string | null = null;

  $effect(() => {
    if (mode === 'edit' && initialData && (!initialized || initializedForId !== initialData.id)) {
      initialized = true;
      initializedForId = initialData.id;
      companyNameEs = initialData.companyName.es;
      companyNameEn = initialData.companyName.en;
      shortDescriptionEs = initialData.shortDescription.es;
      shortDescriptionEn = initialData.shortDescription.en;
      featuresEs = [...(initialData.features?.es ?? [])];
      featuresEn = [...(initialData.features?.en ?? [])];
      mainImageSlot = initialData.mainImage
        ? { type: 'existing', image: initialData.mainImage }
        : { type: 'empty' };
      screenshots = (initialData.screenshots ?? []).map((img) => ({
        type: 'existing' as const,
        image: img,
      }));
      selectedTechnologies = [...(initialData.technologies ?? [])];
      websiteUrl = initialData.websiteUrl ?? '';
      sourceCodeUrl = initialData.sourceCodeUrl ?? '';
      slug = initialData.slug;
      manualSlug = true;
      hasChanges = false;
    }
  });

  // Auto-slug from companyName EN (en = defaultLocale, slugs appear in URL without prefix)
  $effect(() => {
    if (!manualSlug && mode === 'create') {
      slug = companyNameEn ? slugify(companyNameEn) : '';
    }
  });

  // Expose hasChanges for parent (CrudPage) to check before navigating away
  export function getHasChanges(): boolean {
    return hasChanges;
  }

  // Cancel in-flight uploads on unmount
  let activeUploads: UploadHandle[] = [];
  $effect(() => {
    return () => {
      activeUploads.forEach((h) => h.cancel());
      activeUploads = [];
    };
  });

  // Track changes
  function markDirty(): void {
    hasChanges = true;
  }

  function buildFormData(): Record<string, unknown> {
    const filteredFeaturesEs = featuresEs.filter((f) => f.trim() !== '').map((f) => f.trim());
    const filteredFeaturesEn = featuresEn.filter((f) => f.trim() !== '').map((f) => f.trim());

    const data: Record<string, unknown> = {
      companyName: { es: companyNameEs.trim(), en: companyNameEn.trim() },
      shortDescription: { es: shortDescriptionEs.trim(), en: shortDescriptionEn.trim() },
      features: { es: filteredFeaturesEs, en: filteredFeaturesEn },
      technologies: selectedTechnologies,
      slug: slug.trim(),
    };

    if (websiteUrl.trim()) {
      data.websiteUrl = websiteUrl.trim();
    } else if (mode === 'edit') {
      data.websiteUrl = deleteField();
    }

    if (sourceCodeUrl.trim()) {
      data.sourceCodeUrl = sourceCodeUrl.trim();
    } else if (mode === 'edit') {
      data.sourceCodeUrl = deleteField();
    }

    return data;
  }

  function validateField(field: string): void {
    const newErrors = { ...errors };
    delete newErrors[field];

    switch (field) {
      case 'companyNameEs':
        if (!companyNameEs.trim()) newErrors.companyNameEs = t('admin.validation.required', locale);
        break;
      case 'companyNameEn':
        if (!companyNameEn.trim()) newErrors.companyNameEn = t('admin.validation.required', locale);
        break;
      case 'shortDescriptionEs':
        if (!shortDescriptionEs.trim())
          newErrors.shortDescriptionEs = t('admin.validation.required', locale);
        break;
      case 'shortDescriptionEn':
        if (!shortDescriptionEn.trim())
          newErrors.shortDescriptionEn = t('admin.validation.required', locale);
        break;
      case 'slug':
        if (!slug.trim()) newErrors.slug = t('admin.validation.required', locale);
        else if (!projectFormSchema.shape.slug.safeParse(slug.trim()).success)
          newErrors.slug = t('admin.validation.slugInvalid', locale);
        break;
      case 'websiteUrl':
        if (websiteUrl.trim()) {
          const urlResult = projectFormSchema.shape.websiteUrl.safeParse(websiteUrl.trim());
          if (!urlResult.success) newErrors.websiteUrl = t('admin.validation.urlInvalid', locale);
        }
        break;
      case 'sourceCodeUrl':
        if (sourceCodeUrl.trim()) {
          const urlResult = projectFormSchema.shape.sourceCodeUrl.safeParse(sourceCodeUrl.trim());
          if (!urlResult.success)
            newErrors.sourceCodeUrl = t('admin.validation.urlInvalid', locale);
        }
        break;
      case 'mainImage':
        if (mainImageSlot.type === 'empty' || mainImageSlot.type === 'removed')
          newErrors.mainImage = t('admin.validation.imageRequired', locale);
        break;
    }

    errors = newErrors;
  }

  function validateAll(): boolean {
    const newErrors: Record<string, string> = {};

    const formData = buildFormData();
    // Remove deleteField sentinels before Zod validation
    const zodData = { ...formData };
    if (mode === 'edit') {
      for (const key of ['websiteUrl', 'sourceCodeUrl'] as const) {
        if (typeof zodData[key] !== 'string') {
          delete zodData[key];
        }
      }
    }
    const result = projectFormSchema.safeParse(zodData);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        switch (path) {
          case 'companyName.es':
            newErrors.companyNameEs = t('admin.validation.required', locale);
            break;
          case 'companyName.en':
            newErrors.companyNameEn = t('admin.validation.required', locale);
            break;
          case 'shortDescription.es':
            newErrors.shortDescriptionEs = t('admin.validation.required', locale);
            break;
          case 'shortDescription.en':
            newErrors.shortDescriptionEn = t('admin.validation.required', locale);
            break;
          case 'slug':
            newErrors.slug =
              issue.code === 'too_small'
                ? t('admin.validation.required', locale)
                : t('admin.validation.slugInvalid', locale);
            break;
          case 'websiteUrl':
            newErrors.websiteUrl = t('admin.validation.urlInvalid', locale);
            break;
          case 'sourceCodeUrl':
            newErrors.sourceCodeUrl = t('admin.validation.urlInvalid', locale);
            break;
        }
      }
    }

    // Main image validation — reject empty AND removed
    if (mainImageSlot.type === 'empty' || mainImageSlot.type === 'removed') {
      newErrors.mainImage = t('admin.validation.imageRequired', locale);
    }

    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  async function scrollToFirstError(): Promise<void> {
    await tick();
    const firstErrorEl = document.querySelector('[role="alert"]');
    firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function handleCreateSubmit(): Promise<void> {
    saving = true;
    try {
      const projectData = buildFormData();
      const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectData);
      const docId = docRef.id;

      try {
        if (mainImageSlot.type === 'new') {
          const mainPath = `projects/${docId}/main/${crypto.randomUUID()}.webp`;
          const mainHandle = imageService.upload(
            mainImageSlot.file,
            mainPath,
            (p) => { mainImageProgress = p; },
          );
          activeUploads.push(mainHandle);
          const mainStoredImage = await mainHandle;
          mainImageProgress = null;

          // Use allSettled for screenshots — partial success is acceptable
          const newScreenshots = screenshots.filter(
            (s): s is Extract<ImageSlot, { type: 'new' }> => s.type === 'new',
          );
          const screenshotHandles = newScreenshots.map((s) => {
            const screenshotPath = `projects/${docId}/screenshots/${crypto.randomUUID()}.webp`;
            const handle = imageService.upload(s.file, screenshotPath);
            activeUploads.push(handle);
            return handle;
          });

          const screenshotResults = await Promise.allSettled(screenshotHandles);
          const successfulScreenshots = screenshotResults
            .filter((r): r is PromiseFulfilledResult<{ url: string; storagePath: string }> =>
              r.status === 'fulfilled')
            .map((r) => r.value);
          const failedCount = screenshotResults.filter((r) => r.status === 'rejected').length;

          if (failedCount > 0) {
            toastStore.warning(
              t('admin.projects.form.screenshotPartialWarning', locale)
                .replace('{success}', String(successfulScreenshots.length))
                .replace('{total}', String(newScreenshots.length))
                .replace('{failed}', String(failedCount)),
            );
          }

          await updateDoc(doc(db, PROJECTS_COLLECTION, docId), {
            mainImage: mainStoredImage,
            screenshots: successfulScreenshots,
          });
        }
      } catch (uploadError) {
        // Best-effort rollback — delete orphan document and any uploaded images
        try {
          await deleteDoc(doc(db, PROJECTS_COLLECTION, docId));
        } catch (rollbackError) {
          console.error('Rollback failed — orphan document left:', docId, rollbackError);
        }
        try {
          await imageService.deleteByPrefix(`projects/${docId}/`);
        } catch {
          // Best-effort — orphan images may remain
        }
        console.error('Image upload failed after document creation:', uploadError);
        toastStore.error(getFirestoreErrorMessage(uploadError, locale));
        mainImageProgress = null;
        saving = false;
        return;
      } finally {
        activeUploads = [];
      }

      saving = false;
      toastStore.success(t('admin.projects.form.successToast', locale));
      onSaved();
    } catch (error) {
      console.error('Failed to save project:', error);
      toastStore.error(getFirestoreErrorMessage(error, locale));
      saving = false;
    }
  }

  async function handleEditSubmit(): Promise<void> {
    if (!initialData) return;
    const docId = initialData.id;

    saving = true;
    try {
      // Process main image
      const mainProcessed = await processImageSlot(
        mainImageSlot,
        `projects/${docId}/main/`,
        (p) => { mainImageProgress = p; },
      );
      mainImageProgress = null;

      // Process each screenshot
      const screenshotResults = await Promise.all(
        screenshots.map((slot) => processImageSlot(slot, `projects/${docId}/screenshots/`)),
      );

      // Build update payload
      const payload: Record<string, unknown> = {
        ...buildFormData(),
        mainImage: mainProcessed.image,
        screenshots: screenshotResults.map((r) => r.image).filter(Boolean),
      };

      // Update Firestore
      await updateDoc(doc(db, PROJECTS_COLLECTION, docId), payload);

      // Cleanup deleted images AFTER document update succeeds
      const allDeletePaths = [
        ...mainProcessed.toDelete,
        ...screenshotResults.flatMap((r) => r.toDelete),
      ];
      if (allDeletePaths.length > 0) {
        await cleanupDeletedImages(allDeletePaths);
      }

      saving = false;
      toastStore.success(t('admin.projects.editSuccessToast', locale));
      onSaved();
    } catch (error) {
      console.error('Failed to update project:', error);
      toastStore.error(getFirestoreErrorMessage(error, locale));
      mainImageProgress = null;
      saving = false;
    }
  }

  async function handleSubmit(): Promise<void> {
    if (saving) return;
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
    // Unsaved-changes guard is handled by CrudPage.navigateToList()
    onCancel();
  }

  // Derived labels for submit button based on mode
  let saveLabel = $derived(
    mode === 'edit' ? t('admin.projects.form.saveEdit', locale) : t('admin.projects.form.save', locale),
  );
  let savingLabel = $derived(
    mode === 'edit'
      ? t('admin.projects.form.savingEdit', locale)
      : t('admin.projects.form.saving', locale),
  );
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
  class="max-w-[700px] space-y-0"
  novalidate
>
  <!-- Section: Informacion Basica -->
  <div class="border-b border-border pb-6 mb-6">
    <h2 class="text-lg font-semibold text-text-primary mb-4">
      {t('admin.projects.form.sectionBasic', locale)}
    </h2>

    <div class="space-y-4">
      <BilingualField
        label={t('admin.projects.form.companyName', locale)}
        idPrefix="project-companyName"
        bind:nameEs={companyNameEs}
        bind:nameEn={companyNameEn}
        required
        errorEs={errors.companyNameEs ?? ''}
        errorEn={errors.companyNameEn ?? ''}
        onChangeEs={() => markDirty()}
        onChangeEn={() => markDirty()}
        onBlurEs={() => validateField('companyNameEs')}
        onBlurEn={() => validateField('companyNameEn')}
      />

      <BilingualField
        label={t('admin.projects.form.shortDescription', locale)}
        idPrefix="project-shortDescription"
        bind:nameEs={shortDescriptionEs}
        bind:nameEn={shortDescriptionEn}
        type="textarea"
        required
        errorEs={errors.shortDescriptionEs ?? ''}
        errorEn={errors.shortDescriptionEn ?? ''}
        onChangeEs={() => markDirty()}
        onChangeEn={() => markDirty()}
        onBlurEs={() => validateField('shortDescriptionEs')}
        onBlurEn={() => validateField('shortDescriptionEn')}
      />

      <BilingualArrayField
        label={t('admin.projects.form.features', locale)}
        bind:itemsEs={featuresEs}
        bind:itemsEn={featuresEn}
        onChangeEs={() => markDirty()}
        onChangeEn={() => markDirty()}
      />
    </div>
  </div>

  <!-- Section: Imagenes -->
  <div class="border-b border-border pb-6 mb-6">
    <h2 class="text-lg font-semibold text-text-primary mb-4">
      {t('admin.projects.form.sectionImages', locale)}
    </h2>

    <div class="space-y-4">
      <ImageUploader
        label={t('admin.projects.form.mainImage', locale)}
        bind:slot={mainImageSlot}
        required
        error={errors.mainImage ?? ''}
        uploadProgress={mainImageProgress}
        onChange={() => {
          markDirty();
          validateField('mainImage');
        }}
      />

      <div>
        <p class="text-sm font-medium text-text-primary mb-2">
          {t('admin.projects.form.screenshots', locale)}
        </p>
        <ScreenshotManager bind:screenshots onChange={() => markDirty()} />
      </div>
    </div>
  </div>

  <!-- Section: Metadata -->
  <div class="pb-6 mb-6">
    <h2 class="text-lg font-semibold text-text-primary mb-4">
      {t('admin.projects.form.sectionMetadata', locale)}
    </h2>

    <div class="space-y-4">
      <div>
        <p class="text-sm font-medium text-text-primary mb-2">
          {t('admin.projects.form.technologies', locale)}
        </p>
        <TechnologySelector bind:selected={selectedTechnologies} onChange={() => markDirty()} />
      </div>

      <div>
        <label for="websiteUrl" class="text-sm font-medium text-text-primary">
          {t('admin.projects.form.websiteUrl', locale)}
        </label>
        <input
          id="websiteUrl"
          type="url"
          bind:value={websiteUrl}
          oninput={() => markDirty()}
          onblur={() => validateField('websiteUrl')}
          aria-invalid={!!errors.websiteUrl}
          aria-describedby={errors.websiteUrl ? 'websiteUrl-error' : undefined}
          class="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errors.websiteUrl ? 'border-error' : 'border-border'}"
          placeholder="https://..."
        />
        {#if errors.websiteUrl}
          <p id="websiteUrl-error" class="text-xs text-error mt-1" role="alert">
            {errors.websiteUrl}
          </p>
        {/if}
      </div>

      <div>
        <label for="sourceCodeUrl" class="text-sm font-medium text-text-primary">
          {t('admin.projects.form.sourceCodeUrl', locale)}
        </label>
        <input
          id="sourceCodeUrl"
          type="url"
          bind:value={sourceCodeUrl}
          oninput={() => markDirty()}
          onblur={() => validateField('sourceCodeUrl')}
          aria-invalid={!!errors.sourceCodeUrl}
          aria-describedby={errors.sourceCodeUrl ? 'sourceCodeUrl-error' : undefined}
          class="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errors.sourceCodeUrl ? 'border-error' : 'border-border'}"
          placeholder="https://github.com/..."
        />
        {#if errors.sourceCodeUrl}
          <p id="sourceCodeUrl-error" class="text-xs text-error mt-1" role="alert">
            {errors.sourceCodeUrl}
          </p>
        {/if}
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <label for="slug" class="text-sm font-medium text-text-primary">
            {t('admin.projects.form.slug', locale)}
            <span class="text-error" aria-hidden="true">*</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
            <input type="checkbox" bind:checked={manualSlug} class="rounded border-border" />
            {t('admin.projects.form.slugManual', locale)}
          </label>
        </div>
        <input
          id="slug"
          type="text"
          bind:value={slug}
          oninput={() => markDirty()}
          onblur={() => validateField('slug')}
          disabled={!manualSlug}
          aria-required="true"
          aria-invalid={!!errors.slug}
          aria-describedby={errors.slug ? 'slug-error' : undefined}
          class="w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errors.slug ? 'border-error' : 'border-border'} {!manualSlug ? 'opacity-60' : ''}"
        />
        {#if errors.slug}
          <p id="slug-error" class="text-xs text-error mt-1" role="alert">{errors.slug}</p>
        {/if}
      </div>
    </div>
  </div>

  <!-- Actions -->
  <div class="flex gap-3 pt-4 border-t border-border">
    <button
      type="submit"
      disabled={saving}
      aria-busy={saving ? 'true' : undefined}
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
      {t('admin.projects.form.cancel', locale)}
    </button>
  </div>
</form>
