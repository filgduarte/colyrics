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
    const page = settings?.page || config.preview;

    // Depend on primitive values so useMemo cache works across renders
    // when settings objects are recreated with identical values.
    const w = page.width;
    const h = page.height;
    const mt = page.marginTop;
    const mr = page.marginRight;
    const mb = page.marginBottom;
    const ml = page.marginLeft;

    return useMemo(() => {
        const widthMM = parseMM(w);
        const heightMM = parseMM(h);
        const marginTopMM = parseMM(mt);
        const marginRightMM = parseMM(mr);
        const marginBottomMM = parseMM(mb);
        const marginLeftMM = parseMM(ml);

        return {
            width: w || '210mm',
            height: h || '297mm',
            widthMM,
            heightMM,
            widthPx: widthMM * MM_TO_PX,
            marginTop: mt || '20mm',
            marginRight: mr || '20mm',
            marginBottom: mb || '20mm',
            marginLeft: ml || '20mm',
            marginTopMM,
            marginRightMM,
            marginBottomMM,
            marginLeftMM,
            contentHeightMM: heightMM - marginTopMM - marginBottomMM,
            contentHeightPx: (heightMM - marginTopMM - marginBottomMM) * MM_TO_PX,
            aspectRatio: widthMM / heightMM,
            paddingStyle: `${mt || '20mm'} ${mr || '20mm'} ${mb || '20mm'} ${ml || '20mm'}`,
        };
    }, [w, h, mt, mr, mb, ml]);
}
