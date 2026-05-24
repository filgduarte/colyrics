import { useState, useEffect, useCallback } from 'react';
import { getSettings, updateSettings } from '../models/settings';
import { config } from '../config';

export default function useViewSettings() {
    const [view, setView] = useState({
        theme: config.view.defaultTheme,
        layout: config.view.defaultLayout,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSettings().then((settings) => {
            if (settings?.view) {
                setView(settings.view);
            }
            setLoading(false);
        });
    }, []);

    const changeTheme = useCallback((theme) => {
        setView((prev) => {
            const updated = { ...prev, theme };
            updateSettings({ view: updated });
            return updated;
        });
    }, []);

    const changeLayout = useCallback((layout) => {
        setView((prev) => {
            const updated = { ...prev, layout };
            updateSettings({ view: updated });
            return updated;
        });
    }, []);

    return { view, loading, changeTheme, changeLayout };
}