import { useContext } from 'react';
import { Brackets, Columns2, Eye, Moon, Sun } from 'lucide-react';
import { ViewContext } from '../../context';
import RadioSwitch from '../RadioSwitch';
import './style.css';

export default function MenuView() {
    const { view, changeTheme, changeLayout } = useContext(ViewContext);
    const layoutOptions = [
        { label: 'Editor only', value: 'editor', icon: Brackets },
        { label: 'Side to Side', value: 'sideToSide', icon: Columns2 },
        { label: 'Preview only', value: 'preview', icon: Eye },
    ];
    const themeOptions = [
        { label: 'Light', value: 'light', icon: Sun },
        { label: 'Dark', value: 'dark', icon: Moon },
    ];
    return (
        <div className="menu-view">
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