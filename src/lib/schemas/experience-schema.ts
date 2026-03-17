import { z } from 'zod';
import { localizedString, localizedStringArray } from './shared-schemas';

export const experienceSchema = z.object({
  id: z.string(),
  companyName: z.string().min(1),
  jobName: localizedString,
  responsibilities: localizedStringArray,
  startDate: z.date(),
  endDate: z.date().nullable(),
});

export type Experience = z.infer<typeof experienceSchema>;
