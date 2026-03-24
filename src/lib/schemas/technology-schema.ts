import { z } from 'zod';
import { storedImageSchema } from './shared-schemas';

export const technologySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  image: storedImageSchema,
  experienceYears: z.number().int().nonnegative(),
  order: z.number().int().nonnegative().default(0),
});

export type Technology = z.infer<typeof technologySchema>;

/** For parsing Firestore doc.data() — id comes from doc.id */
export const technologyFirestoreSchema = technologySchema.omit({ id: true });

/** For form validation — excludes id and image (handled by ImageSlot) */
export const technologyFormSchema = technologySchema.omit({
  id: true,
  image: true,
  order: true,
});

export type TechnologyFirestoreData = z.infer<typeof technologyFirestoreSchema>;
export type TechnologyWithId = TechnologyFirestoreData & { id: string };
