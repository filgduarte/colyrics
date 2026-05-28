/**
 * Trigger a file download in the browser.
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
 * Save the full project as a .colyrics JSON file.
 *
 * @param {{ title: string, settings: object, songs: Array<{title: string, content: string}> }} project
 */
export function saveProject(project) {
    const data = JSON.stringify(project, null, 2);
    const filename = `${project.title}.colyrics`;
    downloadFile(data, filename, 'application/json');
}

/**
 * Save a single song as a .chordmd file.
 *
 * @param {{ title: string, content: string }} song
 */
export function saveSong(song) {
    const filename = `${song.title}.chordmd`;
    downloadFile(song.content, filename, 'text/plain');
}
