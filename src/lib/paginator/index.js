/**
 * Paginator — Calcula breakpoints de página a partir da medição
 * real de elementos no DOM.
 *
 * Princípio: elementos atômicos (header, section, blockquote,
 * .line, .comment, .spacer, h1, h3) nunca são partidos ao meio.
 * Quando um elemento ultrapassa o limite da página atual, uma
 * nova página começa no topo desse elemento.
 *
 * @module paginator
 */

/**
 * @param {HTMLElement} chordmdEl  - Elemento raiz .chordmd
 * @param {number}      pageHeight - Altura útil da página em px (já sem padding)
 * @returns {number[]}             - Offsets Y (px) do topo do conteúdo para cada página
 */
export function calculatePageBreakpoints(chordmdEl, pageHeight) {
  const breakpoints = [0];
  if (!chordmdEl || pageHeight <= 0) return breakpoints;

  // Elementos que não podem ser partidos
  const unbreakableSelector = [
    'header', 'section', 'blockquote',
    'h1', 'h3', '.line', '.comment', '.spacer'
  ].join(',');

  const elements = chordmdEl.querySelectorAll(unbreakableSelector);
  if (elements.length === 0) return breakpoints;

  const rootTop = chordmdEl.getBoundingClientRect().top;
  let currentPageBottom = pageHeight;

  for (const el of elements) {
    const elTop = el.getBoundingClientRect().top - rootTop;

    // Pula elementos com altura zero (possível em render inicial)
    if (el.offsetHeight === 0) continue;

    const elBottom = elTop + el.offsetHeight;

    if (elBottom > currentPageBottom) {
      // O elemento cruza o limite — nova página começa aqui
      breakpoints.push(elTop);
      currentPageBottom = elTop + pageHeight;
    }
  }

  return breakpoints;
}
