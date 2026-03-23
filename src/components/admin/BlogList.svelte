<script lang="ts">
  import { collection, getDocs, query, orderBy } from 'firebase/firestore';
  import { db } from '../../lib/firebase/client';
  import { blogPostFirestoreSchema } from '../../lib/schemas/blog-post-schema';
  import type { BlogPostWithId } from '../../lib/schemas/blog-post-schema';
  import { t } from '../../lib/i18n/translations';

  const locale = 'es';
  const BLOG_COLLECTION = 'BlogPosts';

  interface Props {
    onCreateNew: () => void;
    onEdit?: (post: BlogPostWithId) => void;
    onDelete?: (post: BlogPostWithId) => void;
  }

  let { onCreateNew, onEdit, onDelete }: Props = $props();

  let posts = $state<BlogPostWithId[]>([]);
  let loading = $state(true);
  let error = $state(false);

  const dateFormatter = new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  function formatDate(date: Date): string {
    return dateFormatter.format(date);
  }

  $effect(() => {
    loadPosts();
  });

  export async function loadPosts(): Promise<void> {
    loading = true;
    error = false;
    try {
      const q = query(collection(db, BLOG_COLLECTION), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      posts = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          const converted = {
            ...data,
            createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
          };
          const result = blogPostFirestoreSchema.safeParse(converted);
          if (!result.success) return null;
          return { ...result.data, id: docSnap.id };
        })
        .filter((p): p is BlogPostWithId => p !== null);
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
      {t('admin.blog.title', locale)}
    </h1>
    <button
      type="button"
      onclick={onCreateNew}
      class="px-4 py-2 rounded-lg font-semibold text-white [background:var(--brand-gradient)] min-h-11 transition-opacity hover:opacity-90"
    >
      {t('admin.blog.createNew', locale)}
    </button>
  </div>

  {#if loading}
    <div class="space-y-3" aria-busy="true" aria-label={t('admin.blog.loading', locale)}>
      {#each Array(4) as _, i (i)}
        <div class="bg-surface border border-border rounded-lg p-4 motion-safe:animate-pulse">
          <div class="flex items-center justify-between">
            <div class="flex-1 space-y-2">
              <div class="w-48 h-4 bg-border rounded"></div>
              <div class="w-32 h-3 bg-border rounded"></div>
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
      <p class="text-red-700 dark:text-red-300 mb-3">{t('admin.blog.errorLoading', locale)}</p>
      <button
        type="button"
        onclick={loadPosts}
        class="text-sm font-semibold text-primary hover:underline"
      >
        {t('admin.blog.retryLoad', locale)}
      </button>
    </div>
  {:else if posts.length === 0}
    <div class="bg-surface border border-border rounded-lg p-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-text-muted" aria-hidden="true">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
      <p class="text-text-secondary mb-2">{t('admin.blog.emptyState', locale)}</p>
      <button
        type="button"
        onclick={onCreateNew}
        class="text-primary font-semibold hover:underline"
      >
        {t('admin.blog.emptyStateCta', locale)}
      </button>
    </div>
  {:else}
    <div class="space-y-3">
      {#each posts as post (post.id)}
        <div class="bg-surface border border-border rounded-lg p-4 transition-colors hover:border-primary/30">
          <div class="flex items-center justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-text-primary truncate">
                  {post.title.es}
                </h3>
                {#if post.status === 'published'}
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    aria-label={t('admin.blog.statusPublished', locale)}
                  >
                    {t('admin.blog.statusPublished', locale)}
                  </span>
                {:else}
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                    aria-label={t('admin.blog.statusDraft', locale)}
                  >
                    {t('admin.blog.statusDraft', locale)}
                  </span>
                {/if}
              </div>
              <p class="text-sm text-text-secondary">
                {formatDate(post.createdAt)}
              </p>
            </div>

            <div class="flex gap-2 shrink-0">
              <button
                type="button"
                onclick={() => onEdit?.(post)}
                class="px-3 py-1.5 text-sm rounded-lg border border-border text-text-secondary hover:border-primary/30 hover:text-primary transition-colors"
              >
                {t('admin.blog.edit', locale)}
              </button>
              <button
                type="button"
                onclick={() => onDelete?.(post)}
                class="px-3 py-1.5 text-sm rounded-lg border border-error/30 text-error hover:bg-error/10 hover:border-error transition-colors"
              >
                {t('admin.blog.delete', locale)}
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
