import type { Technology } from '../../lib/schemas/technology-schema';

export function createTechnology(overrides?: Partial<Technology>): Technology {
  return {
    id: crypto.randomUUID(),
    name: 'Astro',
    image: {
      url: 'https://example.com/images/astro-logo.webp',
      storagePath: 'technologies/astro/logo.webp',
    },
    experienceYears: 3,
    order: 0,
    ...overrides,
  };
}
