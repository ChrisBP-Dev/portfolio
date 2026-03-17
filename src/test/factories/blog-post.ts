import type { BlogPost } from '../../lib/schemas/blog-post-schema';

export function createBlogPost(overrides?: Partial<BlogPost>): BlogPost {
  return {
    id: crypto.randomUUID(),
    title: { es: 'Post de ejemplo', en: 'Example post' },
    content: { es: '<p>Contenido del blog</p>', en: '<p>Blog content</p>' },
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
