import { z } from 'zod';
import { localizedString, localizedStringArray, storedImageSchema } from './shared-schemas';

export const projectSchema = z.object({
  id: z.string(),
  companyName: localizedString,
  shortDescription: localizedString,
  features: localizedStringArray,
  mainImage: storedImageSchema,
  screenshots: z.array(storedImageSchema),
  websiteUrl: z.url().optional(),
  sourceCodeUrl: z.url().optional(),
  technologies: z.array(z.string().min(1)),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  order: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
});

export type Project = z.infer<typeof projectSchema>;

/** For parsing Firestore doc.data() — id comes from doc.id, images may be missing on orphaned docs */
export const projectFirestoreSchema = projectSchema.omit({ id: true }).extend({
  mainImage: storedImageSchema.optional(),
  screenshots: z.array(storedImageSchema).optional(),
});

export type ProjectFirestoreData = z.infer<typeof projectFirestoreSchema>;

export type ProjectWithId = ProjectFirestoreData & { id: string };

/** For form validation before submit — excludes id, image fields, and order (managed by list drag-drop) */
export const projectFormSchema = projectSchema.omit({
  id: true,
  mainImage: true,
  screenshots: true,
  order: true,
  featured: true,
});
