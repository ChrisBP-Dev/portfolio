import { z } from 'zod';

export const storedResumeSchema = z.object({
  url: z.url(),
  storagePath: z.string().min(1),
  fileName: z.string().min(1),
  uploadedAt: z.date(),
});

// Tipos derivados — NUNCA definir manualmente
export type StoredResume = z.infer<typeof storedResumeSchema>;

export function parseStoredResume(data: Record<string, unknown>): StoredResume {
  return storedResumeSchema.parse({
    ...data,
    uploadedAt: toDate(data.uploadedAt),
  });
}

function toDate(val: unknown): Date {
  if (val instanceof Date) return val;
  if (
    val != null &&
    typeof val === 'object' &&
    'toDate' in val &&
    typeof (val as { toDate: unknown }).toDate === 'function'
  ) {
    return (val as { toDate: () => Date }).toDate();
  }
  if (typeof val === 'string') return new Date(val);
  if (typeof val === 'number') return new Date(val);
  throw new Error(`Cannot convert value to Date: ${String(val)}`);
}
