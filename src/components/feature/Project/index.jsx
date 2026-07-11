import { useContext, useCallback, useRef, useState } from 'react';
import { NotebookText, Plus, Trash2, GripVertical } from 'lucide-react';
import { ProjectContext } from '../../../context';
import Panel from '../../ui/Panel';
import './style.css';

export default function Project() {
    const { project, setProject, currentSongIndex, setCurrentSongIndex } = useContext(ProjectContext);
    const { songs } = project;

    /**
     * Moves the song at `fromIndex` to `toIndex` in the songs array.
     * `toIndex` is the target position in the original array (before removal).
     * Adjusts `currentSongIndex` to follow the moved song.
     */
    const reorderSongs = useCallback((fromIndex, toIndex) => {
        setProject(prev => {
            const updated = [...prev.songs];
            const [moved] = updated.splice(fromIndex, 1);
            // toIndex is the position in the original array; adjust for removal
            const insertAt = fromIndex < toIndex ? toIndex - 1 : toIndex;
            updated.splice(insertAt, 0, moved);
            return { ...prev, songs: updated };
        });

        setCurrentSongIndex(prev => {
            if (prev === fromIndex) {
                // Current song was moved — follow it
                return fromIndex < toIndex ? toIndex - 1 : toIndex;
            }
            if (fromIndex < prev && toIndex > prev) {
                // An item from before was moved after — current shifts left
                return prev - 1;
            }
            if (fromIndex > prev && toIndex <= prev) {
                // An item from after was moved before — current shifts right
                return prev + 1;
            }
            return prev;
        });
    }, [setProject, setCurrentSongIndex]);

    // Drag-and-drop state
    const dragIndex = useRef(null);
    const dragOverIndexRef = useRef(null);
    const [dragOverIndex, setDragOverIndex] = useState(null); // only for visual re-renders

    const handleAddSong = useCallback(() => {
        const newSong = { id: crypto.randomUUID(), title: 'Untitled', content: '' };
        setProject(prev => ({
            ...prev,
            songs: [...prev.songs, newSong],
        }));
        setCurrentSongIndex(songs.length);
    }, [songs.length, setProject, setCurrentSongIndex]);

    const handleSelectSong = useCallback((index) => {
        setCurrentSongIndex(index);
    }, [setCurrentSongIndex]);

    const handleDeleteSong = useCallback((index, e) => {
        e.stopPropagation();
        if (songs.length <= 1) return;

        const confirmed = window.confirm('Are you sure you want to delete this song?');
        if (!confirmed) return;

        setProject(prev => ({
            ...prev,
            songs: prev.songs.filter((_, i) => i !== index),
        }));

        setCurrentSongIndex(prev => {
            if (prev === index) {
                return Math.min(index, songs.length - 2);
            }
            return prev > index ? prev - 1 : prev;
        });
    }, [songs.length, setProject, setCurrentSongIndex]);

    // --- Drag-and-drop handlers ---

    const handleDragStart = useCallback((e, index) => {
        dragIndex.current = index;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        requestAnimationFrame(() => {
            e.target.classList.add('dragging');
        });
    }, []);

    const handleDragOver = useCallback((e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (dragIndex.current === null || dragIndex.current === index) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const mid = rect.height / 2;

        // Determine target insertion index
        const targetIndex = y < mid ? index : index + 1;

        // Avoid setting the same index
        if (dragIndex.current === targetIndex || dragIndex.current === targetIndex - 1) {
            dragOverIndexRef.current = null;
            setDragOverIndex(null);
            return;
        }

        dragOverIndexRef.current = targetIndex;
        setDragOverIndex(targetIndex);
    }, []);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleDragLeave = useCallback((e) => {
        // Only clear state when leaving the list item entirely
        if (!e.currentTarget.contains(e.relatedTarget)) {
            // Don't clear here — let dragOver on the next item handle it
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const fromIndex = dragIndex.current;
        const toIndex = dragOverIndexRef.current;
        dragIndex.current = null;
        dragOverIndexRef.current = null;

        if (fromIndex === null || toIndex === null || fromIndex === toIndex) {
            setDragOverIndex(null);
            return;
        }

        reorderSongs(fromIndex, toIndex);
        setDragOverIndex(null);
    }, [reorderSongs]);

    const handleDragEnd = useCallback((e) => {
        e.target.classList.remove('dragging');
        dragIndex.current = null;
        dragOverIndexRef.current = null;
        setDragOverIndex(null);
    }, []);

    // --- CSS class helper ---

    const getItemClassName = (index) => {
        const classes = ['project-item'];
        if (index === currentSongIndex) classes.push('active');
        if (dragOverIndex !== null && index === dragOverIndex) classes.push('drop-target');
        return classes.join(' ');
    };

    const handleTitleChange = useCallback((e) => {
        setProject(prev => ({ ...prev, title: e.target.value }));
    }, [setProject]);

    const headerAction = (
        <button
            className="project-new-song-btn"
            onClick={handleAddSong}
            title="New Song"
        >
            <Plus size={16} />
        </button>
    );

    return (
        <Panel title="Project" icon={NotebookText} actions={headerAction}>
            <div className="project-title-field">
                <input
                    type="text"
                    className="project-title-input"
                    value={project.title}
                    onChange={handleTitleChange}
                    placeholder="Project title"
                />
            </div>
            <ol
                className="project-list"
                onDragOver={(e) => {
                    // Allow dropping on the list itself (e.g. on indicators)
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={handleDrop}
            >
                {/* Drop indicator at the top */}
                {dragOverIndex === 0 && <li className="project-drop-indicator" />}

                {songs.map((song, index) => (
                    <li
                        key={index}
                        className={getItemClassName(index)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleSelectSong(index)}
                    >
                        <span className="project-item-grip" title="Drag to reorder">
                            <GripVertical size={14} />
                        </span>
                        <span className="project-item-title">
                            <span className="project-item-index">
                                {index + 1}.
                            </span>
                            {song.title}
                        </span>
                        <button
                            className="project-item-delete"
                            onClick={(e) => handleDeleteSong(index, e)}
                            title="Delete song"
                        >
                            <Trash2 size={14} />
                        </button>
                    </li>
                ))}

                {/* Invisible drop target at the bottom */}
                {dragOverIndex === songs.length && <li className="project-drop-indicator" />}
            </ol>
        </Panel>
    );
}
