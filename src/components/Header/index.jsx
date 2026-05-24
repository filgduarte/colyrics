import MenuFile from '../MenuFile';
import MenuView from '../MenuView';
import MenuHelp from '../MenuHelp';
import './style.css';

export default function Header() {
    return (
        <header id="app-header">
            <div id="app-logo">
                <img src="./logo.svg" alt="Colyrics" />
            </div>
            <div id="app-menu">
                <MenuFile />
                <MenuView />
                <MenuHelp />
            </div>
        </header>
    );
}