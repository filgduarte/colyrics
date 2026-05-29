import { useContext, useMemo, useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { Eye } from 'lucide-react';
import { ProjectContext } from '../../../context';
import { config } from '../../../config';
import { parseChordMD } from '../../../lib/parser';
import { renderHTML } from '../../../lib/renderer';
import { calculatePageBreakpoints } from '../../../lib/paginator';
import Panel from '../../ui/Panel';
import './style.css';

/* ── Constants ── */
const MM_TO_PX = 3.7795275591;

function parseMM(value) {
    if (!value || typeof value !== 'string') return 20;
    const match = value.match(/^([\d.]+)\s*mm/);
    return match ? parseFloat(match[1]) : 20;
}

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

/* ── Dynamic page size style injection ── */
function injectPageSizeStyle(width, height) {
    const id = 'colyrics-page-size-style';
    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('style');
        el.id = id;
        document.head.appendChild(el);
    }
    el.textContent = `@page { size: ${width} ${height}; margin: 0; }`;
}

/* ── Component ── */
export default function Preview() {
    const { project, currentSongIndex, setCurrentSongIndex } = useContext(ProjectContext);
    const settings = project?.settings;
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

    // ── Computed page dimensions from settings ──
    const page = useMemo(() => {
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

    const pageFontStyle = useMemo(() => {
        const t = settings?.text || config.preview;
        return {
            fontFamily: t.fontFamily || 'Arial',
            fontSize: `${t.fontSize || 12}pt`,
            lineHeight: t.lineHeight || 1.5,
        };
    }, [settings?.text]);

    const pageGap = config.preview.pageGap;

    // Inject dynamic @page size for print
    useEffect(() => {
        injectPageSizeStyle(page.width, page.height);
    }, [page.width, page.height]);

    // Always render all songs
    const songsData = useMemo(() => {
        return project.songs.map((s, i) => makeSongData(s, i));
    }, [project.songs]);

    // Responsive scale
    useEffect(() => {
        const updateScale = () => {
            const el = wrapperRef.current;
            if (!el) return;
            const container = el.querySelector('.preview-page-stack');
            if (!container) return;
            setScale(container.clientWidth / page.widthPx);
        };
        updateScale();
        const observer = new ResizeObserver(updateScale);
        if (wrapperRef.current) observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, [page.widthPx]);

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
            const bp = calculatePageBreakpoints(chordmdEl, page.contentHeightPx);
            const existing = map.get(sd.songIndex);
            if (!existing || existing.length !== bp.length || existing.some((v, j) => v !== bp[j])) {
                map.set(sd.songIndex, bp.length > 0 ? bp : [0]);
                changed = true;
            }
        });

        if (changed) setMeasuredBreakpoints(map);
    }, [songsData, measuredBreakpoints, page.contentHeightPx]);

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

    // Block observer briefly after content changes
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

    // Re-attach observer when resolvedSongs change
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

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
        if (ignoreScrollRef.current) {
            ignoreScrollRef.current = false;
            return;
        }

        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const target = wrapper.querySelector(`.preview-container[data-song-index="${currentSongIndex}"]`);
        if (!target) return;

        const wrapperRect = wrapper.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const isVisible = targetRect.top >= wrapperRect.top && targetRect.bottom <= wrapperRect.bottom;

        if (!isVisible) {
            isScrollingRef.current = true;
            let gapPx = 0;
            if (typeof pageGap === 'string' && pageGap.endsWith('rem')) {
                const rem = parseFloat(pageGap);
                gapPx = rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
            } else if (typeof pageGap === 'string' && pageGap.endsWith('px')) {
                gapPx = parseFloat(pageGap);
            } else if (typeof pageGap === 'number') {
                gapPx = pageGap;
            }

            const style = getComputedStyle(wrapper);
            let paddingTopPx = 0;
            if (style.paddingTop.endsWith('px')) {
                paddingTopPx = parseFloat(style.paddingTop);
            } else if (style.paddingTop.endsWith('rem')) {
                const rem = parseFloat(style.paddingTop);
                paddingTopPx = rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
            }

            const marginPx = Math.min(gapPx, paddingTopPx);
            const wrapperTop = wrapper.getBoundingClientRect().top;
            const targetTop = target.getBoundingClientRect().top;
            const scrollOffset = targetTop - wrapperTop + wrapper.scrollTop - marginPx;

            wrapper.scrollTo({
                top: scrollOffset,
                behavior: 'smooth',
            });
            setTimeout(() => { isScrollingRef.current = false; }, 600);
        }
    }, [currentSongIndex, pageGap]);

    // ── Export PDF flow ──
    useEffect(() => {
        const handler = () => setIsPrinting(true);
        window.addEventListener('colyrics:print', handler);
        return () => window.removeEventListener('colyrics:print', handler);
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
                {`Page: ${page.width} × ${page.height} • Margins: ${page.marginTop} ${page.marginRight} ${page.marginBottom} ${page.marginLeft}`}
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
                                width: page.width,
                                padding: page.paddingStyle,
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
                                style={{ aspectRatio: page.aspectRatio }}
                            >
                                <div
                                    className="preview-page"
                                    style={{
                                        width: page.width,
                                        height: page.height,
                                        padding: page.paddingStyle,
                                        transform: isPrinting ? 'none' : `scale(${scale})`,
                                    }}
                                >
                                    <div
                                        className="preview-page-viewport"
                                        style={{ height: `${page.contentHeightMM}mm` }}
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