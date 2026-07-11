import { isChordMDFile, preprocess } from "./utils.js";
import { parseLyricLine } from "./parseLyricLine.js";
import { parseMetaLine } from "./parseMetaLine.js";
import {
    isEmpty,
    isComment,
    isTitle,
    isMeta,
    isSectionHeading,
    isBlockquote,
    stripBlockquote,
} from "./classifyLine.js";

export function parseChordMD(input, options = {}) {
  const { fileExtension = ".md", force = false } = options;

  let lines = input.split(/\r?\n/);

  const isChordMD = isChordMDFile(lines, fileExtension, force);

  if (!isChordMD) {
    return null;
  }

  lines = preprocess(lines);

  const ast = {
    type: "chordmd",
    title: null,
    meta: [],
    sections: []
  };

  let currentSection = null;

  for (let rawLine of lines) {
    let line = rawLine;

    // Detect blockquote
    let isBlockquoteLine = isBlockquote(line);
    if (isBlockquoteLine) {
      line = stripBlockquote(line);
    }

    // Empty line
    if (isEmpty(line)) {
      if (currentSection) {
        currentSection.lines.push({
          type: "empty",
          blockquote: isBlockquoteLine
        });
      }
      continue;
    }

    // Comment
    if (isComment(line)) {
      if (currentSection) {
        currentSection.lines.push({
          type: "comment",
          value: line.trim().slice(2).trim(),
          blockquote: isBlockquoteLine
        });
      }
      continue;
    }

    // Title
    if (isTitle(line)) {
      ast.title = line.trim().slice(2).trim();
      continue;
    }

    // Meta
    if (isMeta(line)) {
      ast.meta.push(parseMetaLine(line.trim().slice(3).trim()));
      continue;
    }

    // Section heading
    if (isSectionHeading(line)) {
      currentSection = {
        name: line.trim().slice(4).trim(),
        lines: []
      };
      ast.sections.push(currentSection);
      continue;
    }

    // Lyric line (default — create implicit section if needed)
    if (!currentSection) {
      currentSection = {
        name: "",
        lines: []
      };
      ast.sections.push(currentSection);
    }

    currentSection.lines.push({
      type: "lyric",
      tokens: parseLyricLine(line),
      blockquote: isBlockquoteLine
    });
  }

  return ast;
}
