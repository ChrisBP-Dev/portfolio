import sanitizeHtml from 'sanitize-html';

export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'p',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'a',
      'img',
      'strong',
      'em',
      's',
      'br',
      'hr',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'loading'],
      pre: ['class'],
      code: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}
