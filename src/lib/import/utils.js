/**
 * Validate that a parsed object has the minimum required project structure.
 * @param {unknown} data - Parsed JSON data
 * @returns {boolean}
 * @throws {Error} If validation fails
 */
export function validateProjectStructure(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Invalid project file: not a valid object');
  }
  if (typeof data.title !== 'string') {
    throw new Error('Invalid project file: missing or invalid "title"');
  }
  if (!data.settings || typeof data.settings !== 'object') {
    throw new Error('Invalid project file: missing or invalid "settings"');
  }
  if (!Array.isArray(data.songs)) {
    throw new Error('Invalid project file: "songs" must be an array');
  }
  return true;
}

/**
 * Normalize line endings to \n.
 * @param {string} text
 * @returns {string}
 */
export function normalizeLineEndings(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Remove leading empty lines from text.
 * @param {string} text
 * @returns {string}
 */
export function removeLeadingEmptyLines(text) {
  return text.replace(/^\s*\n+/, '');
}

/**
 * Strip the @chordmd marker if present at the start of the content.
 * Also removes any whitespace immediately after the marker.
 * @param {string} text
 * @returns {string}
 */
export function stripChordmdFlag(text) {
  if (text.startsWith('@chordmd')) {
    return text.slice('@chordmd'.length).replace(/^\s*\n/, '\n');
  }
  return text;
}

/**
 * Extract title from the first # markdown heading.
 * Returns null if no heading is found.
 * @param {string} text
 * @returns {string | null}
 */
export function extractTitle(text) {
  const match = text.match(/^# (.+)/m);
  return match ? match[1].trim() : null;
}

/**
 * Get the file name without its extension.
 * @param {string} filename
 * @returns {string}
 */
export function getFileNameWithoutExtension(filename) {
  const dotIndex = filename.lastIndexOf('.');
  return dotIndex > 0 ? filename.slice(0, dotIndex) : filename;
}
