import { useContext, useState } from 'react';
import { Brackets, CircleQuestionMark, Columns2, Eye, Moon, Sun } from 'lucide-react';
import { ViewContext } from '../../../context';
import RadioSwitch from '../../ui/RadioSwitch';
import Button from '../../ui/Button';
import Separator from '../../ui/Separator';
import HelpModal from '../HelpModal';
import './style.css';

export default function MenuView() {
    const { view, changeTheme, changeLayout } = useContext(ViewContext);
    const [helpOpen, setHelpOpen] = useState(false);

    const layoutOptions = [
        { label: 'Editor only', value: 'editorOnly', icon: Brackets, iconOnly: true },
        { label: 'Side to side', value: 'sideToSide', icon: Columns2, iconOnly: true },
        { label: 'Preview only', value: 'previewOnly', icon: Eye, iconOnly: true },
    ];
    const themeOptions = [
        { label: 'Light theme', value: 'light', icon: Sun, iconOnly: true },
        { label: 'Dark theme', value: 'dark', icon: Moon, iconOnly: true },
    ];
    return (
        <div id="menu-view" className="app-menu">
            <RadioSwitch
                name="layout"
                options={layoutOptions}
                value={view.layout}
                onChange={changeLayout}
            />
            <RadioSwitch
                name="theme"
                options={themeOptions}
                value={view.theme}
                onChange={changeTheme}
            />
            <Separator />
            <Button icon={CircleQuestionMark} title="Help" iconOnly onClick={() => setHelpOpen(true)} />

            <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
        </div>
    );
}
