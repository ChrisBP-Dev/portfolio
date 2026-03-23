import type { BlogPost } from '../../lib/schemas/blog-post-schema';

const TIPTAP_CONTENT_ES = JSON.stringify({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Contenido del blog' }] }],
});

const TIPTAP_CONTENT_EN = JSON.stringify({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Blog content' }] }],
});

export function createBlogPost(overrides?: Partial<BlogPost>): BlogPost {
  return {
    id: crypto.randomUUID(),
    title: { es: 'Post de ejemplo', en: 'Example post' },
    content: { es: TIPTAP_CONTENT_ES, en: TIPTAP_CONTENT_EN },
    slug: 'post-de-ejemplo',
    coverImage: {
      url: 'https://example.com/images/blog-cover.webp',
      storagePath: 'blog/post-de-ejemplo/cover.webp',
    },
    images: [],
    status: 'published',
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-14'),
    ...overrides,
  };
}
