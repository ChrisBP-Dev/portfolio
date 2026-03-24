interface TipTapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  marks?: TipTapMark[];
  text?: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMarks(text: string, marks: TipTapMark[]): string {
  let result = text;
  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        result = `<strong>${result}</strong>`;
        break;
      case 'italic':
        result = `<em>${result}</em>`;
        break;
      case 'strike':
        result = `<s>${result}</s>`;
        break;
      case 'code':
        result = `<code>${result}</code>`;
        break;
      case 'link': {
        const href = escapeHtml(String(mark.attrs?.href ?? ''));
        result = `<a href="${href}" target="_blank" rel="noopener noreferrer">${result}</a>`;
        break;
      }
    }
  }
  return result;
}

function renderNode(node: TipTapNode): string {
  switch (node.type) {
    case 'doc':
      return (node.content ?? []).map(renderNode).join('');

    case 'text': {
      const escaped = escapeHtml(node.text ?? '');
      return node.marks ? renderMarks(escaped, node.marks) : escaped;
    }

    case 'paragraph':
      return `<p>${(node.content ?? []).map(renderNode).join('')}</p>`;

    case 'heading': {
      const level = Number(node.attrs?.level ?? 2);
      const tag = `h${Math.min(Math.max(level, 1), 3)}`;
      return `<${tag}>${(node.content ?? []).map(renderNode).join('')}</${tag}>`;
    }

    case 'bulletList':
      return `<ul>${(node.content ?? []).map(renderNode).join('')}</ul>`;

    case 'orderedList':
      return `<ol>${(node.content ?? []).map(renderNode).join('')}</ol>`;

    case 'listItem':
      return `<li>${(node.content ?? []).map(renderNode).join('')}</li>`;

    case 'codeBlock':
      return `<pre class="blog-code-block"><code>${(node.content ?? []).map(renderNode).join('')}</code></pre>`;

    case 'blockquote':
      return `<blockquote>${(node.content ?? []).map(renderNode).join('')}</blockquote>`;

    case 'horizontalRule':
      return '<hr />';

    case 'hardBreak':
      return '<br />';

    case 'image': {
      const src = escapeHtml(String(node.attrs?.src ?? ''));
      const alt = escapeHtml(String(node.attrs?.alt ?? ''));
      return `<img src="${src}" alt="${alt}" loading="lazy" />`;
    }

    default:
      return '';
  }
}

export function renderTipTapToHtml(json: string): string {
  try {
    const doc = JSON.parse(json) as TipTapNode;
    return renderNode(doc);
  } catch {
    return '';
  }
}
