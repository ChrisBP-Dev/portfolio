import type { Project } from './types';

export function createProject(overrides?: Partial<Project>): Project {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    title: { es: 'Proyecto Demo', en: 'Demo Project' },
    description: {
      es: 'Una aplicación web moderna construida con tecnologías actuales.',
      en: 'A modern web application built with current technologies.',
    },
    shortDescription: {
      es: 'App web moderna',
      en: 'Modern web app',
    },
    technologies: ['astro', 'svelte', 'tailwindcss'],
    imageSlots: [
      {
        slot: 'hero',
        current: {
          url: 'https://example.com/images/project-hero.webp',
          path: 'projects/demo/hero.webp',
          alt: { es: 'Captura del proyecto', en: 'Project screenshot' },
        },
      },
    ],
    links: { github: 'https://github.com/user/demo', live: 'https://demo.example.com' },
    featured: false,
    order: 0,
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: now,
    ...overrides,
  };
}
