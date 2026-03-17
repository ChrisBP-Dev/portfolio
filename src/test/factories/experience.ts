import type { Experience } from '../../lib/schemas/experience-schema';

export function createExperience(overrides?: Partial<Experience>): Experience {
  return {
    id: crypto.randomUUID(),
    companyName: 'Empresa Demo',
    jobName: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },
    responsibilities: {
      es: ['Desarrollar features', 'Code review'],
      en: ['Develop features', 'Code review'],
    },
    startDate: new Date('2024-01-15'),
    endDate: null,
    ...overrides,
  };
}
