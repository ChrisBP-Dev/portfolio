<script lang="ts">
  import { tick } from 'svelte';
  import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { imageService, type UploadHandle } from '../../lib/firebase/image-service';
  import {
    processImageSlot,
    cleanupDeletedImages,
  } from '../../lib/firebase/image-slot-processor';
  import { cleanupOrphanedImages } from '../../lib/firebase/orphan-cleanup';
  import { technologyFormSchema } from '../../lib/schemas/technology-schema';
  import type { TechnologyWithId } from '../../lib/schemas/technology-schema';
  import type { StoredImage } from '../../lib/schemas/shared-schemas';
  import type { ImageSlot } from '../../lib/schemas/image-slot';
  import { t } from '../../lib/i18n/translations';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import { getFirestoreErrorMessage } from '../../lib/utils/error-messages';
  import ImageUploader from './ImageUploader.svelte';

  const locale = 'es';
  const TECHNOLOGIES_COLLECTION = 'Technologies';

  interface Props {
    mode?: 'create' | 'edit';
    initialData?: TechnologyWithId | null;
    onCancel: () => void;
    onSaved: () => void;
  }

  let { mode = 'create', initialData = null, onCancel, onSaved }: Props = $props();

  // Form state
  let name = $state('');
  let experienceYears = $state(0);
  let imageSlot = $state<ImageSlot>({ type: 'empty' });
  let errors = $state<Record<string, string>>({});
  let saving = $state(false);
  let hasChanges = $state(false);
  let imageProgress = $state<number | null>(null);

  // Orphan cleanup session trackers (plain let — JS closures capture by reference)
  let savedSuccessfully = false;
  let sessionUploadedImage: StoredImage | null = null;

  // Edit mode initialization — track by id to re-init when switching items
  let initializedId = $state('');

  $effect(() => {
    if (mode === 'edit' && initialData && initializedId !== initialData.id) {
      initializedId = initialData.id;
      name = initialData.name;
      experienceYears = initialData.experienceYears;
      imageSlot = { type: 'existing', image: initialData.image };
      hasChanges = false;
      errors = {};
      // Reset orphan cleanup trackers on edit re-initialization
      savedSuccessfully = false;
      sessionUploadedImage = null;
    }
  });

  // Expose hasChanges for parent (CrudPage) to check before navigating away
  export function getHasChanges(): boolean {
    return hasChanges;
  }

  // Cancel in-flight uploads on unmount + orphan cleanup
  let activeUpload: UploadHandle | null = null;
  $effect(() => {
    return () => {
      activeUpload?.cancel();
      activeUpload = null;
      if (!savedSuccessfully && sessionUploadedImage) {
        cleanupOrphanedImages([sessionUploadedImage]);
      }
    };
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

  function validateName(): boolean {
    if (!name.trim()) {
      errors = { ...errors, name: t('admin.validation.required', locale) };
      return false;
    }
    clearError('name');
    return true;
  }

  function validateExperienceYears(): boolean {
    if (isNaN(experienceYears) || experienceYears < 0) {
      errors = { ...errors, experienceYears: t('admin.validation.numberNonNegative', locale) };
      return false;
    }
    if (!Number.isInteger(experienceYears)) {
      errors = { ...errors, experienceYears: t('admin.validation.numberRequired', locale) };
      return false;
    }
    clearError('experienceYears');
    return true;
  }

  function validateImage(): boolean {
    if (imageSlot.type === 'empty' || imageSlot.type === 'removed') {
      errors = { ...errors, image: t('admin.validation.imageRequired', locale) };
      return false;
    }
    clearError('image');
    return true;
  }

  function validateField(field: string): void {
    switch (field) {
      case 'name':
        validateName();
        break;
      case 'experienceYears':
        validateExperienceYears();
        break;
      case 'image':
        validateImage();
        break;
    }
  }

  function validateAll(): boolean {
    const nameValid = validateName();
    const yearsValid = validateExperienceYears();
    const imageValid = validateImage();

    // Also validate via Zod schema for form fields
    const result = technologyFormSchema.safeParse({
      name: name.trim(),
      experienceYears,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = { ...errors };
      for (const issue of result.error.issues) {
        const path = issue.path[0];
        if (path === 'name' && !newErrors.name) {
          newErrors.name = t('admin.validation.required', locale);
        }
        if (path === 'experienceYears' && !newErrors.experienceYears) {
          newErrors.experienceYears = t('admin.validation.numberRequired', locale);
        }
      }
      errors = newErrors;
    }

    return nameValid && yearsValid && imageValid;
  }

  async function scrollToFirstError(): Promise<void> {
    await tick();
    const firstErrorEl = document.querySelector('[role="alert"]');
    firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function handleCreateSubmit(): Promise<void> {
    saving = true;
    try {
      const existingSnapshot = await getDocs(collection(db, TECHNOLOGIES_COLLECTION));
      const maxOrder = existingSnapshot.docs.reduce((max, d) => {
        const raw = (d.data() as Record<string, unknown>).order;
        const num = typeof raw === 'number' && !isNaN(raw) ? raw : 0;
        return Math.max(max, num);
      }, -1);

      const formData = { name: name.trim(), experienceYears, order: maxOrder + 1 };
      const docRef = await addDoc(collection(db, TECHNOLOGIES_COLLECTION), formData);
      const docId = docRef.id;

      try {
        if (imageSlot.type === 'new') {
          const imagePath = `technologies/${docId}/${crypto.randomUUID()}.webp`;
          const handle = imageService.upload(
            imageSlot.file,
            imagePath,
            (p) => { imageProgress = p; },
          );
          activeUpload = handle;
          const storedImage = await handle;
          imageProgress = null;
          sessionUploadedImage = storedImage;
          await updateDoc(doc(db, TECHNOLOGIES_COLLECTION, docId), { image: storedImage });
        }
      } catch (uploadError) {
        // Best-effort rollback — delete orphan document and any uploaded images
        try {
          await deleteDoc(doc(db, TECHNOLOGIES_COLLECTION, docId));
        } catch (rollbackError) {
          console.error('Rollback failed — orphan document left:', docId, rollbackError);
        }
        try {
          await imageService.deleteByPrefix(`technologies/${docId}/`);
        } catch {
          // Best-effort — orphan images may remain
        }
        sessionUploadedImage = null;
        console.error('Image upload failed after document creation:', uploadError);
        toastStore.error(getFirestoreErrorMessage(uploadError, locale));
        imageProgress = null;
        saving = false;
        return;
      } finally {
        activeUpload = null;
      }

      savedSuccessfully = true;
      saving = false;
      toastStore.success(t('admin.technologies.createSuccessToast', locale));
      onSaved();
    } catch (error) {
      console.error('Failed to create technology:', error);
      toastStore.error(getFirestoreErrorMessage(error, locale));
      imageProgress = null;
      saving = false;
    }
  }

  async function handleEditSubmit(): Promise<void> {
    if (!initialData) return;
    const docId = initialData.id;

    saving = true;
    try {
      const processed = await processImageSlot(
        imageSlot,
        `technologies/${docId}/`,
        (p) => { imageProgress = p; },
      );
      imageProgress = null;

      // Track newly uploaded image for orphan cleanup
      if ((imageSlot.type === 'new' || imageSlot.type === 'replaced') && processed.image) {
        sessionUploadedImage = processed.image;
      }

      const payload = {
        name: name.trim(),
        experienceYears,
        ...(processed.image && { image: processed.image }),
      };

      await updateDoc(doc(db, TECHNOLOGIES_COLLECTION, docId), payload);

      if (processed.toDelete.length > 0) {
        await cleanupDeletedImages(processed.toDelete);
      }

      savedSuccessfully = true;
      saving = false;
      toastStore.success(t('admin.technologies.editSuccessToast', locale));
      onSaved();
    } catch (error) {
      // Cleanup image uploaded during this failed attempt
      if (sessionUploadedImage) {
        cleanupOrphanedImages([sessionUploadedImage]);
        sessionUploadedImage = null;
      }
      console.error('Failed to update technology:', error);
      toastStore.error(getFirestoreErrorMessage(error, locale));
      imageProgress = null;
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

  let saveLabel = $derived(
    mode === 'edit'
      ? t('admin.technologies.form.saveEdit', locale)
      : t('admin.technologies.form.save', locale),
  );
  let savingLabel = $derived(
    mode === 'edit'
      ? t('admin.technologies.form.savingEdit', locale)
      : t('admin.technologies.form.saving', locale),
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
  <!-- Name -->
  <div>
    <label for="tech-name" class="text-sm font-medium text-text-primary">
      {t('admin.technologies.form.name', locale)}
      <span class="text-error" aria-hidden="true">*</span>
    </label>
    <input
      id="tech-name"
      type="text"
      bind:value={name}
      oninput={() => markDirty()}
      onblur={() => validateField('name')}
      aria-required="true"
      aria-invalid={!!errors.name}
      aria-describedby={errors.name ? 'tech-name-error' : undefined}
      class="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errors.name ? 'border-error' : 'border-border'}"
    />
    {#if errors.name}
      <p id="tech-name-error" class="text-xs text-error mt-1" role="alert">
        {errors.name}
      </p>
    {/if}
  </div>

  <!-- Experience Years -->
  <div>
    <label for="tech-years" class="text-sm font-medium text-text-primary">
      {t('admin.technologies.form.experienceYears', locale)}
      <span class="text-error" aria-hidden="true">*</span>
    </label>
    <input
      id="tech-years"
      type="number"
      min="0"
      step="1"
      bind:value={experienceYears}
      oninput={() => markDirty()}
      onblur={() => validateField('experienceYears')}
      aria-required="true"
      aria-invalid={!!errors.experienceYears}
      aria-describedby={errors.experienceYears ? 'tech-years-error' : undefined}
      class="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errors.experienceYears ? 'border-error' : 'border-border'}"
    />
    {#if errors.experienceYears}
      <p id="tech-years-error" class="text-xs text-error mt-1" role="alert">
        {errors.experienceYears}
      </p>
    {/if}
  </div>

  <!-- Image -->
  <ImageUploader
    label={t('admin.technologies.form.image', locale)}
    bind:slot={imageSlot}
    required
    error={errors.image ?? ''}
    uploadProgress={imageProgress}
    onChange={() => {
      markDirty();
      validateField('image');
    }}
  />

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
      {t('admin.technologies.form.cancel', locale)}
    </button>
  </div>
</form>
