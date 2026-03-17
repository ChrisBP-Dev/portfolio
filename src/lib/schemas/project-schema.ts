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
  technologies: z.array(z.string()),
  slug: z.string().min(1),
});

export type Project = z.infer<typeof projectSchema>;
