export const parseStreamedText = (raw: string) => {
  const sections: { type: string; content: string }[] = [];
  const tagRegex = /<(\w+)>([\s\S]*?)<\/\1>/g;
  let lastIndex = 0;

  let match;
  while ((match = tagRegex.exec(raw)) !== null) {
    const [full, tag, content] = match;
    if (match.index > lastIndex) {
      const outsideText = raw.slice(lastIndex, match.index).trim();
      if (outsideText) sections.push({ type: 'text', content: outsideText });
    }
    sections.push({ type: tag, content: content.trim() });
    lastIndex = tagRegex.lastIndex;
  }

  const remaining = raw.slice(lastIndex).trim();
  if (remaining) sections.push({ type: 'text', content: remaining });

  return sections;
};
