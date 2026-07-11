import { useState } from 'react';
import Modal from '../../ui/Modal';
import './style.css';

const HELP_TABS = [
    { id: 'app', label: 'Application' },
    { id: 'editor', label: 'Editor' },
    { id: 'settings', label: 'Settings' },
    { id: 'view', label: 'View' },
];

function HelpContent({ tab }) {
    switch (tab) {
        case 'app':
            return (
                <div className="help-tab-content">
                    <p>
                        <strong>Colyrics</strong> is a chord-over-lyrics editor and viewer
                        designed for musicians who need clean, printable song sheets.
                    </p>
                    
                    <h3>Project & Songs</h3>
                    <p>
                        A <strong>project</strong> holds one or more songs. Use the
                        <strong> Project</strong> panel on the left to manage your song list.
                    </p>
                    <ul>
                        <li>
                            <strong>New song</strong> — Click the <code>+</code> button in the
                            Project panel header to add a new song to the current project.
                        </li>
                        <li>
                            <strong>Reorder songs</strong> — Drag and drop songs by their
                            grip handle to change the playback order.
                        </li>
                        <li>
                            <strong>Delete a song</strong> — Hover over a song and click the
                            trash icon. You cannot delete the last remaining song.
                        </li>
                        <li>
                            <strong>Switch songs</strong> — Click any song in the list to
                            start editing it. The editor and preview update automatically.
                        </li>
                    </ul>

                    <h3>File Operations</h3>
                    <ul>
                        <li>
                            <strong>New</strong> — Creates a fresh project (replaces the
                            current one after confirmation).
                        </li>
                        <li>
                            <strong>Open</strong> — Import a <code>.colyrics</code> project
                            file or a <code>.chordmd</code> song file from your computer.
                        </li>
                        <li>
                            <strong>Save</strong> — Split button with two options:
                            <em> Save project</em> exports the entire project as a
                            <code>.colyrics</code> file, while <em>Save song</em> exports
                            only the current song as a <code>.chordmd</code> file.
                        </li>
                        <li>
                            <strong>Print</strong> — Opens the browser print dialog to
                            print or save the current song as PDF.
                        </li>
                    </ul>
                </div>
            );

        case 'editor':
            return (
                <div className="help-tab-content">
                    <p>
                        The editor uses <strong>ChordMD</strong>, a simple markup language
                        based on Markdown for writing chorded lyrics:
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

                    <h3>Syntax Reference</h3>
                    <ul>
                        <li><code># Title</code> — Song title (first heading only).</li>
                        <li><code>## Key: Value</code> — Metadata field (artist, key, BPM, etc.).</li>
                        <li><code>### Section Name</code> — Starts a new section (Verse, Chorus, Bridge…).</li>
                        <li><code>[Chord]</code> — Chord placed over the syllable immediately following it.</li>
                        <li><code>&gt; Text</code> — Blockquote.</li>
                        <li><code>// Text</code> — Comment line.</li>
                    </ul>

                    <h3>Tips</h3>
                    <ul>
                        <li>Place chords <em>directly before</em> the syllable they belong to, with no space between: <code>[G]love</code> not <code>[G] love</code>.</li>
                        <li>Use multiple metadata lines for any information you need: tempo, capo, tuning, copyright, etc.</li>
                        <li>Use blockquotes to highlight important lines or verses, like the chorus.</li>
                    </ul>
                </div>
            );

        case 'settings':
            return (
                <div className="help-tab-content">
                    <p>
                        Project settings control how your songs look when printed or exported.
                        Access them via the <strong>Settings</strong> button in the toolbar
                        or the <strong>File menu</strong>.
                    </p>

                    <h3>Page</h3>
                    <ul>
                        <li>
                            <strong>Size preset</strong> — Choose from common paper sizes
                            (A4, Letter, etc.) or select <em>Custom</em> to enter your own
                            width and height.
                        </li>
                        <li>
                            <strong>Custom dimensions</strong> — When <em>Custom</em> is
                            selected, set width and height in mm, cm, or inches.
                        </li>
                        <li>
                            <strong>Margins</strong> — Set top, right, bottom, and left
                            margins in millimeters. These define the printable area inside
                            the page.
                        </li>
                    </ul>

                    <h3>Text</h3>
                    <ul>
                        <li>
                            <strong>Font family</strong> — Choose from a curated list of
                            web-safe and modern fonts (Arial, Times New Roman, Inter, DM Mono…).
                        </li>
                        <li>
                            <strong>Font size</strong> — Set the base font size in points (pt).
                            Chords are rendered proportionally smaller.
                        </li>
                        <li>
                            <strong>Line height</strong> — Controls spacing between lines.
                            Higher values add more room; lower values make the sheet denser.
                        </li>
                    </ul>

                    <p>
                        All changes take effect immediately in the preview panel so you can
                        see how the final output will look.
                    </p>
                </div>
            );

        case 'view':
            return (
                <div className="help-tab-content">
                    <p>
                        Adjust how the workspace is laid out using the view controls in the
                        toolbar.
                    </p>

                    <h3>Layout Modes</h3>
                    <ul>
                        <li>
                            <strong>Editor only</strong> — Shows only the ChordMD editor.
                            Useful when you want a focused writing experience with maximum
                            screen space for the source text.
                        </li>
                        <li>
                            <strong>Side to side</strong> — Splits the workspace into editor
                            on the left and live preview on the right. Ideal for seeing your
                            changes rendered in real time.
                        </li>
                        <li>
                            <strong>Preview only</strong> — Shows only the rendered preview.
                            Great for rehearsals, presentations, or checking the final output
                            before printing.
                        </li>
                    </ul>

                    <h3>Theme</h3>
                    <ul>
                        <li>
                            <strong>Light</strong> — A bright theme optimized for well-lit
                            environments and printing.
                        </li>
                        <li>
                            <strong>Dark</strong> — A dark theme that reduces eye strain in
                            low-light settings. The preview background remains white for
                            accurate print preview.
                        </li>
                    </ul>

                    <p>
                        Layout and theme preferences are saved automatically and restored
                        when you reopen the application.
                    </p>
                </div>
            );

        default:
            return null;
    }
}

export default function HelpModal({ open, onClose }) {
    const [activeTab, setActiveTab] = useState('app');

    return (
        <Modal open={open} onClose={onClose} title="Help">
            <nav className="help-tabs">
                {HELP_TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`help-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
            <HelpContent tab={activeTab} />
            <p className="help-footer">
                <small>Developed by <a href="https://github.com/filipeduarte" target="_blank" rel="noopener noreferrer">Filipe Duarte</a></small>
            </p>
        </Modal>
    );
}
