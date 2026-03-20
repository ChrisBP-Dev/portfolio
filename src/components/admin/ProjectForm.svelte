<script lang="ts">
  import { tick } from 'svelte';
  import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { imageService } from '../../lib/firebase/image-service';
  import { projectFormSchema } from '../../lib/schemas/project-schema';
  import { t } from '../../lib/i18n/translations';
  import { slugify } from '../../lib/utils/slugify';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import type { ImageSlot } from '../../lib/schemas/image-slot';
  import BilingualField from './BilingualField.svelte';
  import BilingualArrayField from './BilingualArrayField.svelte';
  import ImageUploader from './ImageUploader.svelte';
  import ScreenshotManager from './ScreenshotManager.svelte';
  import TechnologySelector from './TechnologySelector.svelte';

  const locale = 'es';
  const PROJECTS_COLLECTION = 'Projects';

  interface Props {
    onCancel: () => void;
    onSaved: () => void;
  }

  let { onCancel, onSaved }: Props = $props();

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

  // Validation errors
  let errors = $state<Record<string, string>>({});

  // Auto-slug from companyName ES
  $effect(() => {
    if (!manualSlug) {
      slug = slugify(companyNameEs);
    }
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

    if (websiteUrl.trim()) data.websiteUrl = websiteUrl.trim();
    if (sourceCodeUrl.trim()) data.sourceCodeUrl = sourceCodeUrl.trim();

    return data;
  }

  function validateField(field: string): void {
    const newErrors = { ...errors };
    delete newErrors[field];

    // Build partial data and validate the specific field with Zod-like checks
    // Per-field blur validation uses the same rules as Zod schema
    switch (field) {
      case 'companyNameEs':
        if (!companyNameEs.trim()) newErrors.companyNameEs = t('admin.validation.required', locale);
        break;
      case 'companyNameEn':
        if (!companyNameEn.trim()) newErrors.companyNameEn = t('admin.validation.required', locale);
        break;
      case 'shortDescriptionEs':
        if (!shortDescriptionEs.trim()) newErrors.shortDescriptionEs = t('admin.validation.required', locale);
        break;
      case 'shortDescriptionEn':
        if (!shortDescriptionEn.trim()) newErrors.shortDescriptionEn = t('admin.validation.required', locale);
        break;
      case 'slug':
        if (!slug.trim()) newErrors.slug = t('admin.validation.required', locale);
        else if (!projectFormSchema.shape.slug.safeParse(slug.trim()).success) newErrors.slug = t('admin.validation.slugInvalid', locale);
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
          if (!urlResult.success) newErrors.sourceCodeUrl = t('admin.validation.urlInvalid', locale);
        }
        break;
      case 'mainImage':
        if (mainImageSlot.type === 'empty') newErrors.mainImage = t('admin.validation.imageRequired', locale);
        break;
    }

    errors = newErrors;
  }

  function validateAll(): boolean {
    const newErrors: Record<string, string> = {};

    // Step 1: Validate with Zod projectFormSchema
    const formData = buildFormData();
    const result = projectFormSchema.safeParse(formData);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        switch (path) {
          case 'companyName.es': newErrors.companyNameEs = t('admin.validation.required', locale); break;
          case 'companyName.en': newErrors.companyNameEn = t('admin.validation.required', locale); break;
          case 'shortDescription.es': newErrors.shortDescriptionEs = t('admin.validation.required', locale); break;
          case 'shortDescription.en': newErrors.shortDescriptionEn = t('admin.validation.required', locale); break;
          case 'slug':
            newErrors.slug = issue.code === 'too_small'
              ? t('admin.validation.required', locale)
              : t('admin.validation.slugInvalid', locale);
            break;
          case 'websiteUrl': newErrors.websiteUrl = t('admin.validation.urlInvalid', locale); break;
          case 'sourceCodeUrl': newErrors.sourceCodeUrl = t('admin.validation.urlInvalid', locale); break;
        }
      }
    }

    // Main image validation (handled separately — not in schema)
    if (mainImageSlot.type === 'empty') {
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

  async function handleSubmit(): Promise<void> {
    if (!validateAll()) {
      scrollToFirstError();
      return;
    }

    saving = true;
    try {
      // Step 1: Prepare non-image data (no image placeholders per spec)
      const projectData = buildFormData();

      // Step 2: addDoc to Firestore → get docId
      const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectData);
      const docId = docRef.id;

      // Step 3: Upload images
      try {
        if (mainImageSlot.type === 'new') {
          const mainPath = `projects/${docId}/main/${crypto.randomUUID()}.webp`;
          const mainStoredImage = await imageService.upload(mainImageSlot.file, mainPath);

          // Screenshots
          const screenshotImages = await Promise.all(
            screenshots
              .filter((s): s is Extract<ImageSlot, { type: 'new' }> => s.type === 'new')
              .map((s) => {
                const screenshotPath = `projects/${docId}/screenshots/${crypto.randomUUID()}.webp`;
                return imageService.upload(s.file, screenshotPath);
              }),
          );

          // Step 4: updateDoc with image references
          await updateDoc(doc(db, PROJECTS_COLLECTION, docId), {
            mainImage: mainStoredImage,
            screenshots: screenshotImages,
          });
        }
      } catch (uploadError) {
        console.error('Image upload failed after document creation:', uploadError);
        toastStore.error(t('admin.projects.form.errorToast', locale));
        saving = false;
        return;
      }

      // Step 5: Success
      toastStore.success(t('admin.projects.form.successToast', locale));
      setTimeout(() => onSaved(), 1500);
    } catch (error) {
      console.error('Failed to save project:', error);
      toastStore.error(t('admin.projects.form.errorToast', locale));
      saving = false;
    }
  }

  function handleCancel(): void {
    if (hasChanges) {
      const confirmed = window.confirm(t('admin.projects.form.discardChanges', locale));
      if (!confirmed) return;
    }
    onCancel();
  }
</script>

<form
  onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}
  class="max-w-[700px] space-y-0"
  novalidate
>
  <!-- Section: Información Básica -->
  <div class="border-b border-border pb-6 mb-6">
    <h2 class="text-lg font-semibold text-text-primary mb-4">
      {t('admin.projects.form.sectionBasic', locale)}
    </h2>

    <div class="space-y-4">
      <BilingualField
        label={t('admin.projects.form.companyName', locale)}
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

  <!-- Section: Imágenes -->
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
        onChange={() => { markDirty(); validateField('mainImage'); }}
      />

      <div>
        <p class="text-sm font-medium text-text-primary mb-2">
          {t('admin.projects.form.screenshots', locale)}
        </p>
        <ScreenshotManager
          bind:screenshots
          onChange={() => markDirty()}
        />
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
        <TechnologySelector
          bind:selected={selectedTechnologies}
          onChange={() => markDirty()}
        />
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
          <p id="websiteUrl-error" class="text-xs text-error mt-1" role="alert">{errors.websiteUrl}</p>
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
          <p id="sourceCodeUrl-error" class="text-xs text-error mt-1" role="alert">{errors.sourceCodeUrl}</p>
        {/if}
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <label for="slug" class="text-sm font-medium text-text-primary">
            {t('admin.projects.form.slug', locale)}
            <span class="text-error" aria-hidden="true">*</span>
          </label>
          <label class="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              bind:checked={manualSlug}
              class="rounded border-border"
            />
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
      class="px-6 py-3 rounded-lg font-semibold text-white [background:var(--brand-gradient)] min-h-11 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {#if saving}
        <svg class="w-4 h-4 motion-safe:animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        {t('admin.projects.form.saving', locale)}
      {:else}
        {t('admin.projects.form.save', locale)}
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
