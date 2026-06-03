import { useState, useEffect } from 'react';

/**
 * Manages the print flow: listens for the custom 'colyrics:print' event,
 * triggers window.print() after two animation frames, and resets after
 * the native 'afterprint' event.
 * @returns {{ isPrinting: boolean }}
 */
export default function usePrintFlow() {
    const [isPrinting, setIsPrinting] = useState(false);

    // Listen for custom print request
    useEffect(() => {
        const handler = () => setIsPrinting(true);
        window.addEventListener('colyrics:print', handler);
        return () => window.removeEventListener('colyrics:print', handler);
    }, []);

    // Trigger native print after two rAFs (let print styles apply)
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

    // Reset after print dialog closes
    useEffect(() => {
        const handler = () => setIsPrinting(false);
        window.addEventListener('afterprint', handler);
        return () => window.removeEventListener('afterprint', handler);
    }, []);

    return { isPrinting };
}
