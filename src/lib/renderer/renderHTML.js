import {
  escapeHTML,
  groupBlockquotes,
  isChordOnly
} from "./utils.js";

export function renderHTML(ast) {
  if (!ast) return '';

  let html = `<div class="chordmd">\n`;

  if (ast.title || ast.meta.length > 0) {
    html += `<header>\n`;
    
    if (ast.title) {
      html += `<h1>${escapeHTML(ast.title)}</h1>\n`;
    }
  
    if (ast.meta.length > 0) {
      html += `<ul class="meta">\n`;
  
      ast.meta.forEach (({ key, value }) => {
        html += `<li>`;

        if (key) {
          html += `<span class="meta-key">${escapeHTML(key)}</span>\n`;
        }

        html += `<span class="meta-value">${escapeHTML(value)}</span>\n`;

        html += `</li>\n`;
      });
  
      html += `</ul>\n`;
    }

    html += `</header>\n`;
  }

  html += `<main>\n`;

  ast.sections.forEach(section => {
    html += `<section>\n`;

    html += `<h3>${escapeHTML(section.name)}</h3>\n`;

    const groups = groupBlockquotes(section.lines);

    groups.forEach(group => {
      if (group.blockquote) {
        html += `<blockquote>\n`;
      }

      group.lines.forEach(line => {
        html += renderLine(line);
      });

      if (group.blockquote) {
        html += `</blockquote>\n`;
      }
    });

    html += `</section>\n`;
  });

  html += `</main>\n`;

  html+= `</div>\n`;

  return html;
}

function renderLine(line) {
  if (line.type === "empty") {
    return `<div class="spacer"></div>\n`;
  }

  if (line.type === "comment") {
    return `<p class="comment">${escapeHTML(line.value)}</p>\n`;
  }

  if (line.type === "lyric") {
    const chordOnly = isChordOnly(line);

    let html = `<p class="line ${chordOnly ? "chord-only" : ""}">`;

    line.tokens.forEach(token => {
      html += `<span class="token">`;
      
      if (token.chord) {
        html += `<span class="chord">${escapeHTML(token.chord)}</span>`;
      }
      
      if (!chordOnly) {
        html += `<span class="text">${escapeHTML(token.text)}</span>`;
      }
      
      html += `</span>`;
    });

    html += `</p>`;

    return html;
  }

  return "";
}