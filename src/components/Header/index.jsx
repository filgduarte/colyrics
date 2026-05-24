import MenuFile from '../MenuFile';
import MenuView from '../MenuView';
import MenuHelp from '../MenuHelp';
import './style.css';

export default function Header() {
    return (
        <header className="app-header">
            <div className="logo">
                <img src="./logo.svg" alt="Colyrics" />
            </div>
            <MenuFile />
            <MenuView />
            <MenuHelp />
        </header>
    );
}