import { z } from 'zod';

export const localeSchema = z.enum(['es', 'en']);

export const localizedString = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});

export const localizedStringArray = z.object({
  es: z.array(z.string().min(1)),
  en: z.array(z.string().min(1)),
});

export const storedImageSchema = z.object({
  url: z.url(),
  storagePath: z.string().min(1),
});

// Tipos derivados — NUNCA definir manualmente
export type Locale = z.infer<typeof localeSchema>;
export type LocalizedString = z.infer<typeof localizedString>;
export type LocalizedStringArray = z.infer<typeof localizedStringArray>;
export type StoredImage = z.infer<typeof storedImageSchema>;
