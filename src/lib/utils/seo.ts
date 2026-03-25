const OG_DEFAULT_PATH = '/images/og-default.png';

export function resolveOgImage(ogImage: string | undefined, siteUrl: URL): string {
  if (ogImage) return ogImage;
  return new URL(OG_DEFAULT_PATH, siteUrl).href;
}
