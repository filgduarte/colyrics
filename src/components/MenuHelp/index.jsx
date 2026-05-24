import { CircleQuestionMark } from 'lucide-react';
import Button from '../Button';
import './style.css';

export default function HelpFile() {
    return (
        <div className="menu-help">
            <Button icon={CircleQuestionMark} title="Open" iconOnly onClick={() => alert('Help')} />
        </div>
    );
}