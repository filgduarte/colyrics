import { useCallback } from 'react';
import { importColyrics, importChordMD } from '../lib/import';

/**
 * Hook that provides a function to open a native file picker and import
 * .colyrics (project), .chordmd / .md (song) files into the project state.
 *
 * @param {object} project - Current project state
 * @param {Function} setProject - React state setter for project
 * @param {Function} setCurrentSongIndex - React state setter for current song index
 * @returns {{ openFilePicker: Function }}
 *
 * Behavior:
 * - .colyrics → prompts confirmation, replaces entire project, resets song index to 0
 * - .chordmd / .md → adds as new song(s) without removing existing ones,
 *   and selects the first newly imported song
 * - If a .colyrics is among selected files, it takes priority and other files
 *   are ignored (per spec)
 */
export default function useFileImport(project, setProject, setCurrentSongIndex) {
  const openFilePicker = useCallback(() => {
    // Create a temporary file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.colyrics,.chordmd,.md';
    input.multiple = true;

    input.onchange = async (event) => {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      try {
        // --- .colyrics takes priority ---
        const colyricsFile = files.find((f) => f.name.endsWith('.colyrics'));

        if (colyricsFile) {
          const confirmed = window.confirm(
            'Opening a .colyrics file will replace the current project. Continue?'
          );
          if (!confirmed) return;

          const text = await colyricsFile.text();
          const projectData = importColyrics(text);
          setProject(projectData);
          setCurrentSongIndex(0);
          return;
        }

        // --- Filter supported song files ---
        const songFiles = files.filter(
          (f) => f.name.endsWith('.chordmd') || f.name.endsWith('.md')
        );

        if (songFiles.length === 0) {
          window.alert(
            'No supported files selected. Please select .colyrics, .chordmd, or .md files.'
          );
          return;
        }

        // Read all files in parallel, then convert each to a Song object
        const songs = await Promise.all(
          songFiles.map(async (file) => {
            const text = await file.text();
            return importChordMD(text, file.name);
          })
        );

        // Append imported songs without overwriting existing ones
        const firstNewIndex = project.songs.length;
        setProject((prev) => ({
          ...prev,
          songs: [...prev.songs, ...songs],
        }));
        setCurrentSongIndex(firstNewIndex);
      } catch (error) {
        window.alert(`Error importing file: ${error.message}`);
        console.error('File import error:', error);
      }
    };

    input.click();
  }, [project.songs.length, setProject, setCurrentSongIndex]);

  return { openFilePicker };
}
