import type { Experience } from './types';

export function createExperience(overrides?: Partial<Experience>): Experience {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    company: { es: 'Empresa Tech', en: 'Tech Company' },
    position: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },
    description: {
      es: 'Desarrollo de aplicaciones web con tecnologías modernas.',
      en: 'Web application development with modern technologies.',
    },
    startDate: new Date(now.getFullYear() - 2, 0, 15),
    endDate: null,
    current: true,
    technologies: ['typescript', 'svelte', 'firebase'],
    order: 0,
    ...overrides,
  };
}
