import { useState, useEffect, useCallback } from 'react';

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

export const PAGE_SIZE_OPTIONS = [
    { label: 'A4 (210 × 297 mm)', width: '210mm', height: '297mm' },
    { label: 'A5 (148 × 210 mm)', width: '148mm', height: '210mm' },
    { label: 'Carta (216 × 279 mm)', width: '216mm', height: '279mm' },
    { label: 'Ofício (216 × 356 mm)', width: '216mm', height: '356mm' },
    { label: 'Custom', width: null, height: null },
];

/**
 * Manages the settings dialog form state, syncs from project settings
 * when opened, and exposes all form mutation handlers.
 */
export default function useSettingsForm({ isOpen, settings, updateSettings, onClose }) {
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

    // Generic handler for custom dimension (width/height) num/unit changes
    const handleCustomDimension = useCallback((dimension, field, value) => {
        const setter = dimension === 'width' ? setCustomWidth : setCustomHeight;
        const pageField = dimension;

        setter(prev => {
            const next = { ...prev, [field]: value };
            setForm(p => ({
                ...p,
                page: { ...p.page, [pageField]: formatUnit(next.num, next.unit) },
            }));
            return next;
        });
        setPreset('Custom');
    }, []);

    const handleMarginChange = useCallback((field, e) => {
        const num = parseFloat(e.target.value) || 0;
        const parsed = parseUnit(form.page[field]);
        setForm(prev => ({
            ...prev,
            page: { ...prev.page, [field]: formatUnit(num, parsed.unit) },
        }));
    }, [form.page]);

    const handleSave = useCallback(() => {
        updateSettings?.(form);
        onClose?.();
    }, [form, updateSettings, onClose]);

    // Derived
    const marginParsed = {
        top: parseUnit(form.page.marginTop),
        right: parseUnit(form.page.marginRight),
        bottom: parseUnit(form.page.marginBottom),
        left: parseUnit(form.page.marginLeft),
    };

    const isCustom = preset === 'Custom';

    return {
        form,
        preset,
        customWidth,
        customHeight,
        marginParsed,
        isCustom,
        handlePresetChange,
        handleTextChange,
        handleCustomDimension,
        handleMarginChange,
        handleSave,
    };
}
