import { useMemo } from 'react';
import { countSyntaxErrors } from '../../../lib/syntax-highlight';

/**
 * Derives display statistics and line data from editor content.
 * @param {string} content - Raw editor text
 * @returns {{ lineCount, stats, syntaxErrorCount, syntaxErrorMsg, lineNumbers, overlayLines }}
 */
export default function useEditorStats(content) {
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

    const syntaxErrorMsg = syntaxErrorCount === 0
        ? 'No syntax errors detected'
        : `${syntaxErrorCount} syntax error${syntaxErrorCount !== 1 ? 's' : ''} detected`;

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

    return { lineCount, stats, syntaxErrorCount, syntaxErrorMsg, lineNumbers, overlayLines };
}
