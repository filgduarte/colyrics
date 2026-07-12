/**
 * Regex que reconhece um token de acorde isolado.
 * Ex: C, C#, Bb, Cm, C#m, G7, Am7, C/G, D/F#, F#m7
 */
const CHORD_RE = /^[A-G](#|b)?(m|dim|aug|sus\d*|maj\d*)?(\d+)?(\/[A-G](#|b)?)?$/;

/**
 * Heurística: a maioria dos tokens da linha são acordes?
 */
function isChordLine(line) {
  const tokens = line.match(/\S+/g);
  if (!tokens || tokens.length === 0) return false;
  const chordCount = tokens.filter((t) => CHORD_RE.test(t)).length;
  return chordCount >= tokens.length * 0.5 && chordCount >= 1;
}

/**
 * Verifica se a linha é uma seção (ex: [Refrão]).
 */
function isSectionLine(line) {
  const s = line.trim();
  return s.startsWith('[') && s.endsWith(']');
}

/**
 * Converte um par (linha de acordes, linha de letra) para ChordMD.
 *
 * @param {string} chordLine - Linha contendo apenas acordes espaçados
 * @param {string} lyricLine - Linha de letra correspondente
 * @returns {string} Linha em formato ChordMD
 */
export function convertPair(chordLine, lyricLine) {
  // Extrair tokens de acorde com suas posições iniciais
  const chordPositions = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(chordLine)) !== null) {
    if (CHORD_RE.test(m[0])) {
      chordPositions.push({ pos: m.index, chord: m[0] });
    }
  }

  if (chordPositions.length === 0) return lyricLine;

  // Para cada acorde, encontrar a posição de inserção na letra
  const insertions = [];

  for (const { pos, chord } of chordPositions) {
    let insertPos;
    if (pos >= lyricLine.length) {
      insertPos = lyricLine.length;
    } else {
      let p = pos;
      // Avançar enquanto for espaço ou hífen (alongamento de sílaba)
      while (p < lyricLine.length && (lyricLine[p] === ' ' || lyricLine[p] === '-')) {
        p++;
      }
      insertPos = p < lyricLine.length ? p : lyricLine.length;
    }
    insertions.push({ insertPos, origPos: pos, chord });
  }

  // Ordenar por posição de inserção, depois posição original
  insertions.sort((a, b) => a.insertPos - b.insertPos || a.origPos - b.origPos);

  // Agrupar acordes que vão para a mesma posição de inserção
  const groups = [];
  for (const ins of insertions) {
    if (groups.length > 0 && groups[groups.length - 1].insertPos === ins.insertPos) {
      groups[groups.length - 1].chords.push(ins.chord);
    } else {
      groups.push({ insertPos: ins.insertPos, chords: [ins.chord] });
    }
  }

  // Construir resultado — processar de trás para frente
  const result = [...lyricLine];
  for (let i = groups.length - 1; i >= 0; i--) {
    const { insertPos, chords } = groups[i];
    const chordStr = chords.map((c) => `[${c}]`).join('');
    if (insertPos >= result.length) {
      result.push(chordStr);
    } else {
      // Inserir caractere por caractere na posição
      for (let j = 0; j < chordStr.length; j++) {
        result.splice(insertPos + j, 0, chordStr[j]);
      }
    }
  }

  return result.join('');
}

/**
 * Converte um texto completo em formato de cifra intercalada para ChordMD.
 *
 * Regras:
 * - Linhas de acordes seguidas de linhas de letra são convertidas em pares.
 * - Seções como [Refrão] são preservadas.
 * - Linhas vazias e outras linhas são preservadas.
 *
 * @param {string} text - Texto bruto no formato intercalado
 * @returns {string} Texto convertido para formato ChordMD
 */
export function importInterleaved(text) {
  const lines = text.split(/\r?\n/);
  const output = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Linha vazia
    if (line.trim() === '') {
      output.push('');
      i++;
      continue;
    }

    // Linha de seção
    if (isSectionLine(line)) {
      output.push(line.trim());
      i++;
      continue;
    }

    // Possível linha de acordes — verificar se a próxima é letra
    if (isChordLine(line)) {
      const nextIdx = i + 1;
      if (
        nextIdx < lines.length &&
        lines[nextIdx].trim() !== '' &&
        !isChordLine(lines[nextIdx]) &&
        !isSectionLine(lines[nextIdx])
      ) {
        const converted = convertPair(line, lines[nextIdx]);
        output.push(converted);
        i += 2;
        continue;
      }
    }

    // Caso contrário, preservar a linha
    output.push(line);
    i++;
  }

  return output.join('\n');
}
