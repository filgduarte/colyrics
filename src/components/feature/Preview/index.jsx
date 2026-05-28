import { useContext, useMemo, useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { Eye } from 'lucide-react';
import { ProjectContext } from '../../../context';
import { config } from '../../../config';
import { parseChordMD } from '../../../lib/parser';
import { renderHTML } from '../../../lib/renderer';
import { calculatePageBreakpoints } from '../../../lib/paginator';
import Panel from '../../ui/Panel';
import './style.css';

/* ── Page dimension constants (from config) ── */
const MM_TO_PX = 3.7795275591;
const { width, height, margin, pageGap } = config.preview;
const pageWidthMM = parseInt(width);
const pageHeightMM = parseInt(height);
const pageWidthPx = pageWidthMM * MM_TO_PX;
const pageContentHeightMM = pageHeightMM - 2 * parseInt(margin);
const pageContentHeightPx = pageContentHeightMM * MM_TO_PX;
const aspectRatio = pageWidthMM / pageHeightMM;

const pageFontStyle = {
    fontFamily: config.preview.fontFamily,
    fontSize: `${config.preview.fontSize}pt`,
    lineHeight: config.preview.lineHeight,
};

/* ── Helpers ── */

function songToHTML(song) {
    if (!song) return '';
    const content = song.content || '';
    const ast = parseChordMD(content, { force: true });
    return ast ? renderHTML(ast) : '';
}

function makeSongData(song, index) {
    return {
        songIndex: index,
        title: song.title,
        html: songToHTML(song),
        breakpoints: [0],
    };
}

/* ── Component ── */

export default function Preview() {
    const { project, currentSongIndex, setCurrentSongIndex } = useContext(ProjectContext);
    const wrapperRef = useRef(null);
    const measureRefs = useRef([]);
    const [scale, setScale] = useState(1);
    const [isPrinting, setIsPrinting] = useState(false);
    const [measuredBreakpoints, setMeasuredBreakpoints] = useState(() => new Map());
    const [currentGlobalPage, setCurrentGlobalPage] = useState(1);
    const isScrollingRef = useRef(false);
    const ignoreScrollRef = useRef(false);
    const observerRef = useRef(null);
    const contentChangedRef = useRef(false);
    const resolvedSongsRef = useRef(null);

    // Always render all songs
    const songsData = useMemo(() => {
        return project.songs.map((s, i) => makeSongData(s, i));
    }, [project.songs]);

    // Responsive scale
    useEffect(() => {
        const updateScale = () => {
            const el = wrapperRef.current;
            if (!el) return;
            setScale(el.clientWidth / pageWidthPx);
        };
        updateScale();
        const observer = new ResizeObserver(updateScale);
        if (wrapperRef.current) observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, []);

    // Measure breakpoints after DOM commit
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
            const bp = calculatePageBreakpoints(chordmdEl, pageContentHeightPx);
            const existing = map.get(sd.songIndex);
            if (!existing || existing.length !== bp.length || existing.some((v, j) => v !== bp[j])) {
                map.set(sd.songIndex, bp.length > 0 ? bp : [0]);
                changed = true;
            }
        });

        if (changed) setMeasuredBreakpoints(map);
    }, [songsData, measuredBreakpoints]);

    // Resolve breakpoints
    const resolvedSongs = useMemo(() => {
        return songsData.map(sd => ({
            ...sd,
            breakpoints: measuredBreakpoints.get(sd.songIndex) || sd.breakpoints,
        }));
    }, [songsData, measuredBreakpoints]);

    // Keep ref in sync
    useEffect(() => { resolvedSongsRef.current = resolvedSongs; }, [resolvedSongs]);

    const totalPageCount = useMemo(() => {
        return resolvedSongs.reduce((sum, sd) => sum + sd.breakpoints.length, 0);
    }, [resolvedSongs]);

    // Block observer briefly after content changes (avoids resetting selection while editing)
    useEffect(() => {
        contentChangedRef.current = true;
        const timer = setTimeout(() => { contentChangedRef.current = false; }, 400);
        return () => clearTimeout(timer);
    }, [project.songs]);

    // ── IntersectionObserver: detect visible song ──
    const handleIntersection = useCallback((entries) => {
        if (isScrollingRef.current) return;
        if (contentChangedRef.current) return;

        let bestEntry = null;
        for (const entry of entries) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
                bestEntry = entry;
            }
        }

        if (bestEntry && bestEntry.intersectionRatio > 0.1) {
            const songIndex = parseInt(bestEntry.target.dataset.songIndex);
            const pageIndex = parseInt(bestEntry.target.dataset.pageIndex);
            if (!isNaN(songIndex)) {
                // Calculate global page number (use ref for latest data)
                const songs = resolvedSongsRef.current;
                let globalPage = 1;
                for (const sd of songs) {
                    if (sd.songIndex === songIndex) {
                        globalPage += pageIndex;
                        break;
                    }
                    globalPage += sd.breakpoints.length;
                }
                setCurrentGlobalPage(globalPage);

                if (songIndex !== currentSongIndex) {
                    ignoreScrollRef.current = true;
                    setCurrentSongIndex(songIndex);
                }
            }
        }
    }, [currentSongIndex, setCurrentSongIndex]);

    // Re-attach observer when resolvedSongs change (DOM recreated)
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        // Disconnect previous
        if (observerRef.current) observerRef.current.disconnect();

        const observer = new IntersectionObserver(handleIntersection, {
            root: wrapper,
            threshold: [0, 0.25, 0.5, 0.75, 1],
        });

        const containers = wrapper.querySelectorAll('.preview-container');
        containers.forEach(el => observer.observe(el));
        observerRef.current = observer;

        return () => observer.disconnect();
    }, [resolvedSongs, handleIntersection]);

    // ── Scroll to song when selected in Project ──
    useEffect(() => {
        // Don't scroll if this change was triggered by the IntersectionObserver
        if (ignoreScrollRef.current) {
            ignoreScrollRef.current = false;
            return;
        }

        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const target = wrapper.querySelector(`.preview-container[data-song-index="${currentSongIndex}"]`);
        if (!target) return;

        // Check if target is already reasonably visible
        const wrapperRect = wrapper.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const isVisible = targetRect.top >= wrapperRect.top && targetRect.bottom <= wrapperRect.bottom;

        if (!isVisible) {
            isScrollingRef.current = true;
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => { isScrollingRef.current = false; }, 600);
        }
    }, [currentSongIndex]);

    // ── Export PDF flow ──

    useEffect(() => {
        const handler = () => setIsPrinting(true);
        window.addEventListener('colyrics:export-pdf', handler);
        return () => window.removeEventListener('colyrics:export-pdf', handler);
    }, []);

    useEffect(() => {
        if (!isPrinting) return;
        let raf1, raf2;
        raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
                window.print();
            });
        });
        return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
    }, [isPrinting]);

    useEffect(() => {
        const handler = () => setIsPrinting(false);
        window.addEventListener('afterprint', handler);
        return () => window.removeEventListener('afterprint', handler);
    }, []);

    // ── Render ──

    const footer = (
        <>
            <span className="status-settings">
                {`Page size: ${width} × ${height} • Margins: ${margin}`}
            </span>
            <span className="status-pages">
                {`Page ${currentGlobalPage} of ${totalPageCount}`}
            </span>
        </>
    );

    function pageClass(songIdx, pageIdx) {
        const isFirst = pageIdx === 0;
        const isLast = pageIdx === resolvedSongs[songIdx].breakpoints.length - 1;
        const isLastSong = songIdx === resolvedSongs.length - 1;
        const cls = ['preview-container'];
        if (songIdx > 0 && isFirst) cls.push('song-start');
        if (isLast && !isLastSong) cls.push('song-end');
        return cls.join(' ');
    }

    return (
        <Panel title="Preview" icon={Eye} footer={footer}>
            <div ref={wrapperRef} className="preview-wrapper">
                {/* Measurement containers (invisible) — one per song */}
                {songsData.map((sd, i) => (
                    <div
                        key={sd.songIndex}
                        ref={el => { measureRefs.current[i] = el; }}
                        className="preview-measure"
                        aria-hidden="true"
                    >
                        <div
                            className="preview-measure-inner"
                            style={{
                                width,
                                padding: margin,
                                ...pageFontStyle,
                            }}
                            dangerouslySetInnerHTML={{ __html: sd.html }}
                        />
                    </div>
                ))}

                {/* Visible page stack */}
                <div
                    className={`preview-page-stack${isPrinting ? ' printing' : ''}`}
                    style={{ gap: pageGap }}
                >
                    {resolvedSongs.map((sd, songIdx) =>
                        sd.breakpoints.map((offset, pageIdx) => (
                            <div
                                key={`${sd.songIndex}-${pageIdx}`}
                                data-song-index={sd.songIndex}
                                data-page-index={pageIdx}
                                className={pageClass(songIdx, pageIdx)}
                                style={{ aspectRatio }}
                            >
                                <div
                                    className="preview-page"
                                    style={{
                                        width,
                                        height,
                                        padding: margin,
                                        transform: isPrinting ? 'none' : `scale(${scale})`,
                                    }}
                                >
                                    <div
                                        className="preview-page-viewport"
                                        style={{ height: `${pageContentHeightMM}mm` }}
                                    >
                                        <div
                                            className="preview-rendered"
                                            style={{
                                                ...pageFontStyle,
                                                transform: `translateY(-${offset}px)`,
                                            }}
                                            dangerouslySetInnerHTML={{ __html: sd.html }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Panel>
    );
}
