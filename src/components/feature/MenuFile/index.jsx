import { BookOpenText, Download, File, FolderOpen, Settings } from 'lucide-react';
import { useContext, useCallback } from 'react';
import { ProjectContext } from '../../../context';
import useFileImport from '../../../hooks/useFileImport';
import { saveProject, saveSong } from '../../../lib/save';
import SplitButton from '../../ui/SplitButton';
import Button from '../../ui/Button';
import Separator from '../../ui/Separator';
import './style.css';

export default function MenuFile() {
    const { project, setProject, currentSongIndex } = useContext(ProjectContext);
    const { openFilePicker } = useFileImport(project, setProject);

    const handleSaveProject = useCallback(() => {
        saveProject(project);
    }, [project]);

    const handleSaveSong = useCallback(() => {
        const currentSong = project.songs[currentSongIndex];
        if (currentSong) {
            saveSong(currentSong);
        }
    }, [project, currentSongIndex]);

    return (
        <div id="menu-file" className="app-menu">
            <Button title="New" icon={File} onClick={() => alert('New file')} />
            <Button title="Open" icon={FolderOpen} onClick={openFilePicker} />
            <SplitButton
                title="Save"
                icon={Download}
                onClick={handleSaveProject}
                options={[
                    {
                        label: 'Save project',
                        onClick: handleSaveProject,
                    },
                    {
                        label: 'Save song',
                        onClick: handleSaveSong,
                    },
                ]}
            />
            <Button
                title="Export as PDF"
                icon={BookOpenText}
                onClick={() => alert('Export as PDF')}
            />
            <Separator />
            <Button title="Settings" icon={Settings} onClick={() => alert('Settings')} />
        </div>
    );
}
