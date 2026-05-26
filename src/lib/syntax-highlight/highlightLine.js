import { escapeHTML } from "../renderer/utils.js";

/**
 * Syntax highlight a single line of ChordMD content.
 * Returns an HTML string safe for `dangerouslySetInnerHTML`.
 *
 * Token classes (per spec):
 *   .title        — line starting with "# "
 *   .meta         — line starting with "## " (parser convention) or "@"
 *   .section      — line starting with "### " or a standalone [SectionName]
 *   .chord        — inline [Chord] token
 *   .blockquote   — ">" marker
 *   .comment      — line starting with "//"
 *   .syntax-error — empty brackets "[]", headers without space after #
 */

export function highlightLine(line) {
  // ── Comment ──
  if (/^\/\//.test(line)) {
    return `<span class="comment">${escapeHTML(line)}</span>`;
  }

  // ── Section (### notation, from parser) ──
  if (/^###\s/.test(line)) {
    return `<span class="section">${escapeHTML(line)}</span>`;
  }

  // ── Meta (## key:value notation, from parser) ──
  if (/^##\s/.test(line)) {
    return `<span class="meta">${escapeHTML(line)}</span>`;
  }

  // ── Title (#  notation) ──
  if (/^#\s/.test(line)) {
    return `<span class="title">${escapeHTML(line)}</span>`;
  }

  // ── Meta (@ notation, from spec) ──
  if (/^@/.test(line)) {
    return `<span class="meta">${escapeHTML(line)}</span>`;
  }

  // ── Header without space after # (syntax error) ──
  // Matches #X, ##X, ###X where X is not # or whitespace
  if (/^#{1,3}[^#\s]/.test(line)) {
    return `<span class="syntax-error">${escapeHTML(line)}</span>`;
  }

  // ── Empty line ──
  if (line === "") {
    return "";
  }

  // ── Section (bracket notation [Verse], from spec) ──
  if (/^\[[^\]]+\]$/.test(line.trim())) {
    return `<span class="section">${escapeHTML(line)}</span>`;
  }

  // ── Blockquote ──
  if (/^>/.test(line)) {
    const escaped = escapeHTML(line);
    return `<span class="blockquote">&gt;</span>${escaped.slice(1)}`;
  }

  // ── Lyric line with inline tokens ──
  return highlightInline(line);
}

function highlightInline(line) {
  const escaped = escapeHTML(line);
  const parts = [];
  const chordRe = /\[([^\]]*)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = chordRe.exec(escaped)) !== null) {
    // Text before chord
    if (match.index > lastIndex) {
      parts.push(escaped.slice(lastIndex, match.index));
    }

    const content = match[1]; // already escaped

    if (content === "") {
      // Empty brackets = syntax error
      parts.push(`<span class="syntax-error">[]</span>`);
    } else {
      parts.push(`<span class="chord">[${content}]</span>`);
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last chord
  if (lastIndex < escaped.length) {
    parts.push(escaped.slice(lastIndex));
  }

  return parts.join("");
}
