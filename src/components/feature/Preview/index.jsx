import { useContext, useMemo, useRef, useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { ProjectContext } from '../../../context';
import { config } from '../../../config';
import { parseChordMD } from '../../../lib/parser';
import { renderHTML } from '../../../lib/renderer';
import Panel from '../../ui/Panel';
import './style.css';

const PREVIEW_BASE_WIDTH = 600;

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

    // Margin from global config
    const { margin } = config.preview;

    // Listen to container width changes to recalculate scale
    useEffect(() => {
        const updateScale = () => {
            const el = containerRef.current;
            if (!el) return;

            const availableWidth = el.clientWidth;
            const newScale = Math.min(availableWidth / PREVIEW_BASE_WIDTH, 1.5);
            setScale(newScale);
        };

        updateScale();

        const observer = new ResizeObserver(updateScale);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Recalculate scale when content changes (may change container layout)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const availableWidth = el.clientWidth;
        const newScale = Math.min(availableWidth / PREVIEW_BASE_WIDTH, 1.5);
        setScale(newScale);
    }, [content]);

    return (
        <Panel title="Preview" icon={Eye}>
            <div className="preview-container" ref={containerRef}>
                {html ? (
                    <div
                        className="preview-page"
                        style={{
                            transform: `scale(${scale})`,
                            padding: margin,
                            width: `${PREVIEW_BASE_WIDTH}px`,
                        }}
                    >
                        <div
                            className="preview-rendered"
                            style={pageFontStyle}
                            dangerouslySetInnerHTML={{ __html: html }}
                        />
                    </div>
                ) : (
                    <div className="preview-empty">
                        Start typing to see the preview
                    </div>
                )}
            </div>
        </Panel>
    );
}
