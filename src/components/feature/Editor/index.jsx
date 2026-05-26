import { useState, useContext, useRef, useCallback, useMemo } from 'react';
import { Brackets } from 'lucide-react';
import { ProjectContext } from '../../../context';
import Panel from '../../ui/Panel';
import { highlightLine, countSyntaxErrors } from '../../../lib/syntax-highlight';
import './style.css';

export default function Editor() {
    const { project, setProject, currentSongIndex } = useContext(ProjectContext);
    const currentSong = project.songs[currentSongIndex];
    const content = currentSong?.content || '';

    const textareaRef = useRef(null);
    const overlayRef = useRef(null);
    const lineNumbersRef = useRef(null);

    const [currentLine, setCurrentLine] = useState(0);

    const lineCount = useMemo(() => {
        return content.split('\n').length;
    }, [content]);

    const stats = useMemo(() => {
        const charCount = content.length;
        const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
        return { lineCount, wordCount, charCount };
    }, [content, lineCount]);

    const syntaxErrorCount = useMemo(() => {
        return countSyntaxErrors(content);
    }, [content]);

    const updateCurrentLine = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const pos = textarea.selectionStart;
        const text = textarea.value;
        // Use split on /\r?\n/ to handle both \n and \r\n
        const lines = text.slice(0, pos).split(/\r?\n/);
        const line = lines.length - 1;

        setCurrentLine(line);
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
        updateCurrentLine();
    }, [updateCurrentLine]);

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
        updateCurrentLine();
    }, [currentSongIndex, setProject, updateCurrentLine]);

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

    const syntaxErrorMsg = syntaxErrorCount === 0
        ? 'No syntax errors detected'
        : `${syntaxErrorCount} syntax error${syntaxErrorCount !== 1 ? 's' : ''} detected`;

    const footer = (
        <>
            <span className="status-stats">
                {`${stats.lineCount} lines • ${stats.wordCount} words • ${stats.charCount} characters`}
            </span>
            <span className={`status-syntax-errors${syntaxErrorCount > 0 ? ' has-errors' : ''}`}>
                {syntaxErrorMsg}
            </span>
        </>
    )

    return (
        <Panel title="Editor" icon={Brackets} footer={footer}>
            <div className="editor-container">
                <div className="editor-line-numbers" ref={lineNumbersRef}>
                    {lineNumbers.map(num => (
                        <div key={num} className={`editor-line-number${num - 1 === currentLine ? ' active-line' : ''}`}>{num}</div>
                    ))}
                </div>
                <div className="editor-content">
                    <div className="editor-overlay" ref={overlayRef} aria-hidden="true">
                        <div className="editor-overlay-inner">
                            {overlayLines.map((line, i) => (
                                <div
                                    key={i}
                                    className={`editor-overlay-line${i === currentLine ? ' active-line' : ''}`}
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
                        onSelect={updateCurrentLine}
                        onKeyUp={updateCurrentLine}
                        onClick={updateCurrentLine}
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
