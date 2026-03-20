import { z } from 'zod';
import { storedImageSchema } from './shared-schemas';

export const technologySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  image: storedImageSchema,
  experienceYears: z.number().int().nonnegative(),
});

export type Technology = z.infer<typeof technologySchema>;

/** For parsing Firestore doc.data() — id comes from doc.id */
export const technologyFirestoreSchema = technologySchema.omit({ id: true });
