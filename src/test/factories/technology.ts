import type { Technology } from './types';

export function createTechnology(overrides?: Partial<Technology>): Technology {
  return {
    id: crypto.randomUUID(),
    name: 'Astro',
    icon: 'astro-icon',
    category: 'framework',
    order: 0,
    ...overrides,
  };
}
