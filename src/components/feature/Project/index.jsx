import { useContext, useCallback } from 'react';
import { NotebookText, Plus, Trash2 } from 'lucide-react';
import { ProjectContext } from '../../../context';
import Panel from '../../ui/Panel';
import './style.css';

export default function Project() {
    const { project, setProject, currentSongIndex, setCurrentSongIndex } = useContext(ProjectContext);
    const { songs } = project;

    const handleAddSong = useCallback(() => {
        const newSong = { title: 'Untitled', content: '' };
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
            <ol className="project-list">
                {songs.map((song, index) => (
                    <li
                        key={index}
                        className={`project-item ${index === currentSongIndex ? 'active' : ''}`}
                        onClick={() => handleSelectSong(index)}
                    >
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
            </ol>
        </Panel>
    );
}
