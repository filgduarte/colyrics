import { escapeHTML } from "../renderer/utils.js";
import {
    isEmpty,
    isComment,
    isTitle,
    isMeta,
    isSectionHeading,
    isBracketedSection,
    isBlockquote,
    isMalformedHeader,
} from "../parser/classifyLine.js";

/**
 * Syntax highlight a single line of ChordMD content.
 * Returns an HTML string safe for `dangerouslySetInnerHTML`.
 *
 * Token classes:
 *   .title        — line starting with "# "
 *   .meta         — line starting with "## " or "@"
 *   .section      — line starting with "### " or a standalone [SectionName]
 *   .chord        — inline [Chord] token
 *   .blockquote   — ">" marker
 *   .comment      — line starting with "//"
 *   .syntax-error — empty brackets "[]", headers without space after #
 */

/**
 * Count syntax errors in full ChordMD content.
 */
export function countSyntaxErrors(content) {
  const lines = content.split('\n');
  let count = 0;

  for (const line of lines) {
    if (isMalformedHeader(line)) {
      count++;
      continue;
    }
    if (/\[\s*\]/.test(line)) {
      count++;
    }
  }

  return count;
}

export function highlightLine(line) {
  // ── Malformed header (must be checked before valid patterns) ──
  if (isMalformedHeader(line)) {
    return `<span class="syntax-error">${escapeHTML(line)}</span>`;
  }

  // ── Comment ──
  if (isComment(line)) {
    return `<span class="comment">${escapeHTML(line)}</span>`;
  }

  // ── Section heading (### notation) ──
  if (isSectionHeading(line)) {
    return `<span class="section">${escapeHTML(line)}</span>`;
  }

  // ── Meta (## notation) ──
  if (isMeta(line)) {
    return `<span class="meta">${escapeHTML(line)}</span>`;
  }

  // ── Title (# notation) ──
  if (isTitle(line)) {
    return `<span class="title">${escapeHTML(line)}</span>`;
  }

  // ── Meta (@ notation, from spec) ──
  if (/^@/.test(line)) {
    return `<span class="meta">${escapeHTML(line)}</span>`;
  }

  // ── Empty line ──
  if (isEmpty(line)) {
    return "";
  }

  // ── Bracketed section [Verse] ──
  if (isBracketedSection(line)) {
    return `<span class="section">${escapeHTML(line)}</span>`;
  }

  // ── Blockquote ──
  if (isBlockquote(line)) {
    const escaped = escapeHTML(line);
    const lineWithoutMarker = highlightInline(escaped.slice(4));
    return `<span class="blockquote">&gt;</span>${lineWithoutMarker}`;
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
    if (match.index > lastIndex) {
      parts.push(escaped.slice(lastIndex, match.index));
    }

    const content = match[1];

    if (content === "") {
      parts.push(`<span class="syntax-error">[]</span>`);
    } else {
      parts.push(`<span class="chord">[${content}]</span>`);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < escaped.length) {
    parts.push(escaped.slice(lastIndex));
  }

  return parts.join("");
}
