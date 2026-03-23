<script lang="ts">
  import { tick } from 'svelte';
  import { collection, addDoc, updateDoc, doc, query, where, limit, getDocs, Timestamp } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import type { UploadHandle } from '../../lib/firebase/image-service';
  import { processImageSlot } from '../../lib/firebase/image-slot-processor';
  import { blogPostFormSchema } from '../../lib/schemas/blog-post-schema';
  import type { BlogPostWithId } from '../../lib/schemas/blog-post-schema';
  import { t } from '../../lib/i18n/translations';
  import { slugify } from '../../lib/utils/slugify';
  import { isTipTapContentEmpty } from '../../lib/utils/tiptap-helpers';
  import { toastStore } from '../../lib/utils/toast-store.svelte';
  import { getFirestoreErrorMessage } from '../../lib/utils/error-messages';
  import type { ImageSlot } from '../../lib/schemas/image-slot';
  import BilingualField from './BilingualField.svelte';
  import ImageUploader from './ImageUploader.svelte';
  import RichTextEditor from './RichTextEditor.svelte';

  const locale = 'es';
  const BLOG_COLLECTION = 'BlogPosts';
  const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const EMPTY_TIPTAP = JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] });

  interface Props {
    mode?: 'create' | 'edit';
    initialData?: BlogPostWithId | null;
    onCancel: () => void;
    onSaved: () => void;
  }

  let { mode = 'create', initialData = null, onCancel, onSaved }: Props = $props();

  // Form state
  let titleEs = $state('');
  let titleEn = $state('');
  let slug = $state('');
  let slugManuallyEdited = $state(false);
  let status = $state<'draft' | 'published'>('draft');
  let contentEs = $state(EMPTY_TIPTAP);
  let contentEn = $state(EMPTY_TIPTAP);
  let coverImageSlot = $state<ImageSlot>({ type: 'empty' });
  let coverImageProgress = $state<number | null>(null);
  let activeContentTab = $state<'es' | 'en'>('es');

  let errors = $state<Record<string, string>>({});
  let saving = $state(false);
  let hasChanges = $state(false);

  // Edit mode initialization guard
  let initializedForId = $state('');

  $effect(() => {
    if (mode === 'edit' && initialData && initializedForId !== initialData.id) {
      initializedForId = initialData.id;
      titleEs = initialData.title.es;
      titleEn = initialData.title.en;
      slug = initialData.slug;
      slugManuallyEdited = true;
      status = initialData.status;
      contentEs = initialData.content.es;
      contentEn = initialData.content.en;
      coverImageSlot = initialData.coverImage
        ? { type: 'existing', image: initialData.coverImage }
        : { type: 'empty' };
      hasChanges = false;
      errors = {};
    }
  });

  // Auto-generate slug from EN title (en = defaultLocale, slugs appear in URL without prefix)
  $effect(() => {
    if (!slugManuallyEdited) {
      slug = titleEn ? slugify(titleEn) : '';
    }
  });

  // Expose hasChanges for parent
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

  function markDirty(): void {
    hasChanges = true;
  }

  function clearError(field: string): void {
    const newErrors = { ...errors };
    delete newErrors[field];
    errors = newErrors;
  }

  function handleSlugInput(): void {
    slugManuallyEdited = true;
    markDirty();
  }

  // Slug uniqueness check
  async function isSlugUnique(slugValue: string, excludeId?: string): Promise<boolean> {
    const q = query(collection(db, BLOG_COLLECTION), where('slug', '==', slugValue), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return true;
    return excludeId ? snapshot.docs[0]!.id === excludeId : false;
  }

  function validateTitleEs(): boolean {
    if (!titleEs.trim()) {
      errors = { ...errors, titleEs: t('admin.validation.required', locale) };
      return false;
    }
    clearError('titleEs');
    return true;
  }

  function validateTitleEn(): boolean {
    if (!titleEn.trim()) {
      errors = { ...errors, titleEn: t('admin.validation.required', locale) };
      return false;
    }
    clearError('titleEn');
    return true;
  }

  function validateSlug(): boolean {
    if (!slug.trim()) {
      errors = { ...errors, slug: t('admin.validation.required', locale) };
      return false;
    }
    if (!SLUG_REGEX.test(slug.trim())) {
      errors = { ...errors, slug: t('admin.blog.slugInvalid', locale) };
      return false;
    }
    clearError('slug');
    return true;
  }

  function validateContentEs(): boolean {
    if (isTipTapContentEmpty(contentEs)) {
      errors = { ...errors, contentEs: t('admin.blog.contentRequired', locale) };
      return false;
    }
    clearError('contentEs');
    return true;
  }

  function validateContentEn(): boolean {
    if (isTipTapContentEmpty(contentEn)) {
      errors = { ...errors, contentEn: t('admin.blog.contentRequired', locale) };
      return false;
    }
    clearError('contentEn');
    return true;
  }

  function validateField(field: string): void {
    switch (field) {
      case 'titleEs': validateTitleEs(); break;
      case 'titleEn': validateTitleEn(); break;
      case 'slug': validateSlug(); break;
    }
  }

  async function validateAll(): Promise<boolean> {
    const titleEsValid = validateTitleEs();
    const titleEnValid = validateTitleEn();
    const slugValid = validateSlug();
    const contentEsValid = validateContentEs();
    const contentEnValid = validateContentEn();

    // Zod schema validation
    const result = blogPostFormSchema.safeParse({
      title: { es: titleEs.trim(), en: titleEn.trim() },
      content: { es: contentEs, en: contentEn },
      slug: slug.trim(),
      status,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = { ...errors };
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (path === 'slug' && !newErrors.slug) {
          newErrors.slug = t('admin.blog.slugInvalid', locale);
        }
      }
      errors = newErrors;
    }

    // Check slug uniqueness only if basic validation passed
    if (slugValid && slug.trim()) {
      const excludeId = mode === 'edit' && initialData ? initialData.id : undefined;
      const unique = await isSlugUnique(slug.trim(), excludeId);
      if (!unique) {
        errors = { ...errors, slug: t('admin.blog.slugInUse', locale) };
        return false;
      }
    }

    return titleEsValid && titleEnValid && slugValid && contentEsValid && contentEnValid;
  }

  async function scrollToFirstError(): Promise<void> {
    await tick();
    const firstErrorEl = document.querySelector('[role="alert"]');
    firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function handleSubmit(): Promise<void> {
    if (saving) return;

    const valid = await validateAll();
    if (!valid) {
      scrollToFirstError();
      return;
    }

    saving = true;
    try {
      const now = Timestamp.now();
      const payload: Record<string, unknown> = {
        title: { es: titleEs.trim(), en: titleEn.trim() },
        slug: slug.trim(),
        content: { es: contentEs, en: contentEn },
        status,
        images: [],
        updatedAt: now,
      };

      if (mode === 'create') {
        payload.createdAt = now;
      }

      // Create or update document
      let docId: string;
      if (mode === 'edit' && initialData) {
        docId = initialData.id;
        await updateDoc(doc(db, BLOG_COLLECTION, docId), payload);
      } else {
        const docRef = await addDoc(collection(db, BLOG_COLLECTION), payload);
        docId = docRef.id;
      }

      // Process cover image
      try {
        const processed = await processImageSlot(
          coverImageSlot,
          `blog/${docId}/`,
          (p) => { coverImageProgress = p; },
        );
        coverImageProgress = null;

        if (processed.image) {
          await updateDoc(doc(db, BLOG_COLLECTION, docId), {
            coverImage: processed.image,
          });
        }
      } catch (uploadError) {
        console.error('Cover image processing failed:', uploadError);
        // Document is already saved — image failure is non-blocking
      } finally {
        activeUploads = [];
      }

      saving = false;
      toastStore.success(t('admin.blog.saveSuccessToast', locale));
      onSaved();
    } catch (error) {
      console.error('Failed to save blog post:', error);
      toastStore.error(getFirestoreErrorMessage(error, locale));
      coverImageProgress = null;
      saving = false;
    }
  }

  function handleCancel(): void {
    onCancel();
  }
</script>

<form
  onsubmit={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
  class="max-w-[700px] space-y-6"
  novalidate
  aria-label={mode === 'edit' ? t('admin.blog.editTitle', locale) : t('admin.blog.createTitle', locale)}
>
  <!-- Title (Bilingual) -->
  <BilingualField
    label={t('admin.blog.titleLabel', locale)}
    idPrefix="blog-title"
    bind:nameEs={titleEs}
    bind:nameEn={titleEn}
    required
    errorEs={errors.titleEs ?? ''}
    errorEn={errors.titleEn ?? ''}
    onChangeEs={() => markDirty()}
    onChangeEn={() => markDirty()}
    onBlurEs={() => validateField('titleEs')}
    onBlurEn={() => validateField('titleEn')}
  />

  <!-- Slug -->
  <div>
    <label for="blog-slug" class="text-sm font-medium text-text-primary">
      {t('admin.blog.slugLabel', locale)}
      <span class="text-error" aria-hidden="true">*</span>
    </label>
    <input
      id="blog-slug"
      type="text"
      bind:value={slug}
      oninput={handleSlugInput}
      onblur={() => validateField('slug')}
      aria-required="true"
      aria-invalid={!!errors.slug}
      aria-describedby={errors.slug ? 'blog-slug-error' : undefined}
      class="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none {errors.slug ? 'border-error' : 'border-border'}"
    />
    {#if errors.slug}
      <p id="blog-slug-error" class="text-xs text-error mt-1" role="alert">
        {errors.slug}
      </p>
    {/if}
  </div>

  <!-- Cover Image -->
  <ImageUploader
    label={t('admin.blog.coverImageLabel', locale)}
    bind:slot={coverImageSlot}
    error={errors.coverImage ?? ''}
    uploadProgress={coverImageProgress}
    onChange={() => markDirty()}
  />

  <!-- Status Toggle -->
  <div>
    <label for="blog-status" class="text-sm font-medium text-text-primary">
      {t('admin.blog.statusLabel', locale)}
    </label>
    <select
      id="blog-status"
      bind:value={status}
      onchange={() => markDirty()}
      class="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
    >
      <option value="draft">{t('admin.blog.statusDraft', locale)}</option>
      <option value="published">{t('admin.blog.statusPublished', locale)}</option>
    </select>
  </div>

  <!-- Content (Bilingual RichTextEditor with tabs) -->
  <div>
    <p class="text-sm font-medium text-text-primary mb-2">
      {t('admin.blog.contentLabel', locale)}
      <span class="text-error" aria-hidden="true">*</span>
    </p>

    <!-- Tab buttons -->
    <div role="tablist" class="flex gap-1 mb-2">
      <button
        type="button"
        role="tab"
        aria-selected={activeContentTab === 'es'}
        onclick={() => { activeContentTab = 'es'; }}
        class="px-3 py-1 text-sm font-medium rounded-t-lg border border-b-0 transition-colors {activeContentTab === 'es' ? 'bg-surface text-primary border-border' : 'bg-transparent text-text-secondary border-transparent hover:text-text-primary'}"
      >ES</button>
      <button
        type="button"
        role="tab"
        aria-selected={activeContentTab === 'en'}
        onclick={() => { activeContentTab = 'en'; }}
        class="px-3 py-1 text-sm font-medium rounded-t-lg border border-b-0 transition-colors {activeContentTab === 'en' ? 'bg-surface text-primary border-border' : 'bg-transparent text-text-secondary border-transparent hover:text-text-primary'}"
      >EN</button>
    </div>

    <!-- Both editors always mounted, toggle visibility with CSS -->
    <div style:display={activeContentTab === 'es' ? 'block' : 'none'}>
      <RichTextEditor
        content={contentEs}
        onUpdate={(json) => { contentEs = json; markDirty(); }}
        label="Contenido ES"
        error={errors.contentEs ?? ''}
        id="blog-content-es"
      />
    </div>
    <div style:display={activeContentTab === 'en' ? 'block' : 'none'}>
      <RichTextEditor
        content={contentEn}
        onUpdate={(json) => { contentEn = json; markDirty(); }}
        label="Contenido EN"
        error={errors.contentEn ?? ''}
        id="blog-content-en"
      />
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
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        {t('admin.blog.form.saving', locale)}
      {:else}
        {t('admin.blog.form.save', locale)}
      {/if}
    </button>

    <button
      type="button"
      onclick={handleCancel}
      disabled={saving}
      class="px-6 py-3 rounded-lg font-semibold border border-border text-text-primary min-h-11 transition-colors hover:bg-surface disabled:opacity-50"
    >
      {t('admin.blog.form.cancel', locale)}
    </button>
  </div>
</form>
