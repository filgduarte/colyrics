import { useMemo } from 'react';
import { config } from '../../../config';

const MM_TO_PX = 3.7795275591;

function parseMM(value) {
    if (!value || typeof value !== 'string') return 20;
    const match = value.match(/^([\d.]+)\s*mm/);
    return match ? parseFloat(match[1]) : 20;
}

/**
 * Computes page dimensions (mm + px) and margin layout from project settings.
 * @param {object} settings - project.settings
 * @returns {{ width, height, widthMM, heightMM, widthPx, marginTop, marginRight,
 *             marginBottom, marginLeft, marginTopMM, marginRightMM, marginBottomMM,
 *             marginLeftMM, contentHeightMM, contentHeightPx, aspectRatio, paddingStyle }}
 */
export default function usePageDimensions(settings) {
    return useMemo(() => {
        const s = settings?.page || config.preview;
        const widthMM = parseMM(s.width);
        const heightMM = parseMM(s.height);
        const marginTopMM = parseMM(s.marginTop);
        const marginRightMM = parseMM(s.marginRight);
        const marginBottomMM = parseMM(s.marginBottom);
        const marginLeftMM = parseMM(s.marginLeft);

        return {
            width: s.width || '210mm',
            height: s.height || '297mm',
            widthMM,
            heightMM,
            widthPx: widthMM * MM_TO_PX,
            marginTop: s.marginTop || '20mm',
            marginRight: s.marginRight || '20mm',
            marginBottom: s.marginBottom || '20mm',
            marginLeft: s.marginLeft || '20mm',
            marginTopMM,
            marginRightMM,
            marginBottomMM,
            marginLeftMM,
            contentHeightMM: heightMM - marginTopMM - marginBottomMM,
            contentHeightPx: (heightMM - marginTopMM - marginBottomMM) * MM_TO_PX,
            aspectRatio: widthMM / heightMM,
            paddingStyle: `${s.marginTop || '20mm'} ${s.marginRight || '20mm'} ${s.marginBottom || '20mm'} ${s.marginLeft || '20mm'}`,
        };
    }, [settings?.page]);
}
