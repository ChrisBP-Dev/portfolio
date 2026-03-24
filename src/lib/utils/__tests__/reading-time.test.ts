import { describe, it, expect } from 'vitest';
import { calculateReadingTime, extractTextFromTipTap } from '../reading-time';

function makeDoc(content: unknown[]): string {
  return JSON.stringify({ type: 'doc', content });
}

function makeParagraph(text: string) {
  return { type: 'paragraph', content: [{ type: 'text', text }] };
}

function generateWords(count: number): string {
  return Array.from({ length: count }, (_, i) => `word${i}`).join(' ');
}

describe('extractTextFromTipTap', () => {
  it('extracts text from nested TipTap JSON structure', () => {
    const json = makeDoc([
      makeParagraph('Hello world'),
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Section Title' }],
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [makeParagraph('Item one')],
          },
          {
            type: 'listItem',
            content: [makeParagraph('Item two')],
          },
        ],
      },
    ]);

    const result = extractTextFromTipTap(json);
    expect(result).toContain('Hello world');
    expect(result).toContain('Section Title');
    expect(result).toContain('Item one');
    expect(result).toContain('Item two');
  });

  it('ignores image nodes (no text)', () => {
    const json = makeDoc([
      makeParagraph('Before image'),
      { type: 'image', attrs: { src: 'https://example.com/img.png', alt: 'test' } },
      makeParagraph('After image'),
    ]);

    const result = extractTextFromTipTap(json);
    expect(result).toContain('Before image');
    expect(result).toContain('After image');
    expect(result).not.toContain('https://');
  });

  it('returns empty string for empty content', () => {
    const json = makeDoc([]);
    expect(extractTextFromTipTap(json)).toBe('');
  });

  it('returns empty string for invalid JSON', () => {
    expect(extractTextFromTipTap('not-json')).toBe('');
  });
});

describe('calculateReadingTime', () => {
  it('returns 1 min for ~200 words', () => {
    const json = makeDoc([makeParagraph(generateWords(200))]);
    expect(calculateReadingTime(json)).toBe(1);
  });

  it('returns 3 min for ~600 words', () => {
    const json = makeDoc([makeParagraph(generateWords(600))]);
    expect(calculateReadingTime(json)).toBe(3);
  });

  it('returns 1 min for empty content (empty doc)', () => {
    const json = makeDoc([]);
    expect(calculateReadingTime(json)).toBe(1);
  });

  it('returns 1 min for invalid JSON (graceful fallback)', () => {
    expect(calculateReadingTime('not-valid-json')).toBe(1);
  });

  it('returns 1 min for empty string', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('correctly counts text from headings, lists, and code blocks', () => {
    const json = makeDoc([
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: generateWords(50) }] },
      {
        type: 'bulletList',
        content: [
          { type: 'listItem', content: [makeParagraph(generateWords(50))] },
          { type: 'listItem', content: [makeParagraph(generateWords(50))] },
        ],
      },
      { type: 'codeBlock', content: [{ type: 'text', text: generateWords(50) }] },
      makeParagraph(generateWords(50)),
    ]);
    // 250 words → ceil(250/200) = 2 min
    expect(calculateReadingTime(json)).toBe(2);
  });
});
