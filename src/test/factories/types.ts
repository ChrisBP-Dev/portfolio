export interface LocalizedField {
  es: string;
  en: string;
}

export interface StoredImage {
  url: string;
  path: string;
  alt: LocalizedField;
}

export interface ImageSlot {
  current: StoredImage | null;
  slot: string;
}

export interface Project {
  id: string;
  title: LocalizedField;
  description: LocalizedField;
  shortDescription: LocalizedField;
  technologies: string[];
  imageSlots: ImageSlot[];
  links: { github?: string; live?: string };
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Technology {
  id: string;
  name: string;
  icon: string;
  category: string;
  order: number;
}

export interface Experience {
  id: string;
  company: LocalizedField;
  position: LocalizedField;
  description: LocalizedField;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  technologies: string[];
  order: number;
}

export interface BlogPost {
  id: string;
  title: LocalizedField;
  slug: string;
  content: LocalizedField;
  excerpt: LocalizedField;
  coverImage: StoredImage | null;
  tags: string[];
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
