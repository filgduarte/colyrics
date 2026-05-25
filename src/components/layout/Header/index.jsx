import MenuFile from '../../feature/MenuFile';
import MenuView from '../../feature/MenuView';
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
            </div>
        </header>
    );
}