<script lang="ts">
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Image from '@tiptap/extension-image';
  import Link from '@tiptap/extension-link';
  import { createSubscriber } from 'svelte/reactivity';
  import { untrack } from 'svelte';
  import { t } from '../../lib/i18n/translations';

  const locale = 'es';

  interface Props {
    content: string;
    onUpdate: (json: string) => void;
    label: string;
    error?: string;
    id?: string;
  }

  let { content, onUpdate, label, error = '', id = '' }: Props = $props();

  let element: HTMLDivElement | undefined = $state(undefined);
  let editorInstance: Editor | undefined;
  let initError = $state(false);

  // Bridge TipTap transactions → Svelte reactivity
  const subscribe = createSubscriber((update) => {
    editorInstance?.on('transaction', update);
    return () => editorInstance?.off('transaction', update);
  });

  function getEditor(): Editor | undefined {
    subscribe();
    return editorInstance;
  }

  // Only track `element` — read content/onUpdate without creating dependencies
  // to prevent the editor from being destroyed/recreated on every keystroke
  $effect(() => {
    if (!element) return;

    const initialContentStr = untrack(() => content);
    const updateCallback = untrack(() => onUpdate);

    try {
      let initialContent: Record<string, unknown> = { type: 'doc', content: [] };
      try {
        if (initialContentStr) {
          initialContent = JSON.parse(initialContentStr);
        }
      } catch {
        // Invalid JSON — start with empty doc
      }

      editorInstance = new Editor({
        element,
        extensions: [
          StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
          Image,
          Link.configure({ openOnClick: false, protocols: ['http', 'https', 'mailto'] }),
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
          updateCallback(JSON.stringify(editor.getJSON()));
        },
      });
    } catch (e) {
      console.error('TipTap initialization failed:', e);
      initError = true;
    }
    return () => editorInstance?.destroy();
  });

  function toggleHeading(level: 1 | 2 | 3): void {
    getEditor()?.chain().focus().toggleHeading({ level }).run();
  }

  function toggleBold(): void {
    getEditor()?.chain().focus().toggleBold().run();
  }

  function toggleCodeBlock(): void {
    getEditor()?.chain().focus().toggleCodeBlock().run();
  }

  function toggleBulletList(): void {
    getEditor()?.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList(): void {
    getEditor()?.chain().focus().toggleOrderedList().run();
  }

  function setLink(): void {
    const editor = getEditor();
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', previousUrl ?? '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  function insertImage(): void {
    const editor = getEditor();
    if (!editor) return;
    const url = window.prompt('URL de imagen');
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  let editor = $derived(getEditor());
</script>

{#if initError}
  <div
    class="rounded-lg border border-error/30 bg-error/5 p-6 text-center"
    aria-live="assertive"
  >
    <p class="text-error text-sm">{t('admin.blog.editorUnavailable', locale)}</p>
  </div>
{:else}
  <div>
    {#if id}
      <div id="{id}-label" class="sr-only">{label}</div>
    {/if}

    <!-- Toolbar -->
    <div
      role="toolbar"
      aria-label={label}
      class="flex flex-wrap gap-1 border border-border rounded-t-lg bg-surface px-2 py-1.5"
    >
      <button
        type="button"
        onclick={() => toggleHeading(1)}
        class="px-2 py-1 text-xs font-semibold rounded transition-colors {editor?.isActive('heading', { level: 1 }) ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-hover'}"
        aria-pressed={editor?.isActive('heading', { level: 1 }) ?? false}
        title="H1"
      >H1</button>

      <button
        type="button"
        onclick={() => toggleHeading(2)}
        class="px-2 py-1 text-xs font-semibold rounded transition-colors {editor?.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-hover'}"
        aria-pressed={editor?.isActive('heading', { level: 2 }) ?? false}
        title="H2"
      >H2</button>

      <button
        type="button"
        onclick={() => toggleHeading(3)}
        class="px-2 py-1 text-xs font-semibold rounded transition-colors {editor?.isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-hover'}"
        aria-pressed={editor?.isActive('heading', { level: 3 }) ?? false}
        title="H3"
      >H3</button>

      <div class="w-px h-6 bg-border self-center mx-1" aria-hidden="true"></div>

      <button
        type="button"
        onclick={toggleBold}
        class="px-2 py-1 text-xs font-bold rounded transition-colors {editor?.isActive('bold') ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-hover'}"
        aria-pressed={editor?.isActive('bold') ?? false}
        title="Bold"
      >B</button>

      <button
        type="button"
        onclick={toggleCodeBlock}
        class="px-2 py-1 text-xs font-mono rounded transition-colors {editor?.isActive('codeBlock') ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-hover'}"
        aria-pressed={editor?.isActive('codeBlock') ?? false}
        title="Code block"
      >&lt;/&gt;</button>

      <div class="w-px h-6 bg-border self-center mx-1" aria-hidden="true"></div>

      <button
        type="button"
        onclick={setLink}
        class="px-2 py-1 text-xs rounded transition-colors {editor?.isActive('link') ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-hover'}"
        aria-pressed={editor?.isActive('link') ?? false}
        title="Link"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      </button>

      <button
        type="button"
        onclick={insertImage}
        class="px-2 py-1 text-xs rounded transition-colors text-text-secondary hover:bg-surface-hover"
        title="Image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      </button>

      <div class="w-px h-6 bg-border self-center mx-1" aria-hidden="true"></div>

      <button
        type="button"
        onclick={toggleBulletList}
        class="px-2 py-1 text-xs rounded transition-colors {editor?.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-hover'}"
        aria-pressed={editor?.isActive('bulletList') ?? false}
        title="Bullet list"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      </button>

      <button
        type="button"
        onclick={toggleOrderedList}
        class="px-2 py-1 text-xs rounded transition-colors {editor?.isActive('orderedList') ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface-hover'}"
        aria-pressed={editor?.isActive('orderedList') ?? false}
        title="Ordered list"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
      </button>
    </div>

    <!-- Editor content area -->
    <div
      bind:this={element}
      aria-label={label}
      aria-describedby={error ? `${id}-error` : undefined}
      class="border border-t-0 border-border rounded-b-lg min-h-[300px] px-4 py-3 bg-surface text-text-primary focus-within:ring-2 focus-within:ring-primary focus-within:border-primary prose prose-sm dark:prose-invert max-w-none
        [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[280px]
        [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-4 [&_.ProseMirror_h1]:mb-2
        [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:mb-2
        [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-3 [&_.ProseMirror_h3]:mb-1
        [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6
        [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6
        [&_.ProseMirror_pre]:bg-[var(--color-surface-hover)] [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:font-mono [&_.ProseMirror_pre]:text-sm
        [&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline
        [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:my-4
        {error ? 'border-error' : ''}"
    ></div>

    {#if error}
      <p id="{id}-error" class="text-xs text-error mt-1" role="alert">{error}</p>
    {/if}
  </div>
{/if}
