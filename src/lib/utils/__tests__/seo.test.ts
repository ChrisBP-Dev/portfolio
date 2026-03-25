import { describe, it, expect } from 'vitest';
import {
  resolveOgImage,
  generatePersonJsonLd,
  generateCreativeWorkJsonLd,
  generateBlogPostingJsonLd,
} from '../seo';

describe('resolveOgImage', () => {
  const siteUrl = new URL('https://portfolio-chrisbp.web.app');

  it('returns the provided ogImage when present', () => {
    const customImage = 'https://firebasestorage.googleapis.com/v0/b/portfolio-chrisbp/image.png';
    expect(resolveOgImage(customImage, siteUrl)).toBe(customImage);
  });

  it('returns default OG image URL when ogImage is undefined', () => {
    expect(resolveOgImage(undefined, siteUrl)).toBe(
      'https://portfolio-chrisbp.web.app/images/og-default.png',
    );
  });

  it('falls back to default when ogImage is empty string', () => {
    expect(resolveOgImage('', siteUrl)).toBe(
      'https://portfolio-chrisbp.web.app/images/og-default.png',
    );
  });

  it('constructs absolute URL using provided siteUrl', () => {
    const customSite = new URL('https://example.com');
    expect(resolveOgImage(undefined, customSite)).toBe(
      'https://example.com/images/og-default.png',
    );
  });

  it('returns ogImage as-is without modifying it', () => {
    const externalImage = 'https://cdn.example.com/my-image.jpg';
    expect(resolveOgImage(externalImage, siteUrl)).toBe(externalImage);
  });
});

describe('generatePersonJsonLd', () => {
  const siteUrl = 'https://portfolio-chrisbp.web.app/';

  it('returns correct @context and @type', () => {
    const result = generatePersonJsonLd(siteUrl);
    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('Person');
  });

  it('returns correct name and jobTitle', () => {
    const result = generatePersonJsonLd(siteUrl);
    expect(result.name).toBe('Christopher Bobadilla');
    expect(result.jobTitle).toBe('Mobile & Web Developer');
  });

  it('uses the provided siteUrl as url field', () => {
    const result = generatePersonJsonLd(siteUrl);
    expect(result.url).toBe(siteUrl);
  });

  it('includes 3 social links in sameAs array', () => {
    const result = generatePersonJsonLd(siteUrl);
    expect(result.sameAs).toHaveLength(3);
    expect(result.sameAs).toContain('https://github.com/ChrisBP-Dev');
    expect(result.sameAs).toContain('https://www.linkedin.com/in/christopher-bobadilla');
    expect(result.sameAs).toContain('https://www.tiktok.com/@chrisbp_dev');
  });

  it('does not include image field by default', () => {
    const result = generatePersonJsonLd(siteUrl);
    expect(result.image).toBeUndefined();
  });
});

describe('generateCreativeWorkJsonLd', () => {
  const baseParams = {
    name: 'Test Project',
    description: 'A great project',
    imageUrl: 'https://example.com/image.png',
    pageUrl: 'https://portfolio-chrisbp.web.app/projects/test-project/',
    technologies: ['Flutter', 'Firebase', 'Dart'],
  };

  it('returns correct @context and @type', () => {
    const result = generateCreativeWorkJsonLd(baseParams);
    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('CreativeWork');
  });

  it('maps name and description from params', () => {
    const result = generateCreativeWorkJsonLd(baseParams);
    expect(result.name).toBe('Test Project');
    expect(result.description).toBe('A great project');
  });

  it('includes image when imageUrl is provided', () => {
    const result = generateCreativeWorkJsonLd(baseParams);
    expect(result.image).toBe('https://example.com/image.png');
  });

  it('omits image when imageUrl is undefined', () => {
    const result = generateCreativeWorkJsonLd({ ...baseParams, imageUrl: undefined });
    expect(result.image).toBeUndefined();
  });

  it('sets correct url from pageUrl', () => {
    const result = generateCreativeWorkJsonLd(baseParams);
    expect(result.url).toBe('https://portfolio-chrisbp.web.app/projects/test-project/');
  });

  it('sets author name to Christopher Bobadilla', () => {
    const result = generateCreativeWorkJsonLd(baseParams);
    expect(result.author).toEqual({ '@type': 'Person', name: 'Christopher Bobadilla' });
  });

  it('joins technologies as comma-separated keywords', () => {
    const result = generateCreativeWorkJsonLd(baseParams);
    expect(result.keywords).toBe('Flutter, Firebase, Dart');
  });

  it('omits keywords when technologies array is empty', () => {
    const result = generateCreativeWorkJsonLd({ ...baseParams, technologies: [] });
    expect(result.keywords).toBeUndefined();
  });
});

describe('generateBlogPostingJsonLd', () => {
  const baseParams = {
    title: 'My Blog Post',
    description: 'A summary of the post',
    createdAt: new Date('2026-01-15T10:00:00Z'),
    updatedAt: new Date('2026-02-20T14:30:00Z'),
    coverImageUrl: 'https://example.com/cover.jpg',
    pageUrl: 'https://portfolio-chrisbp.web.app/blog/my-blog-post/',
    siteUrl: 'https://portfolio-chrisbp.web.app/',
  };

  it('returns correct @context and @type', () => {
    const result = generateBlogPostingJsonLd(baseParams);
    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('BlogPosting');
  });

  it('maps headline from title', () => {
    const result = generateBlogPostingJsonLd(baseParams);
    expect(result.headline).toBe('My Blog Post');
  });

  it('maps description from params', () => {
    const result = generateBlogPostingJsonLd(baseParams);
    expect(result.description).toBe('A summary of the post');
  });

  it('formats datePublished and dateModified as ISO strings', () => {
    const result = generateBlogPostingJsonLd(baseParams);
    expect(result.datePublished).toBe('2026-01-15T10:00:00.000Z');
    expect(result.dateModified).toBe('2026-02-20T14:30:00.000Z');
  });

  it('sets author with name and url', () => {
    const result = generateBlogPostingJsonLd(baseParams);
    expect(result.author).toEqual({
      '@type': 'Person',
      name: 'Christopher Bobadilla',
      url: 'https://portfolio-chrisbp.web.app/',
    });
  });

  it('includes image when coverImageUrl is provided', () => {
    const result = generateBlogPostingJsonLd(baseParams);
    expect(result.image).toBe('https://example.com/cover.jpg');
  });

  it('omits image when coverImageUrl is undefined', () => {
    const result = generateBlogPostingJsonLd({ ...baseParams, coverImageUrl: undefined });
    expect(result.image).toBeUndefined();
  });

  it('sets correct url from pageUrl', () => {
    const result = generateBlogPostingJsonLd(baseParams);
    expect(result.url).toBe('https://portfolio-chrisbp.web.app/blog/my-blog-post/');
  });
});
