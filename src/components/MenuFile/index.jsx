import { FolderOpen, BookOpenText, Download, Settings } from 'lucide-react';
import Button from '../Button';
import './style.css';

export default function MenuFile() {
    return (
        <div className="menu-file">
            <Button icon={FolderOpen} title="Open" onClick={() => alert('Open file')} />
            <Button icon={Download} title="Save" onClick={() => alert('Save file')} />
            <Button icon={BookOpenText} title="Export as PDF" onClick={() => alert('Export as PDF')} />
            <Button icon={Settings} title="Settings" onClick={() => alert('Settings')} />
        </div>
    );
}