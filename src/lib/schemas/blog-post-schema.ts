import { z } from 'zod';
import { localizedString, storedImageSchema } from './shared-schemas';

const blogPostBaseSchema = z.object({
  id: z.string(),
  title: localizedString,
  content: localizedString,
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  coverImage: storedImageSchema.optional(),
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

/** For Firestore doc.data() parsing — no id, images defaults to [] */
export const blogPostFirestoreSchema = blogPostBaseSchema.omit({ id: true }).extend({
  images: z.array(storedImageSchema).default([]),
});

/** For form validation — only fields the form controls */
export const blogPostFormSchema = z.object({
  title: localizedString,
  content: localizedString,
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(['published', 'draft']),
});

export type BlogPostFirestore = z.infer<typeof blogPostFirestoreSchema>;
export type BlogPostForm = z.infer<typeof blogPostFormSchema>;
export type BlogPostWithId = BlogPostFirestore & { id: string };
