import { useContext } from 'react';
import { Brackets, Columns2, Eye, Moon, Sun } from 'lucide-react';
import { ViewContext } from '../../context';
import RadioSwitch from '../RadioSwitch';
import './style.css';

export default function MenuView() {
    const { view, changeTheme, changeLayout } = useContext(ViewContext);
    const layoutOptions = [
        { label: 'Editor only', value: 'editor', icon: Brackets, iconOnly: true },
        { label: 'Side to Side', value: 'sideToSide', icon: Columns2, iconOnly: true },
        { label: 'Preview only', value: 'preview', icon: Eye, iconOnly: true },
    ];
    const themeOptions = [
        { label: 'Light', value: 'light', icon: Sun, iconOnly: true },
        { label: 'Dark', value: 'dark', icon: Moon, iconOnly: true },
    ];
    return (
        <div id="menu-view" className="app-menu">
            <RadioSwitch
                options={layoutOptions}
                name="layout"
                value={view.layout}
                onChange={changeLayout}
            />
            <RadioSwitch
                options={themeOptions}
                name="theme"
                value={view.theme}
                onChange={changeTheme}
            />
        </div>
    );
}