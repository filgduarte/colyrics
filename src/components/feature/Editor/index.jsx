import { useState, useContext, useRef, useCallback, useMemo } from 'react';
import { Brackets } from 'lucide-react';
import { ProjectContext } from '../../../context';
import Panel from '../../ui/Panel';
import { highlightLine } from '../../../lib/syntax-highlight';
import './style.css';

export default function Editor() {
    const { project, setProject, currentSongIndex } = useContext(ProjectContext);
    const currentSong = project.songs[currentSongIndex];
    const content = currentSong?.content || '';

    const textareaRef = useRef(null);
    const overlayRef = useRef(null);
    const lineNumbersRef = useRef(null);

    const [activeLine, setActiveLine] = useState(0);

    const lineCount = useMemo(() => {
        return content.split('\n').length;
    }, [content]);

    const updateActiveLine = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const pos = textarea.selectionStart;
        const text = textarea.value;
        let line = 0;
        for (let i = 0; i < pos && i < text.length; i++) {
            if (text[i] === '\n') line++;
        }
        setActiveLine(line);
    }, []);

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

        // Update active line on scroll/click as well
        updateActiveLine();
    }, [updateActiveLine]);

    const handleChange = useCallback((e) => {
        const newContent = e.target.value;
        const titleMatch = newContent.split('\n').find(line => line.startsWith('# '));
        const newTitle = titleMatch ? titleMatch.slice(2).trim() : '';

        setProject(prev => {
            const newSongs = [...prev.songs];
            newSongs[currentSongIndex] = {
                title: newTitle || newSongs[currentSongIndex].title,
                content: newContent,
            };
            return { ...prev, songs: newSongs };
        });

        // Update active line after content mutation
        updateActiveLine();
    }, [currentSongIndex, setProject, updateActiveLine]);

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
                        <div key={num} className={`editor-line-number${num - 1 === activeLine ? ' active-line' : ''}`}>{num}</div>
                    ))}
                </div>
                <div className="editor-content">
                    <div className="editor-overlay" ref={overlayRef} aria-hidden="true">
                        <div className="editor-overlay-inner">
                            {overlayLines.map((line, i) => (
                                <div
                                    key={i}
                                    className={`editor-overlay-line${i === activeLine ? ' active-line' : ''}`}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: highlightLine(line) || '&nbsp;' }} />
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
                        onSelect={updateActiveLine}
                        onKeyUp={updateActiveLine}
                        onClick={updateActiveLine}
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
