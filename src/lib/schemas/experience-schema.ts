import { z } from 'zod';
import { localizedString, localizedStringArray } from './shared-schemas';

export const experienceBaseSchema = z.object({
  id: z.string(),
  companyName: z.string().min(1),
  jobName: localizedString,
  responsibilities: localizedStringArray,
  startDate: z.date(),
  endDate: z.date().nullable(),
});

export const experienceSchema = experienceBaseSchema.refine(
  (data) => data.endDate === null || data.endDate >= data.startDate,
  { message: 'endDate must be >= startDate', path: ['endDate'] },
);

export type Experience = z.infer<typeof experienceSchema>;

/** For Firestore doc.data() parsing — no id, dates as Date objects */
export const experienceFirestoreSchema = experienceBaseSchema.omit({ id: true });

/** For form validation — all fields except id, with date range refinement */
export const experienceFormSchema = experienceBaseSchema
  .omit({ id: true })
  .refine(
    (data) => data.endDate === null || data.endDate >= data.startDate,
    { message: 'endDate must be >= startDate', path: ['endDate'] },
  );

export type ExperienceFirestoreData = z.infer<typeof experienceFirestoreSchema>;
export type ExperienceWithId = ExperienceFirestoreData & { id: string };
