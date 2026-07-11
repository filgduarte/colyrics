/**
 * Shared line classifiers for ChordMD syntax.
 * Used by both the parser (parseChordMD) and the syntax highlighter
 * (highlightLine) so the grammar is defined in one place.
 */

/** Line is empty or whitespace-only. */
export function isEmpty(line) {
    return line.trim() === '';
}

/** Line is a comment: starts with // */
export function isComment(line) {
    return line.trim().startsWith('//');
}

/** Line is a title: starts with "# " but not "##" */
export function isTitle(line) {
    const t = line.trim();
    return t.startsWith('# ') && !t.startsWith('##');
}

/** Line is a meta directive: starts with "## " */
export function isMeta(line) {
    return line.trim().startsWith('## ');
}

/** Line is a section heading: starts with "### " */
export function isSectionHeading(line) {
    return line.trim().startsWith('### ');
}

/** Line is a bracketed section name: [Verse], [Chorus], etc. (whole line) */
export function isBracketedSection(line) {
    return /^\[[^\]]+\]$/.test(line.trim());
}

/** Line is a blockquote: starts with ">" (after optional whitespace) */
export function isBlockquote(line) {
    return line.trimStart().startsWith('>');
}

/** Strip the blockquote marker ">" and one optional space. */
export function stripBlockquote(line) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith('>')) {
        return trimmed.replace(/^>\s?/, '');
    }
    return line;
}

/** Check if the line has a header-like pattern without proper space after # (syntax error). */
export function isMalformedHeader(line) {
    return /^#{1,3}[^#\s]/.test(line);
}

/**
 * Classify a raw line and return its type and extracted payload.
 * @param {string} rawLine
 * @returns {{ type: 'empty'|'comment'|'title'|'meta'|'section'|'blockquote'|'lyric'|'malformed-header', value?: string }}
 */
export function classifyLine(rawLine) {
    const clean = rawLine.trim();

    if (clean === '') return { type: 'empty' };

    if (isMalformedHeader(rawLine)) return { type: 'malformed-header' };
    if (isComment(rawLine)) return { type: 'comment', value: clean.slice(2).trim() };
    if (isTitle(rawLine)) return { type: 'title', value: clean.slice(2).trim() };
    if (isMeta(rawLine)) return { type: 'meta', value: clean.slice(3).trim() };
    if (isSectionHeading(rawLine)) return { type: 'section', value: clean.slice(4).trim() };
    if (isBracketedSection(rawLine)) return { type: 'section', value: clean.slice(1, -1).trim() };
    if (isBlockquote(rawLine)) return { type: 'blockquote', value: stripBlockquote(rawLine) };

    return { type: 'lyric' };
}
