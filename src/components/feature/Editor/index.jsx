import { useContext, useRef, useCallback, useMemo } from 'react';
import { Brackets } from 'lucide-react';
import { ProjectContext } from '../../../context';
import Panel from '../../ui/Panel';
import './style.css';

export default function Editor() {
    const { project, setProject, currentSongIndex } = useContext(ProjectContext);
    const currentSong = project.songs[currentSongIndex];
    const content = currentSong?.content || '';

    const textareaRef = useRef(null);
    const overlayRef = useRef(null);
    const lineNumbersRef = useRef(null);

    const lineCount = useMemo(() => {
        return content.split('\n').length;
    }, [content]);

    const handleScroll = useCallback(() => {
        const textarea = textareaRef.current;
        const overlay = overlayRef.current;
        const lineNumbers = lineNumbersRef.current;
        if (!textarea) return;

        const { scrollTop, scrollLeft } = textarea;

        if (overlay) {
            overlay.scrollTop = scrollTop;
            overlay.scrollLeft = scrollLeft;
        }
        if (lineNumbers) {
            lineNumbers.scrollTop = scrollTop;
        }
    }, []);

    const handleChange = useCallback((e) => {
        const newContent = e.target.value;
        setProject(prev => {
            const newSongs = [...prev.songs];
            newSongs[currentSongIndex] = {
                ...newSongs[currentSongIndex],
                content: newContent,
            };
            return { ...prev, songs: newSongs };
        });
    }, [currentSongIndex, setProject]);

    const lineNumbers = useMemo(() => {
        const numbers = [];
        const count = Math.max(lineCount, 1);
        for (let i = 1; i <= count; i++) {
            numbers.push(i);
        }
        return numbers;
    }, [lineCount]);

    const overlayLines = useMemo(() => {
        return content.split('\n');
    }, [content]);

    return (
        <Panel title="Editor" icon={Brackets}>
            <div className="editor-container">
                <div className="editor-line-numbers" ref={lineNumbersRef}>
                    {lineNumbers.map(num => (
                        <div key={num} className="editor-line-number">{num}</div>
                    ))}
                </div>
                <div className="editor-content">
                    <div className="editor-overlay" ref={overlayRef} aria-hidden="true">
                        <div className="editor-overlay-inner">
                            {overlayLines.map((line, i) => (
                                <div key={i} className="editor-overlay-line">
                                    {line || '\u00A0'}
                                </div>
                            ))}
                        </div>
                    </div>
                    <textarea
                        ref={textareaRef}
                        className="editor-textarea"
                        value={content}
                        onChange={handleChange}
                        onScroll={handleScroll}
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        wrap="off"
                    />
                </div>
            </div>
        </Panel>
    );
}
