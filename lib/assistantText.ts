export function sanitizeAssistantText(input: string): string {
  if (!input) return '';
  let text = input;

  // Pronunciation hints should never be shown to users.
  text = text.replace(/\[Zahvin\]/gi, '');
  text = text.replace(/\(pronounced\s+["']?zahvin["']?\)/gi, '');

  // Hide raw UUIDs and commitment-id phrasing from user-facing copy.
  text = text.replace(/commitment\s*id\s*[a-f0-9-]{36}/gi, 'this commitment');
  text = text.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/gi, 'this commitment');

  // Normalize spacing introduced by removals.
  text = text.replace(/\s{2,}/g, ' ').replace(/\s+\./g, '.').trim();
  return text;
}

export function splitBoldMarkdown(input: string): Array<{ text: string; bold: boolean }> {
  const chunks: Array<{ text: string; bold: boolean }> = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      chunks.push({ text: input.slice(lastIndex, match.index), bold: false });
    }
    chunks.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    chunks.push({ text: input.slice(lastIndex), bold: false });
  }

  return chunks.length > 0 ? chunks : [{ text: input, bold: false }];
}

