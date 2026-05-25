export function parseLyricLine(line) {
  const tokens = [];
  const regex = /\[([^\]]+)\]/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(line)) !== null) {
    const chord = match[1];

    // Text before chord
    if (match.index > lastIndex) {
      tokens.push({
        chord: null,
        text: line.slice(lastIndex, match.index)
      });
    }

    // Chord
    tokens.push({
      chord,
      text: ""
    });

    lastIndex = regex.lastIndex;
  }

  // Remaining text
  if (lastIndex < line.length) {
    tokens.push({
      chord: null,
      text: line.slice(lastIndex)
    });
  }

  return mergeChordText(tokens);
}

// Merge chord with following text
function mergeChordText(tokens) {
  const result = [];

  for (let i = 0; i < tokens.length; i++) {
    const current = tokens[i];

    if (current.chord) {
      const next = tokens[i + 1];

      if (next && !next.chord) {
        result.push({
          chord: current.chord,
          text: next.text
        });
        i++;
      } else {
        result.push({
          chord: current.chord,
          text: ""
        });
      }
    } else {
      result.push(current);
    }
  }

  return result;
}