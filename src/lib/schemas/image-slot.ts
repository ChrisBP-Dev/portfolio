import type { StoredImage } from './shared-schemas';

export type ImageSlot =
  | { type: 'empty' }
  | { type: 'existing'; image: StoredImage }
  | { type: 'new'; file: File; preview: string }
  | { type: 'replaced'; old: StoredImage; file: File; preview: string }
  | { type: 'removed'; old: StoredImage };
