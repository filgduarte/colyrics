import { Download, File, FolderOpen, Printer, Settings } from 'lucide-react';
import { useContext, useCallback, useState } from 'react';
import { ProjectContext } from '../../../context';
import useFileImport from '../../../hooks/useFileImport';
import { saveProject, saveSong } from '../../../lib/save';
import SplitButton from '../../ui/SplitButton';
import Button from '../../ui/Button';
import Separator from '../../ui/Separator';
import SettingsDialog from '../Settings';
import './style.css';

export default function MenuFile() {
    const { project, setProject, currentSongIndex } = useContext(ProjectContext);
    const { openFilePicker } = useFileImport(project, setProject);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
                title="Print"
                icon={Printer}
                onClick={() => window.dispatchEvent(new CustomEvent('colyrics:print'))}
            />
            <Separator />
            <Button title="Settings" icon={Settings} onClick={() => setIsSettingsOpen(true)} />
            <SettingsDialog
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
