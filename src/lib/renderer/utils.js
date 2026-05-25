export function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Agrupa linhas consecutivas de blockquote
export function groupBlockquotes(lines) {
  const groups = [];
  let currentGroup = null;

  lines.forEach(line => {
    if (!currentGroup || currentGroup.blockquote !== line.blockquote) {
      currentGroup = {
        blockquote: line.blockquote,
        lines: []
      };
      groups.push(currentGroup);
    }

    currentGroup.lines.push(line);
  });

  return groups;
}

export function isChordOnly(line) {
  return line.tokens.every(token => !token.text || token.text.trim() === "");
}