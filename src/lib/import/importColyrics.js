import { validateProjectStructure } from './utils';

/**
 * Parse and validate a .colyrics JSON string into a project object.
 * Replaces the entire project state.
 *
 * @param {string} text - Raw file content
 * @returns {{ title: string, settings: object, songs: Array<{title: string, content: string}> }}
 * @throws {Error} If JSON is invalid or structure is incomplete
 */
export function importColyrics(text) {
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON in .colyrics file');
  }

  validateProjectStructure(data);

  // Return a clean, minimal project object (unknown fields are ignored)
  return {
    title: data.title,
    settings: data.settings,
    songs: data.songs,
  };
}
