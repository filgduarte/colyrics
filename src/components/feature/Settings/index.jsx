import { useContext, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Settings, X } from 'lucide-react';
import { ProjectContext } from '../../../context';
import Button from '../../ui/Button';
import './style.css';

/* ── Helpers ── */
function parseUnit(value) {
    if (!value || typeof value !== 'string') return { num: 0, unit: 'mm' };
    const match = value.match(/^([\d.]+)\s*(mm|cm|in|px)?$/);
    if (match) return { num: parseFloat(match[1]) || 0, unit: match[2] || 'mm' };
    return { num: 0, unit: 'mm' };
}

function formatUnit(num, unit) {
    return `${num}${unit}`;
}

const PAGE_SIZE_OPTIONS = [
    { label: 'A4 (210 × 297 mm)', width: '210mm', height: '297mm' },
    { label: 'A5 (148 × 210 mm)', width: '148mm', height: '210mm' },
    { label: 'Carta (216 × 279 mm)', width: '216mm', height: '279mm' },
    { label: 'Ofício (216 × 356 mm)', width: '216mm', height: '356mm' },
    { label: 'Custom', width: null, height: null },
];

const FONT_FAMILY_OPTIONS = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Inter',
    'DM Mono',
];

/* ── Component ── */
export default function SettingsDialog({ isOpen, onClose }) {
    const { project, updateSettings } = useContext(ProjectContext);
    const settings = project?.settings;

    // Local form state
    const [form, setForm] = useState({
        text: { fontFamily: 'Arial', fontSize: 12, lineHeight: 1.5 },
        page: {
            width: '210mm', height: '297mm',
            marginTop: '20mm', marginRight: '20mm',
            marginBottom: '20mm', marginLeft: '20mm',
        },
    });

    const [preset, setPreset] = useState('A4 (210 × 297 mm)');
    const [customWidth, setCustomWidth] = useState({ num: 210, unit: 'mm' });
    const [customHeight, setCustomHeight] = useState({ num: 297, unit: 'mm' });

    // Sync form from project.settings when dialog opens
    useEffect(() => {
        if (!isOpen || !settings) return;
        setForm({
            text: { ...settings.text },
            page: { ...settings.page },
        });

        // Detect preset
        const w = settings.page.width;
        const h = settings.page.height;
        const matched = PAGE_SIZE_OPTIONS.find(p => p.width === w && p.height === h);
        if (matched && matched.label !== 'Custom') {
            setPreset(matched.label);
        } else {
            setPreset('Custom');
        }
        setCustomWidth(parseUnit(w));
        setCustomHeight(parseUnit(h));
    }, [isOpen, settings]);

    // ── Handlers ──
    const handlePresetChange = useCallback((e) => {
        const label = e.target.value;
        setPreset(label);
        const opt = PAGE_SIZE_OPTIONS.find(p => p.label === label);
        if (opt && opt.width) {
            setForm(prev => ({
                ...prev,
                page: { ...prev.page, width: opt.width, height: opt.height },
            }));
            setCustomWidth(parseUnit(opt.width));
            setCustomHeight(parseUnit(opt.height));
        }
    }, []);

    const handleTextChange = useCallback((field, value) => {
        setForm(prev => ({
            ...prev,
            text: { ...prev.text, [field]: value },
        }));
    }, []);

    const handlePageChange = useCallback((field, value) => {
        setForm(prev => ({
            ...prev,
            page: { ...prev.page, [field]: value },
        }));
    }, []);

    const handleCustomWidthNum = useCallback((e) => {
        const num = parseFloat(e.target.value) || 0;
        setCustomWidth(prev => {
            const next = { ...prev, num };
            setForm(p => ({
                ...p,
                page: { ...p.page, width: formatUnit(num, prev.unit) },
            }));
            return next;
        });
        setPreset('Custom');
    }, []);

    const handleCustomWidthUnit = useCallback((e) => {
        const unit = e.target.value;
        setCustomWidth(prev => {
            const next = { ...prev, unit };
            setForm(p => ({
                ...p,
                page: { ...p.page, width: formatUnit(prev.num, unit) },
            }));
            return next;
        });
    }, []);

    const handleCustomHeightNum = useCallback((e) => {
        const num = parseFloat(e.target.value) || 0;
        setCustomHeight(prev => {
            const next = { ...prev, num };
            setForm(p => ({
                ...p,
                page: { ...p.page, height: formatUnit(num, prev.unit) },
            }));
            return next;
        });
        setPreset('Custom');
    }, []);

    const handleCustomHeightUnit = useCallback((e) => {
        const unit = e.target.value;
        setCustomHeight(prev => {
            const next = { ...prev, unit };
            setForm(p => ({
                ...p,
                page: { ...p.page, height: formatUnit(prev.num, unit) },
            }));
            return next;
        });
    }, []);

    const handleMarginChange = useCallback((field, e) => {
        const num = parseFloat(e.target.value) || 0;
        const parsed = parseUnit(form.page[field]);
        handlePageChange(field, formatUnit(num, parsed.unit));
    }, [form.page, handlePageChange]);

    const handleSave = useCallback(() => {
        updateSettings?.(form);
        onClose?.();
    }, [form, updateSettings, onClose]);

    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) onClose?.();
    }, [onClose]);

    // Escape key listener
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Parse current margin values for display
    const marginParsed = {
        top: parseUnit(form.page.marginTop),
        right: parseUnit(form.page.marginRight),
        bottom: parseUnit(form.page.marginBottom),
        left: parseUnit(form.page.marginLeft),
    };

    const isCustom = preset === 'Custom';

    return createPortal(
        <div className="settings-overlay" onClick={handleBackdropClick}>
            <div className="settings-dialog" role="dialog" aria-modal="true" aria-label="Project Settings">
                <header className="settings-header">
                    <h2>
                        <Settings size={18} />
                        Project Settings
                    </h2>
                    <button className="settings-close" onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                </header>

                <main className="settings-body">
                    {/* ── Page Settings ── */}
                    <fieldset className="settings-section">
                        <legend>Page</legend>

                        <div className="settings-field">
                            <label htmlFor="settings-preset">Size preset</label>
                            <select
                                id="settings-preset"
                                value={preset}
                                onChange={handlePresetChange}
                            >
                                {PAGE_SIZE_OPTIONS.map(opt => (
                                    <option key={opt.label} value={opt.label}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {isCustom && (
                            <div className="settings-row">
                                <div className="settings-field">
                                    <label htmlFor="settings-width">Width</label>
                                    <div className="settings-unit-input">
                                        <input
                                            id="settings-width"
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={customWidth.num}
                                            onChange={handleCustomWidthNum}
                                        />
                                        <select value={customWidth.unit} onChange={handleCustomWidthUnit}>
                                            <option value="mm">mm</option>
                                            <option value="cm">cm</option>
                                            <option value="in">in</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="settings-field">
                                    <label htmlFor="settings-height">Height</label>
                                    <div className="settings-unit-input">
                                        <input
                                            id="settings-height"
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={customHeight.num}
                                            onChange={handleCustomHeightNum}
                                        />
                                        <select value={customHeight.unit} onChange={handleCustomHeightUnit}>
                                            <option value="mm">mm</option>
                                            <option value="cm">cm</option>
                                            <option value="in">in</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="settings-field">
                            <label>Margins (mm)</label>
                            <div className="settings-margins">
                                <div className="settings-margin-top">
                                    <label htmlFor="settings-margin-top">Top</label>
                                    <input
                                        id="settings-margin-top"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={marginParsed.top.num}
                                        onChange={(e) => handleMarginChange('marginTop', e)}
                                    />
                                </div>
                                <div className="settings-margin-right">
                                    <label htmlFor="settings-margin-right">Right</label>
                                    <input
                                        id="settings-margin-right"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={marginParsed.right.num}
                                        onChange={(e) => handleMarginChange('marginRight', e)}
                                    />
                                </div>
                                <div className="settings-margin-bottom">
                                    <label htmlFor="settings-margin-bottom">Bottom</label>
                                    <input
                                        id="settings-margin-bottom"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={marginParsed.bottom.num}
                                        onChange={(e) => handleMarginChange('marginBottom', e)}
                                    />
                                </div>
                                <div className="settings-margin-left">
                                    <label htmlFor="settings-margin-left">Left</label>
                                    <input
                                        id="settings-margin-left"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={marginParsed.left.num}
                                        onChange={(e) => handleMarginChange('marginLeft', e)}
                                    />
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {/* ── Text Settings ── */}
                    <fieldset className="settings-section">
                        <legend>Text</legend>

                        <div className="settings-field">
                            <label htmlFor="settings-font-family">Font family</label>
                            <select
                                id="settings-font-family"
                                value={form.text.fontFamily}
                                onChange={(e) => handleTextChange('fontFamily', e.target.value)}
                            >
                                {FONT_FAMILY_OPTIONS.map(font => (
                                    <option key={font} value={font}>{font}</option>
                                ))}
                            </select>
                        </div>

                        <div className="settings-row">
                            <div className="settings-field">
                                <label htmlFor="settings-font-size">Font size (pt)</label>
                                <input
                                    id="settings-font-size"
                                    type="number"
                                    min="6"
                                    max="72"
                                    step="1"
                                    value={form.text.fontSize}
                                    onChange={(e) => handleTextChange('fontSize', parseInt(e.target.value) || 12)}
                                />
                            </div>
                            <div className="settings-field">
                                <label htmlFor="settings-line-height">Line height</label>
                                <input
                                    id="settings-line-height"
                                    type="number"
                                    min="0.5"
                                    max="5"
                                    step="0.1"
                                    value={form.text.lineHeight}
                                    onChange={(e) => handleTextChange('lineHeight', parseFloat(e.target.value) || 1.5)}
                                />
                            </div>
                        </div>
                    </fieldset>
                </main>

                <footer className="settings-footer">
                    <Button title="Cancel" onClick={onClose} />
                    <button className="button settings-save-btn" onClick={handleSave}>
                        Save
                    </button>
                </footer>
            </div>
        </div>,
        document.body
    );
}