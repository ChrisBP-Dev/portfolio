import { describe, it, expect } from 'vitest';
import { sanitizeBlogHtml } from '../sanitize-blog-html';
import { renderTipTapToHtml } from '../tiptap-renderer';

describe('sanitizeBlogHtml', () => {
  it('allows safe tags to pass through', () => {
    const html =
      '<p>text</p><h2>heading</h2><a href="https://x.com">link</a><img src="https://img.com/a.png" alt="pic" loading="lazy" /><pre class="blog-code-block"><code>code</code></pre><ul><li>item</li></ul><ol><li>item</li></ol><strong>bold</strong><em>italic</em><blockquote>quote</blockquote><hr /><br /><s>strike</s>';
    const result = sanitizeBlogHtml(html);
    expect(result).toContain('<p>');
    expect(result).toContain('<h2>');
    expect(result).toContain('<a href="https://x.com">');
    expect(result).toContain('<img src="https://img.com/a.png"');
    expect(result).toContain('<pre class="blog-code-block">');
    expect(result).toContain('<code>');
    expect(result).toContain('<ul>');
    expect(result).toContain('<ol>');
    expect(result).toContain('<li>');
    expect(result).toContain('<strong>');
    expect(result).toContain('<em>');
    expect(result).toContain('<blockquote>');
    expect(result).toContain('<s>');
  });

  it('strips script tags', () => {
    const html = '<p>safe</p><script>alert("xss")</script>';
    const result = sanitizeBlogHtml(html);
    expect(result).not.toContain('<script>');
    expect(result).toContain('<p>safe</p>');
  });

  it('strips iframe tags', () => {
    const html = '<p>safe</p><iframe src="https://evil.com"></iframe>';
    const result = sanitizeBlogHtml(html);
    expect(result).not.toContain('<iframe');
  });

  it('strips event handler attributes', () => {
    const html = '<img src="x.png" onerror="alert(1)" alt="test" />';
    const result = sanitizeBlogHtml(html);
    expect(result).not.toContain('onerror');
  });

  it('strips onclick from elements', () => {
    const html = '<p onclick="alert(1)">click me</p>';
    const result = sanitizeBlogHtml(html);
    expect(result).not.toContain('onclick');
    expect(result).toContain('<p>click me</p>');
  });

  it('strips javascript: protocol from links', () => {
    const html = '<a href="javascript:alert(1)">click</a>';
    const result = sanitizeBlogHtml(html);
    expect(result).not.toContain('javascript:');
  });

  it('allows img with src, alt, loading but strips onerror', () => {
    const html = '<img src="https://img.com/a.png" alt="pic" loading="lazy" onerror="alert(1)" />';
    const result = sanitizeBlogHtml(html);
    expect(result).toContain('src="https://img.com/a.png"');
    expect(result).toContain('alt="pic"');
    expect(result).toContain('loading="lazy"');
    expect(result).not.toContain('onerror');
  });

  it('full pipeline: sanitizeBlogHtml(renderTipTapToHtml(json)) produces safe output', () => {
    const maliciousDoc = JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Safe content' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '<script>alert("xss")</script>',
            },
          ],
        },
      ],
    });

    const result = sanitizeBlogHtml(renderTipTapToHtml(maliciousDoc));
    expect(result).not.toContain('<script>');
    expect(result).toContain('Safe content');
  });
});
