import type { Project } from '../../lib/schemas/project-schema';

export function createProject(overrides?: Partial<Project>): Project {
  return {
    id: crypto.randomUUID(),
    companyName: { es: 'Empresa Demo', en: 'Demo Company' },
    shortDescription: { es: 'App web moderna', en: 'Modern web app' },
    features: { es: ['Feature principal'], en: ['Main feature'] },
    mainImage: {
      url: 'https://example.com/images/project-hero.webp',
      storagePath: 'projects/demo/main-image.webp',
    },
    screenshots: [],
    websiteUrl: undefined,
    sourceCodeUrl: undefined,
    technologies: ['astro', 'svelte'],
    slug: 'proyecto-demo',
    order: 0,
    featured: false,
    ...overrides,
  };
}
