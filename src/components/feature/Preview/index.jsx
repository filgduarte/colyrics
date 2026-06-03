import { useContext, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Eye } from 'lucide-react';
import { ProjectContext } from '../../../context';
import { config } from '../../../config';
import { parseChordMD } from '../../../lib/parser';
import { renderHTML } from '../../../lib/renderer';
import Panel from '../../ui/Panel';
import usePageDimensions from './usePageDimensions';
import usePageFontStyle from './usePageFontStyle';
import useResponsiveScale from './useResponsiveScale';
import usePageBreakpoints from './usePageBreakpoints';
import usePrintFlow from './usePrintFlow';
import './style.css';

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
    const [currentGlobalPage, setCurrentGlobalPage] = useState(1);
    const isScrollingRef = useRef(false);
    const ignoreScrollRef = useRef(false);
    const observerRef = useRef(null);
    const contentChangedRef = useRef(false);

    // ── Hooks: computed values ──
    const page = usePageDimensions(settings);
    const pageFontStyle = usePageFontStyle(settings);
    const pageGap = config.preview.pageGap;

    // Inject dynamic @page size for print
    useEffect(() => {
        injectPageSizeStyle(page.width, page.height);
    }, [page.width, page.height]);

    // Always render all songs
    const songsData = useMemo(() => {
        return project.songs.map((s, i) => makeSongData(s, i));
    }, [project.songs]);

    // ── Hooks: DOM-dependent ──
    const scale = useResponsiveScale(wrapperRef, page.widthPx);
    const { measureRefs, resolvedSongs, totalPageCount, resolvedSongsRef } =
        usePageBreakpoints(songsData, page.contentHeightPx);
    const { isPrinting } = usePrintFlow();

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
    }, [currentSongIndex, setCurrentSongIndex, resolvedSongsRef]);

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
