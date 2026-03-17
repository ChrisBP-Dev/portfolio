import { z } from 'zod';
import { localizedString, storedImageSchema } from './shared-schemas';

const blogPostBaseSchema = z.object({
  id: z.string(),
  title: localizedString,
  content: localizedString,
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  coverImage: storedImageSchema,
  images: z.array(storedImageSchema),
  status: z.enum(['published', 'draft']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const blogPostSchema = blogPostBaseSchema.refine(
  (data) => data.updatedAt >= data.createdAt,
  { message: 'updatedAt must be >= createdAt' },
);

export type BlogPost = z.infer<typeof blogPostSchema>;
