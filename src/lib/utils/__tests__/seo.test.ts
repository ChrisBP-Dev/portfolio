import { describe, it, expect } from 'vitest';
import { resolveOgImage } from '../seo';

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

  it('returns default OG image URL when ogImage is not provided', () => {
    expect(resolveOgImage(undefined, siteUrl)).toBe(
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
