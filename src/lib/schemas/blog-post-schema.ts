import { z } from 'zod';
import { localizedString, storedImageSchema } from './shared-schemas';

export const blogPostSchema = z.object({
  id: z.string(),
  title: localizedString,
  content: localizedString,
  slug: z.string().min(1),
  coverImage: storedImageSchema,
  images: z.array(storedImageSchema),
  status: z.enum(['published', 'draft']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;
