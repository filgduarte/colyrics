import { CircleQuestionMark } from 'lucide-react';
import Button from '../Button';
import './style.css';

export default function HelpFile() {
    return (
        <div id="menu-help" className="app-menu">
            <Button icon={CircleQuestionMark} title="Open" iconOnly onClick={() => alert('Help')} />
        </div>
    );
}