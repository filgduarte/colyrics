import { useState, useLayoutEffect, useMemo, useRef } from 'react';
import { calculatePageBreakpoints } from '../../../lib/paginator';

/**
 * Measures DOM elements and computes pagination breakpoints for every song.
 *
 * Uses a ref-backed cache for breakpoints so that measurement itself does not
 * cause re-renders. State is only updated when breakpoints actually change.
 *
 * @param {Array} songsData - array of { songIndex, title, html, breakpoints }
 * @param {number} contentHeightPx - usable page height in pixels
 * @param {string} fontFamily - font family used in preview
 * @param {string} fontSize - font size used in preview (e.g. "12pt")
 * @param {number} lineHeight - line height multiplier
 * @returns {{ measureRefs, resolvedSongs, totalPageCount, resolvedSongsRef }}
 */
export default function usePageBreakpoints(songsData, contentHeightPx, fontFamily, fontSize, lineHeight) {
    const measureRefs = useRef([]);
    const breakpointCache = useRef(new Map());
    const [version, setVersion] = useState(0);

    useLayoutEffect(() => {
        const refs = measureRefs.current;
        if (!refs || refs.length === 0) return;

        const cache = breakpointCache.current;
        let changed = false;

        songsData.forEach((sd, i) => {
            const el = refs[i];
            if (!el || !sd.html) {
                if (!cache.has(sd.songIndex)) {
                    cache.set(sd.songIndex, [0]);
                    changed = true;
                }
                return;
            }
            const chordmdEl = el.querySelector('.chordmd');
            if (!chordmdEl) {
                if (!cache.has(sd.songIndex)) {
                    cache.set(sd.songIndex, [0]);
                    changed = true;
                }
                return;
            }
            const bp = calculatePageBreakpoints(chordmdEl, contentHeightPx);
            const normalized = bp.length > 0 ? bp : [0];
            const existing = cache.get(sd.songIndex);

            if (!existing || existing.length !== normalized.length ||
                existing.some((v, j) => v !== normalized[j])) {
                cache.set(sd.songIndex, normalized);
                changed = true;
            }
        });

        if (changed) setVersion(n => n + 1);
    }, [songsData, contentHeightPx, fontFamily, fontSize, lineHeight]);

    const resolvedSongs = useMemo(() => {
        return songsData.map(sd => ({
            ...sd,
            breakpoints: breakpointCache.current.get(sd.songIndex) || sd.breakpoints,
        }));
    }, [songsData, version]);

    const resolvedSongsRef = useRef(resolvedSongs);
    resolvedSongsRef.current = resolvedSongs;

    const totalPageCount = useMemo(() => {
        return resolvedSongs.reduce((sum, sd) => sum + sd.breakpoints.length, 0);
    }, [resolvedSongs]);

    return { measureRefs, resolvedSongs, totalPageCount, resolvedSongsRef };
}
