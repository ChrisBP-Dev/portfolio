import type { Firestore } from 'firebase-admin/firestore';
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
  if (val == null)
    throw new Error(
      `toDate: received ${val === undefined ? 'undefined' : 'null'} — required date field is missing from document data`,
    );
  if (val instanceof Date) {
    if (isNaN(val.getTime())) throw new Error('toDate: received an invalid Date object');
    return val;
  }
  if (
    val != null &&
    typeof val === 'object' &&
    'toDate' in val &&
    typeof (val as { toDate: unknown }).toDate === 'function'
  ) {
    return (val as { toDate: () => Date }).toDate();
  }
  if (typeof val === 'string') {
    const d = new Date(val);
    if (isNaN(d.getTime())) throw new Error(`toDate: cannot parse date string "${val}"`);
    return d;
  }
  if (typeof val === 'number') {
    if (!isFinite(val)) throw new Error(`toDate: cannot convert non-finite number ${val} to Date`);
    return new Date(val);
  }
  throw new Error(`toDate: cannot convert value to Date: ${String(val)}`);
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

export async function getAllTechnologies(db: Firestore): Promise<Technology[]> {
  const snapshot = await db.collection(COLLECTION_PATHS.technologies).orderBy('name').get();
  return snapshot.docs.map((doc) => parseTechnology(doc.data() as Record<string, unknown>, doc.id));
}

export async function getAllProjects(db: Firestore): Promise<Project[]> {
  const snapshot = await db.collection(COLLECTION_PATHS.projects).get();
  const projects = snapshot.docs.map((doc) => parseProject(doc.data() as Record<string, unknown>, doc.id));
  return projects.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

export async function getPublishedBlogPosts(db: Firestore): Promise<BlogPost[]> {
  const snapshot = await db
    .collection(COLLECTION_PATHS.blogPosts)
    .where('status', '==', 'published')
    .orderBy('createdAt', 'desc')
    .get();
  return snapshot.docs.map((doc) => parseBlogPost(doc.data() as Record<string, unknown>, doc.id));
}

export async function getAllExperiences(db: Firestore): Promise<Experience[]> {
  const snapshot = await db
    .collection(COLLECTION_PATHS.experiences)
    .orderBy('startDate', 'desc')
    .get();
  return snapshot.docs.map((doc) =>
    parseExperience(doc.data() as Record<string, unknown>, doc.id),
  );
}
