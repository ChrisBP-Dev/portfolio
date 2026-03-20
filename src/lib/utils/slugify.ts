const ACCENT_MAP: Record<string, string> = {
  á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u',
  ä: 'a', ë: 'e', ï: 'i', ö: 'o', ü: 'u',
  ñ: 'n', ç: 'c',
};

const ACCENT_REGEX = new RegExp(`[${Object.keys(ACCENT_MAP).join('')}]`, 'g');

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(ACCENT_REGEX, (char) => ACCENT_MAP[char] ?? char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
