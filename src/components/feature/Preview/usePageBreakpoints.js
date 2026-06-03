import { useState, useLayoutEffect, useMemo, useEffect, useRef } from 'react';
import { calculatePageBreakpoints } from '../../../lib/paginator';

/**
 * Measures DOM elements and computes pagination breakpoints for every song.
 * @param {Array} songsData - array of { songIndex, title, html, breakpoints }
 * @param {number} contentHeightPx - usable page height in pixels
 * @returns {{ measuredBreakpoints, resolvedSongs, totalPageCount, resolvedSongsRef }}
 */
export default function usePageBreakpoints(songsData, contentHeightPx) {
    const measureRefs = useRef([]);
    const [measuredBreakpoints, setMeasuredBreakpoints] = useState(() => new Map());

    useLayoutEffect(() => {
        const refs = measureRefs.current;
        if (!refs || refs.length === 0) return;

        const map = new Map(measuredBreakpoints);
        let changed = false;

        songsData.forEach((sd, i) => {
            const el = refs[i];
            if (!el || !sd.html) {
                if (!map.has(sd.songIndex)) { map.set(sd.songIndex, [0]); changed = true; }
                return;
            }
            const chordmdEl = el.querySelector('.chordmd');
            if (!chordmdEl) {
                if (!map.has(sd.songIndex)) { map.set(sd.songIndex, [0]); changed = true; }
                return;
            }
            const bp = calculatePageBreakpoints(chordmdEl, contentHeightPx);
            const existing = map.get(sd.songIndex);
            if (!existing || existing.length !== bp.length || existing.some((v, j) => v !== bp[j])) {
                map.set(sd.songIndex, bp.length > 0 ? bp : [0]);
                changed = true;
            }
        });

        if (changed) setMeasuredBreakpoints(map);
    }, [songsData, measuredBreakpoints, contentHeightPx]);

    const resolvedSongs = useMemo(() => {
        return songsData.map(sd => ({
            ...sd,
            breakpoints: measuredBreakpoints.get(sd.songIndex) || sd.breakpoints,
        }));
    }, [songsData, measuredBreakpoints]);

    const resolvedSongsRef = useRef(null);
    useEffect(() => { resolvedSongsRef.current = resolvedSongs; }, [resolvedSongs]);

    const totalPageCount = useMemo(() => {
        return resolvedSongs.reduce((sum, sd) => sum + sd.breakpoints.length, 0);
    }, [resolvedSongs]);

    return { measureRefs, measuredBreakpoints, resolvedSongs, totalPageCount, resolvedSongsRef };
}
