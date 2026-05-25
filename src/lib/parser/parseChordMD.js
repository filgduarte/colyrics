import { isChordMDFile, preprocess } from "./utils.js";
import { parseLyricLine } from "./parseLyricLine.js";
import { parseMetaLine } from "./parseMetaLine.js";

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
    let isBlockquote = false;
    const trimmedStart = line.trimStart();

    if (trimmedStart.startsWith(">")) {
      isBlockquote = true;
      line = trimmedStart.replace(/^>\s?/, "");
    }

    const cleanLine = line.trim();

    // Empty line
    if (cleanLine === "") {
      if (currentSection) {
        currentSection.lines.push({
          type: "empty",
          blockquote: isBlockquote
        });
      }
      continue;
    }

    // Comment
    if (cleanLine.startsWith("//")) {
      if (currentSection) {
        currentSection.lines.push({
          type: "comment",
          value: cleanLine.slice(2).trim(),
          blockquote: isBlockquote
        });
      }
      continue;
    }

    // Title
    if (cleanLine.startsWith("# ") && !cleanLine.startsWith("##")) {
      ast.title = cleanLine.slice(2).trim();
      continue;
    }

    // Meta
    if (cleanLine.startsWith("## ")) {
      ast.meta.push(parseMetaLine(cleanLine.slice(3).trim()));
      continue;
    }

    // Section
    if (cleanLine.startsWith("### ")) {
      currentSection = {
        name: cleanLine.slice(4).trim(),
        lines: []
      };
      ast.sections.push(currentSection);
      continue;
    }

    // Lyric line
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
      blockquote: isBlockquote
    });
  }

  return ast;
}