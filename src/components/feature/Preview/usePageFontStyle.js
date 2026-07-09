import { useMemo } from 'react';
import { config } from '../../../config';

/**
 * Computes the font style object from project text settings.
 * @param {object} settings - project.settings
 * @returns {{ fontFamily, fontSize, lineHeight }}
 */
export default function usePageFontStyle(settings) {
    return useMemo(() => {
        const t = settings?.text || config.preview;
        return {
            fontFamily: t.fontFamily,
            fontSize: `${t.fontSize}pt`,
            lineHeight: t.lineHeight,
        };
    }, [settings?.text]);
}
