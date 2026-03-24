import { describe, it, expect } from 'vitest';
import { renderTipTapToHtml } from '../tiptap-renderer';

function makeDoc(content: unknown[]): string {
  return JSON.stringify({ type: 'doc', content });
}

function makeParagraph(text: string) {
  return { type: 'paragraph', content: [{ type: 'text', text }] };
}

describe('renderTipTapToHtml', () => {
  it('renders paragraph with text', () => {
    const json = makeDoc([makeParagraph('Hello world')]);
    expect(renderTipTapToHtml(json)).toBe('<p>Hello world</p>');
  });

  it('renders heading level 2', () => {
    const json = makeDoc([
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Section' }] },
    ]);
    expect(renderTipTapToHtml(json)).toBe('<h2>Section</h2>');
  });

  it('renders bold + italic marks', () => {
    const json = makeDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'styled',
            marks: [{ type: 'bold' }, { type: 'italic' }],
          },
        ],
      },
    ]);
    expect(renderTipTapToHtml(json)).toBe('<p><em><strong>styled</strong></em></p>');
  });

  it('renders link mark with target and rel attributes', () => {
    const json = makeDoc([
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'click here',
            marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
          },
        ],
      },
    ]);
    expect(renderTipTapToHtml(json)).toBe(
      '<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">click here</a></p>',
    );
  });

  it('renders code block with blog-code-block class', () => {
    const json = makeDoc([
      { type: 'codeBlock', content: [{ type: 'text', text: 'const x = 1;' }] },
    ]);
    expect(renderTipTapToHtml(json)).toBe(
      '<pre class="blog-code-block"><code>const x = 1;</code></pre>',
    );
  });

  it('renders bullet list', () => {
    const json = makeDoc([
      {
        type: 'bulletList',
        content: [
          { type: 'listItem', content: [makeParagraph('item 1')] },
          { type: 'listItem', content: [makeParagraph('item 2')] },
        ],
      },
    ]);
    expect(renderTipTapToHtml(json)).toBe(
      '<ul><li><p>item 1</p></li><li><p>item 2</p></li></ul>',
    );
  });

  it('renders ordered list', () => {
    const json = makeDoc([
      {
        type: 'orderedList',
        content: [
          { type: 'listItem', content: [makeParagraph('first')] },
          { type: 'listItem', content: [makeParagraph('second')] },
        ],
      },
    ]);
    expect(renderTipTapToHtml(json)).toBe(
      '<ol><li><p>first</p></li><li><p>second</p></li></ol>',
    );
  });

  it('renders image node with lazy loading', () => {
    const json = makeDoc([
      { type: 'image', attrs: { src: 'https://img.com/photo.jpg', alt: 'A photo' } },
    ]);
    expect(renderTipTapToHtml(json)).toBe(
      '<img src="https://img.com/photo.jpg" alt="A photo" loading="lazy" />',
    );
  });

  it('renders blockquote', () => {
    const json = makeDoc([
      { type: 'blockquote', content: [makeParagraph('wise words')] },
    ]);
    expect(renderTipTapToHtml(json)).toBe('<blockquote><p>wise words</p></blockquote>');
  });

  it('renders horizontal rule', () => {
    const json = makeDoc([{ type: 'horizontalRule' }]);
    expect(renderTipTapToHtml(json)).toBe('<hr />');
  });

  it('renders hard break', () => {
    const json = makeDoc([
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'line one' },
          { type: 'hardBreak' },
          { type: 'text', text: 'line two' },
        ],
      },
    ]);
    expect(renderTipTapToHtml(json)).toBe('<p>line one<br />line two</p>');
  });

  it('renders inline code mark', () => {
    const json = makeDoc([
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Use ' },
          { type: 'text', text: 'npm install', marks: [{ type: 'code' }] },
        ],
      },
    ]);
    expect(renderTipTapToHtml(json)).toBe('<p>Use <code>npm install</code></p>');
  });

  it('renders strikethrough mark', () => {
    const json = makeDoc([
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'removed', marks: [{ type: 'strike' }] },
        ],
      },
    ]);
    expect(renderTipTapToHtml(json)).toBe('<p><s>removed</s></p>');
  });

  it('renders complex document with mixed nodes', () => {
    const json = makeDoc([
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Title' }] },
      makeParagraph('Intro paragraph.'),
      {
        type: 'bulletList',
        content: [
          { type: 'listItem', content: [makeParagraph('Point A')] },
        ],
      },
      { type: 'codeBlock', content: [{ type: 'text', text: 'console.log("hi");' }] },
      { type: 'horizontalRule' },
      makeParagraph('End.'),
    ]);
    const result = renderTipTapToHtml(json);
    expect(result).toContain('<h1>Title</h1>');
    expect(result).toContain('<p>Intro paragraph.</p>');
    expect(result).toContain('<ul><li><p>Point A</p></li></ul>');
    expect(result).toContain('<pre class="blog-code-block"><code>');
    expect(result).toContain('<hr />');
    expect(result).toContain('<p>End.</p>');
  });

  it('returns empty string for invalid JSON', () => {
    expect(renderTipTapToHtml('not-json')).toBe('');
  });

  it('returns empty string for empty string input', () => {
    expect(renderTipTapToHtml('')).toBe('');
  });

  it('renders nested list items correctly', () => {
    const json = makeDoc([
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              makeParagraph('parent'),
              {
                type: 'bulletList',
                content: [
                  { type: 'listItem', content: [makeParagraph('child')] },
                ],
              },
            ],
          },
        ],
      },
    ]);
    const result = renderTipTapToHtml(json);
    expect(result).toContain('<ul><li><p>parent</p><ul><li><p>child</p></li></ul></li></ul>');
  });

  it('escapes HTML entities in text content', () => {
    const json = makeDoc([makeParagraph('<script>alert("xss")</script>')]);
    const result = renderTipTapToHtml(json);
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('escapes single quotes in text content', () => {
    const json = makeDoc([makeParagraph("it's a test")]);
    const result = renderTipTapToHtml(json);
    expect(result).toContain('&#39;');
    expect(result).toBe('<p>it&#39;s a test</p>');
  });

  it('falls back to h2 when heading level is non-numeric', () => {
    const json = makeDoc([
      { type: 'heading', attrs: { level: 'abc' }, content: [{ type: 'text', text: 'Title' }] },
    ]);
    expect(renderTipTapToHtml(json)).toBe('<h2>Title</h2>');
  });

  it('falls back to h2 when heading level is null', () => {
    const json = makeDoc([
      { type: 'heading', attrs: { level: null }, content: [{ type: 'text', text: 'Title' }] },
    ]);
    expect(renderTipTapToHtml(json)).toBe('<h2>Title</h2>');
  });
});
