import { useContext, useMemo, useRef, useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { ProjectContext } from '../../../context';
import { config } from '../../../config';
import { parseChordMD } from '../../../lib/parser';
import { renderHTML } from '../../../lib/renderer';
import Panel from '../../ui/Panel';
import './style.css';

export default function Preview() {
    const { project, currentSongIndex } = useContext(ProjectContext);
    const currentSong = project.songs[currentSongIndex];
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);

    const content = currentSong?.content || '';

    // Parse chordmd → AST (memoized by content)
    const ast = useMemo(() => {
        if (!content) return null;
        return parseChordMD(content, { force: true });
    }, [content]);

    // Render AST → HTML (memoized by AST reference)
    const html = useMemo(() => {
        if (!ast) return '';
        return renderHTML(ast);
    }, [ast]);

    // Font config from global settings
    const pageFontStyle = useMemo(() => {
        const { fontFamily, fontSize, lineHeight } = config.preview;
        return {
            fontFamily,
            fontSize: `${fontSize}pt`,
            lineHeight,
        };
    }, []);

    // Width, Height and Margin from global config
    const { width, height, margin } = config.preview;
    // Converte mm para px (1mm ≈ 3.7795275591px)
    const MM_TO_PX = 3.7795275591;
    const pageWidthMM = parseInt(width);
    const pageHeightMM = parseInt(height);
    const pageWidthPx = pageWidthMM * MM_TO_PX;
    const aspectRatio = pageWidthMM / pageHeightMM;

    // Listen to container width changes to recalculate scale
    useEffect(() => {
        const updateScale = () => {
            const el = containerRef.current;
            if (!el) return;

            const availableWidth = el.clientWidth;
            const newScale = availableWidth / pageWidthPx;
            setScale(newScale);
        };

        updateScale();

        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [pageWidthPx]);

    // Recalculate scale when content changes (may change container layout)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const availableWidth = el.clientWidth;
        const newScale = availableWidth / pageWidthPx;
        setScale(newScale);
    }, [pageWidthPx]);

    return (
        <Panel title="Preview" icon={Eye}>
            <div
                className="preview-container"
                style={{ aspectRatio }}
                ref={containerRef}
            >
                <div
                    className="preview-page"
                    style={{
                        width: width,
                        height: height,
                        padding: margin,
                        transform: `scale(${scale})`,
                    }}
                >
                    <div
                        className="preview-rendered"
                        style={pageFontStyle}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </div>
            </div>
        </Panel>
    );
}
