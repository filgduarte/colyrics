import { useMemo } from 'react';
import { countSyntaxErrors } from '../../../lib/syntax-highlight';

/**
 * Derives display statistics and line data from editor content.
 * @param {string} content - Raw editor text
 * @returns {{ stats, syntaxErrorCount, syntaxErrorMsg, lineNumbers, overlayLines }}
 */
export default function useEditorStats(content) {
    // Split once; share the lines array across all derived values
    const lines = useMemo(() => content.split('\n'), [content]);

    const lineCount = lines.length;

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

    // lineNumbers: avoid building an array in useMemo; just return the count.
    // The Editor component can use Array.from({ length }, (_, i) => i + 1) inline.
    const lineNumbers = lineCount;

    // overlayLines is just the split lines
    const overlayLines = lines;

    return { stats, syntaxErrorCount, syntaxErrorMsg, lineNumbers, overlayLines };
}
