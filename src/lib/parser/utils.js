export function isChordMDFile(lines, extension, force) {
  if (force) return true;

  if (extension === ".chordmd") return true;

  if (lines.length === 0) return false;

  return lines[0].trim().startsWith("@chordmd");
}

export function preprocess(lines) {
  if (lines.length === 0) return lines;

  // Remove marcador @chordmd
  if (lines[0].trim().startsWith("@chordmd")) {
    return lines.slice(1);
  }

  return lines;
}