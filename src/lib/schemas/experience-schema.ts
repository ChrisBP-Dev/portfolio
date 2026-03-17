import { z } from 'zod';
import { localizedString, localizedStringArray } from './shared-schemas';

const experienceBaseSchema = z.object({
  id: z.string(),
  companyName: z.string().min(1),
  jobName: localizedString,
  responsibilities: localizedStringArray,
  startDate: z.date(),
  endDate: z.date().nullable(),
});

export const experienceSchema = experienceBaseSchema.refine(
  (data) => data.endDate === null || data.endDate >= data.startDate,
  { message: 'endDate must be >= startDate' },
);

export type Experience = z.infer<typeof experienceSchema>;
