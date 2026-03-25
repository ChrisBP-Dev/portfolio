const OG_DEFAULT_PATH = '/images/og-default.png';

export function resolveOgImage(ogImage: string | undefined, siteUrl: URL): string {
  if (ogImage) return ogImage;
  return new URL(OG_DEFAULT_PATH, siteUrl).href;
}

// --- JSON-LD Structured Data ---

export interface PersonJsonLd {
  [key: string]: unknown;
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle: string;
  url: string;
  sameAs: string[];
  image?: string;
}

export function generatePersonJsonLd(siteUrl: string): PersonJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Christopher Bobadilla',
    jobTitle: 'Mobile & Web Developer',
    url: siteUrl,
    sameAs: [
      'https://github.com/ChrisBP-Dev',
      'https://www.linkedin.com/in/christopher-bobadilla',
      'https://www.tiktok.com/@chrisbp_dev',
    ],
  };
}

export interface CreativeWorkJsonLd {
  [key: string]: unknown;
  '@context': 'https://schema.org';
  '@type': 'CreativeWork';
  name: string;
  description: string;
  image?: string;
  url: string;
  author: { '@type': 'Person'; name: string };
  keywords?: string;
}

export function generateCreativeWorkJsonLd(params: {
  name: string;
  description: string;
  imageUrl?: string | undefined;
  pageUrl: string;
  technologies: string[];
}): CreativeWorkJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: params.name,
    description: params.description,
    ...(params.imageUrl && { image: params.imageUrl }),
    url: params.pageUrl,
    author: { '@type': 'Person', name: 'Christopher Bobadilla' },
    ...(params.technologies.length > 0 && { keywords: params.technologies.join(', ') }),
  };
}

export interface BlogPostingJsonLd {
  [key: string]: unknown;
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: { '@type': 'Person'; name: string; url: string };
  image?: string;
  url: string;
}

export function generateBlogPostingJsonLd(params: {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  coverImageUrl?: string | undefined;
  pageUrl: string;
  siteUrl: string;
}): BlogPostingJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: params.title,
    description: params.description,
    datePublished: params.createdAt.toISOString(),
    dateModified: params.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Christopher Bobadilla',
      url: params.siteUrl,
    },
    ...(params.coverImageUrl && { image: params.coverImageUrl }),
    url: params.pageUrl,
  };
}
