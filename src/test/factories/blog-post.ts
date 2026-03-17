import type { BlogPost } from './types';

export function createBlogPost(overrides?: Partial<BlogPost>): BlogPost {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    title: {
      es: 'Mi primer artículo sobre desarrollo web',
      en: 'My first article about web development',
    },
    slug: 'mi-primer-articulo',
    content: {
      es: 'Contenido del artículo en español con detalles técnicos.',
      en: 'Article content in English with technical details.',
    },
    excerpt: {
      es: 'Un resumen breve del artículo.',
      en: 'A brief summary of the article.',
    },
    coverImage: {
      url: 'https://example.com/images/blog-cover.webp',
      path: 'blog/mi-primer-articulo/cover.webp',
      alt: { es: 'Portada del artículo', en: 'Article cover' },
    },
    tags: ['web', 'desarrollo', 'tutorial'],
    published: true,
    publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    ...overrides,
  };
}
