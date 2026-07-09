import { useContext, useState } from 'react';
import { Brackets, CircleQuestionMark, Columns2, Eye, Moon, Sun } from 'lucide-react';
import { ViewContext } from '../../../context';
import RadioSwitch from '../../ui/RadioSwitch';
import Button from '../../ui/Button';
import Separator from '../../ui/Separator';
import Modal from '../../ui/Modal';
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

            <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Ajuda">
                <p>
                    <strong>Colyrics</strong> is an editor and viewer for chorded over lyrics sheets
                    using <strong>ChordMD</strong>, a simple markup language based on Markdown:
                </p>

                <pre>{`# Song title
## Artist: Artist name
## Key: C

### Verse
[C]Song lyrics with [G]inline [Am]chords

### Chorus
> [F]The chord is written between [G]brackets
> exactly [C]over the syllable where it changes

// This is a comment`}</pre>

                <ul>
                    <li><code># Title</code> — Title of the song</li>
                    <li><code>## Key: Value</code> — Metadata (artist, key, BPM, whatever you want)</li>
                    <li><code>### Section Name</code> — Starts a section (Verse, Chorus, Bridge...)</li>
                    <li><code>[Chord]</code> — Chord that will bepositioned over the syllable</li>
                    <li><code>&gt; Text</code> — Blockquote (useful to highlight important lines)</li>
                    <li><code>// Text</code> — Comment</li>
                </ul>
                <p style={{textAlign: 'center'}}>
                    <small>Developed by <a href="https://github.com/filipeduarte" target="_blank" rel="noopener noreferrer">Filipe Duarte</a></small>
                </p>
            </Modal>
        </div>
    );
}
