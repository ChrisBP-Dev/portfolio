export function isTipTapContentEmpty(json: string): boolean {
  try {
    const doc = JSON.parse(json);
    if (!doc.content || doc.content.length === 0) return true;
    // Single empty paragraph = empty
    if (
      doc.content.length === 1 &&
      doc.content[0].type === 'paragraph' &&
      !doc.content[0].content
    )
      return true;
    return false;
  } catch {
    return true;
  }
}
