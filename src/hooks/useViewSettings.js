import { useState, useEffect, useCallback, useContext } from 'react';
import { getSettings, updateSettings } from '../models/settings';
import { ViewContext } from '../context';

export default function useViewSettings() {
    const { view, setView } = useContext(ViewContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSettings() {
            const settings = await getSettings();
            if (settings && settings.view) {
                setView(settings.view);
            }
            setLoading(false);
        }
        loadSettings();

    }, [setView]);

    const changeTheme = useCallback(async (theme) => {
        setView((prev) => {
            const updated = { ...prev, theme };
            updateSettings({ view: updated });
            return updated;
        });
    }, [setView]);

    const changeLayout = useCallback(async (layout) => {
        setView((prev) => {
            const updated = { ...prev, layout };
            updateSettings({ view: updated });
            return updated;
        });
    }, [setView]);

    return { view, loading, changeTheme, changeLayout };
}
