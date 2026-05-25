import { BookOpenText, Download, File, FolderOpen, Settings } from 'lucide-react';
import { useContext } from 'react';
import { ProjectContext } from '../../../context';
import useFileImport from '../../../hooks/useFileImport';
import Button from '../../ui/Button';
import Separator from '../../ui/Separator';
import './style.css';

export default function MenuFile() {
    const { project, setProject } = useContext(ProjectContext);
    const { openFilePicker } = useFileImport(project, setProject);

    return (
        <div id="menu-file" className="app-menu">
            <Button title="New" icon={File} onClick={() => alert('New file')} />
            <Button title="Open" icon={FolderOpen} onClick={openFilePicker} />
            <Button title="Save" icon={Download} onClick={() => alert('Save file')} />
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
