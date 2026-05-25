import {
  normalizeLineEndings,
  stripChordmdFlag,
  removeLeadingEmptyLines,
  extractTitle,
  getFileNameWithoutExtension,
} from './utils';

/**
 * Process a single .chordmd or .md file content into a song object.
 *
 * The content is normalized, the @chordmd flag (if present) is removed,
 * leading empty lines are stripped, and the title is extracted from the
 * first `# ` markdown heading. Falls back to the filename if no heading found.
 *
 * @param {string} text - Raw file content
 * @param {string} filename - Original filename (used as fallback title)
 * @returns {{ title: string, content: string }}
 */
export function importChordMD(text, filename) {
  // 1. Normalize line endings (CRLF → LF)
  let content = normalizeLineEndings(text);

  // 2. Strip the @chordmd flag if present
  content = stripChordmdFlag(content);

  // 3. Remove leading blank lines
  content = removeLeadingEmptyLines(content);

  // 4. Extract title from first # heading, or fall back to filename
  const title = extractTitle(content) || getFileNameWithoutExtension(filename);

  return { title, content };
}
