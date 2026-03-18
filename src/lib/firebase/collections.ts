import { projectSchema } from '../schemas/project-schema';
import type { Project } from '../schemas/project-schema';
import { technologySchema } from '../schemas/technology-schema';
import type { Technology } from '../schemas/technology-schema';
import { experienceSchema } from '../schemas/experience-schema';
import type { Experience } from '../schemas/experience-schema';
import { blogPostSchema } from '../schemas/blog-post-schema';
import type { BlogPost } from '../schemas/blog-post-schema';

export const COLLECTION_PATHS = {
  projects: 'Projects',
  technologies: 'Technologies',
  experiences: 'Experiences',
  blogPosts: 'BlogPosts',
} as const;

function toDate(val: unknown): Date {
  if (val instanceof Date) return val;
  if (
    val != null &&
    typeof val === 'object' &&
    'toDate' in val &&
    typeof (val as { toDate: unknown }).toDate === 'function'
  ) {
    return (val as { toDate: () => Date }).toDate();
  }
  if (typeof val === 'string') return new Date(val);
  if (typeof val === 'number') return new Date(val);
  throw new Error(`Cannot convert to Date: ${String(val)}`);
}

export function parseProject(data: Record<string, unknown>, id: string): Project {
  return projectSchema.parse({ ...data, id });
}

export function parseTechnology(data: Record<string, unknown>, id: string): Technology {
  return technologySchema.parse({ ...data, id });
}

export function parseExperience(data: Record<string, unknown>, id: string): Experience {
  return experienceSchema.parse({
    ...data,
    id,
    startDate: toDate(data.startDate),
    endDate: data.endDate != null ? toDate(data.endDate) : null,
  });
}

export function parseBlogPost(data: Record<string, unknown>, id: string): BlogPost {
  return blogPostSchema.parse({
    ...data,
    id,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  });
}
