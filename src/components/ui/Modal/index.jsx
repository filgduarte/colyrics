import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './style.css';

export default function Modal({ open, onClose, title, children, footer }) {
    const overlayRef = useRef(null);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        if (open) {
            document.addEventListener('keydown', handleKey);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose?.();
    };

    return createPortal(
        <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal-container" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
