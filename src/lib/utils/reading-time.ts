function collectText(node: unknown, parts: string[]): void {
  if (!node || typeof node !== 'object') return;
  const n = node as Record<string, unknown>;
  if (n.type === 'text' && typeof n.text === 'string') {
    parts.push(n.text);
  }
  if (Array.isArray(n.content)) {
    for (const child of n.content) collectText(child, parts);
  }
}

export function extractTextFromTipTap(json: string): string {
  try {
    const doc = JSON.parse(json);
    const parts: string[] = [];
    collectText(doc, parts);
    return parts.join(' ');
  } catch {
    return '';
  }
}

export function calculateReadingTime(contentJson: string): number {
  const text = extractTextFromTipTap(contentJson);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
