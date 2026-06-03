import { useState, useEffect } from 'react';

/**
 * Tracks the wrapper width and computes a scale factor so the page
 * preview fits the available container.
 * @param {React.RefObject} wrapperRef - ref to the scroll wrapper
 * @param {number} pageWidthPx - target page width in pixels
 * @returns {number} scale
 */
export default function useResponsiveScale(wrapperRef, pageWidthPx) {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            const el = wrapperRef.current;
            if (!el) return;
            const container = el.querySelector('.preview-page-stack');
            if (!container) return;
            setScale(container.clientWidth / pageWidthPx);
        };
        updateScale();
        const observer = new ResizeObserver(updateScale);
        if (wrapperRef.current) observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, [wrapperRef, pageWidthPx]);

    return scale;
}
