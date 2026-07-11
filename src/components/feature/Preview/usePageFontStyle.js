import { useMemo } from 'react';
import { config } from '../../../config';

/**
 * Computes the font style object from project text settings.
 * @param {object} settings - project.settings
 * @returns {{ fontFamily, fontSize, lineHeight }}
 */
export default function usePageFontStyle(settings) {
    const text = settings?.text || config.preview;

    // Depend on primitive values so useMemo cache works across renders
    const ff = text.fontFamily;
    const fs = text.fontSize;
    const lh = text.lineHeight;

    return useMemo(() => ({
        fontFamily: ff,
        fontSize: `${fs}pt`,
        lineHeight: lh,
    }), [ff, fs, lh]);
}
