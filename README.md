# Colyrics

A lightweight chord-over-lyrics editor for worship bands and musicians.
Write songs in **ChordMD** syntax, preview paginated print-ready sheets in real
time, and export projects as portable `.colyrics` files or individual `.chordmd`
sheets.

Built with React 19 + Vite. Runs entirely in the browser — no backend, no
account, no telemetry.

---

## Current status: v0.6.0 (pre-release)

> **Completed** — core editing and preview pipeline, import/export, page
> settings, dark/light themes, and side-by-side layout. The foundation is solid.
>
> **In progress toward v1.0** — preview personalisation (chord font size,
> highlight colour, visibility toggles, chord-only / lyrics-only modes) and file
> management (recent projects, auto-save, keyboard shortcuts).

---

## Features (what works today)

| Area | Feature |
|---|---|
| **Editor** | Syntax-highlighted ChordMD textarea with line numbers and live stats |
| **Preview** | Real-time paginated page stack with clip-region rendering |
| **Pagination** | DOM-measured breakpoints; atomic elements (lines, blockquotes, headings) never split |
| **Import** | `.colyrics` (full project), `.chordmd` and `.md` (single song) via system file picker |
| **Export / Save** | Save full project as `.colyrics` (JSON); save single song as `.chordmd` |
| **Print** | Native `window.print()` via toolbar button; auto page-size `@page` injection |
| **Settings** | Page preset (A4, A5, Letter, Legal, Custom), margins, font family / size / line height |
| **Themes** | Light and dark, persisted across sessions (IndexedDB) |
| **Layouts** | Side-to-side, editor-only, preview-only |
| **Multi-song** | Multiple songs per project; sidebar song list with add / remove / reorder |

---

## Roadmap to v1.0

### Phase 1 — Preview personalisation

The preview currently applies a single font size to both lyrics and chords.
Users need independent control, plus visibility toggles for different
audiences (musicians vs vocalists).

| # | Task | Dependencies | Notes |
|---|---|---|---|
| 1.1 | **Chord font size** — add `chordFontSize` setting, render chords with independent `font-size` | `settings.text` schema change | Store as scale factor (e.g. 0.75x lyric size) or absolute pt |
| 1.2 | **Highlight colour** — add `accentColor` setting, inject via CSS custom property on `.chord` elements | None | Replace hardcoded `var(--color-preview-accent)` |
| 1.3 | **Section spacing** — add `sectionGap` setting, apply as `gap` on `.chordmd section` elements | None | Accept `rem` or `mm` values |

### Phase 2 — Visibility toggles

Mostly CSS-class toggles on the preview DOM. Each needs a setting entry and a
control in the toolbar or settings dialog.

| # | Task | Dependencies | Notes |
|---|---|---|---|
| 2.1 | **Chord-only / lyrics-only mode** — radio group: `both` (default), `chords`, `lyrics` | Renderer must emit data attributes or extra classes (`chord-only`, `lyrics-only`) | Hide `.text` or `.chord` spans via CSS |
| 2.2 | **Hide metadata** — toggle `showMeta` | None | Toggle `display` on `.meta` |
| 2.3 | **Hide section headings** — toggle `showSections` | None | Toggle `display` on `h3` |
| 2.4 | **Hide comments** — toggle `showComments` | None | Toggle `display` on `.comment` |

### Phase 3 — File management

The `src/models/recent.js` module already has the Dexie CRUD helpers, but the
database schema (`db.js`) is missing the `recentProjects` object store. Auto-save
and a recent-projects picker need to be wired up.

| # | Task | Dependencies | Notes |
|---|---|---|---|
| 3.1 | **Fix DB schema** — add `recentProjects` store to `db.version(1).stores()` | None | `recentProjects: 'id, timestamp'` — bump version if needed |
| 3.2 | **Auto-save** — debounced save of current project to IndexedDB on every change | 3.1 | 2-second debounce; skip when project is clean |
| 3.3 | **Recent projects UI** — dropdown or modal listing recent projects from `recentProjects` store | 3.1, 3.2 | Show title + last-modified; click to load |
| 3.4 | **Keyboard shortcuts** — global `keydown` listener with a shortcut registry | None | `Ctrl+S` (save), `Ctrl+O` (open), `Ctrl+P` (print), `Ctrl+N` (new) |

### Phase 4 — Polish

| # | Task | Dependencies | Notes |
|---|---|---|---|
| 4.1 | **Settings dialog tabs** — split current single-pane settings into Page / Text / Display tabs | 1.x, 2.x | Avoids an overlong modal once all new settings are added |
| 4.2 | **Empty-state illustrations** — show a friendly placeholder when no project or song is loaded | None | Improves first-run experience |

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Bundler | Vite 8 |
| Styling | Plain CSS (custom properties for theming) |
| Icons | Lucide React |
| Local DB | Dexie.js (IndexedDB wrapper) |
| Syntax | ChordMD (custom Markdown-like format) |

---

## Project structure

```
src/
├── components/
│   ├── feature/
│   │   ├── Editor/          # ChordMD textarea + syntax highlighting
│   │   ├── HelpModal/       # ChordMD syntax reference
│   │   ├── MenuFile/        # New / Open / Save / Print toolbar
│   │   ├── MenuView/        # Theme + layout switches
│   │   ├── Preview/         # Paginated page preview
│   │   ├── Project/         # Sidebar song list
│   │   └── Settings/        # Page + text settings dialog
│   ├── layout/
│   │   ├── Header/          # Logo + menu bar
│   │   └── Main/            # Editor ↔ Preview split layout
│   └── ui/                  # Reusable primitives (Button, Modal, Panel, etc.)
├── hooks/                   # useFileImport, useViewSettings
├── lib/
│   ├── import/              # .colyrics & .chordmd parsers
│   ├── paginator/           # DOM-based page breakpoint calculator
│   ├── parser/              # ChordMD → AST
│   ├── renderer/            # AST → HTML
│   ├── save/                # File System Access API + download fallback
│   └── syntax-highlight/    # Editor token colouring
├── models/                  # Dexie DB schema + settings/recent CRUD
├── config.js                # Defaults & constants
├── context.js               # React contexts (project, view)
└── main.jsx                 # Entry point
```

---

## Getting started

```bash
# Install dependencies
yarn

# Start dev server (hot-reload)
yarn dev

# Production build
yarn build

# Preview production build locally
yarn preview
```

Open `http://localhost:5173` — the app loads with a blank project. Use
**File → Open** to import a `.colyrics` or `.chordmd` file, or start typing
directly in the editor.

---

## File formats

### `.chordmd` (single song)

A plain-text format where chords are written inline inside square brackets
above the corresponding syllable. Section headings use `###` and comments
use `//`. Chorus / highlighted blocks are prefixed with `>`.

```chordmd
# Amazing Grace
## Key: G
## Artist: John Newton

### Verse 1
[G]Amazing grace, how [C]sweet the [G]sound
That saved a wretch like [D]me

### Chorus
> [G]Grace will lead me [C]home
> [G]Grace will lead me [D]home
```

### `.colyrics` (full project)

A JSON file bundling multiple songs with shared page and text settings. This
is the portable project format — share a single file with your whole band.

```json
{
  "title": "Sunday Service",
  "settings": {
    "text": { "fontFamily": "Arial", "fontSize": 12, "lineHeight": 1.5 },
    "page": {
      "width": "210mm", "height": "297mm",
      "marginTop": "20mm", "marginRight": "20mm",
      "marginBottom": "20mm", "marginLeft": "20mm"
    }
  },
  "songs": [
    {
      "title": "Amazing Grace",
      "content": "# Amazing Grace\n## Key: G\n\n### Verse 1\n[G]Amazing grace..."
    }
  ]
}
```

---

## Future (post v1.0)

After the v1.0 essentials land, these are planned for subsequent releases:

- **Chord transposition** — shift all chords by N semitones, with capo awareness
- **Chord suggestion** — predict likely next chords based on the current key and previous patterns
- **Setlist export** — export all songs in a project as a single print-ready PDF
- **Mobile layout** — responsive single-column view for phones and tablets
- **i18n** — UI translations (Portuguese, Spanish)

---

## License

MIT
