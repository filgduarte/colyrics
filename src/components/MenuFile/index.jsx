import { BookOpenText, Download, File, FolderOpen, Settings } from 'lucide-react';
import Button from '../Button';
import Separator from '../Separator';
import './style.css';

export default function MenuFile() {
    return (
        <div id="menu-file" className="app-menu">
            <Button title="New" icon={File} onClick={() => alert('New file')} />
            <Button title="Open" icon={FolderOpen} onClick={() => alert('Open file')} />
            <Button title="Save" icon={Download} tonClick={() => alert('Save file')} />
            <Button title="Export as PDF" icon={BookOpenText} onClick={() => alert('Export as PDF')} />
            <Separator />
            <Button title="Settings" icon={Settings} onClick={() => alert('Settings')} />
        </div>
    );
}