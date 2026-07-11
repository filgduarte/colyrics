/**
 * Trigger a file download in the browser (fallback when File System Access API
 * is not available).
 *
 * @param {string} content - File content
 * @param {string} filename - Suggested download filename
 * @param {string} mimeType - MIME type (default: application/json)
 */
function downloadFile(content, filename, mimeType = 'application/json') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

/**
 * Save content to a user-chosen file via the File System Access API.
 * Falls back to a direct download if the API is unavailable or the user
 * cancels the picker.
 *
 * @param {string} content - File content to write
 * @param {string} suggestedName - Default filename in the save dialog
 * @param {string} mimeType - MIME type for the file
 * @param {{ [key: string]: string[] }} types - Accept types for the picker, e.g. { 'application/json': ['.colyrics'] }
 */
async function saveWithPicker(content, suggestedName, mimeType, types) {
    // Try File System Access API first
    if (typeof window !== 'undefined' && typeof window.showSaveFilePicker === 'function') {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName,
                types: [
                    {
                        description: '',
                        accept: types,
                    },
                ],
            });

            const writable = await handle.createWritable();
            await writable.write(content);
            await writable.close();
            return; // Success — no fallback needed
        } catch (err) {
            // User cancelled the picker (AbortError) — silently return, no download
            if (err.name === 'AbortError') return;
            // Any other error — fall through to download fallback
            console.error('File System Access API error, falling back to download:', err);
        }
    }

    // Fallback: trigger a direct download
    downloadFile(content, suggestedName, mimeType);
}

/**
 * Save the full project as a .colyrics JSON file.
 * Opens a native save dialog so the user can choose the location.
 *
 * @param {{ title: string, settings: object, songs: Array<{title: string, content: string}> }} project
 */
export async function saveProject(project) {
    const data = JSON.stringify(project, null, 2);
    const filename = `${project.title}.colyrics`;
    await saveWithPicker(data, filename, 'application/json', {
        'application/json': ['.colyrics'],
    });
}

/**
 * Save a single song as a .chordmd file.
 * Opens a native save dialog so the user can choose the location.
 *
 * @param {{ title: string, content: string }} song
 */
export async function saveSong(song) {
    const filename = `${song.title}.chordmd`;
    await saveWithPicker(song.content, filename, 'text/plain', {
        'text/plain': ['.chordmd'],
    });
}
