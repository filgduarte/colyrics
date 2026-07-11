import { useContext } from 'react';
import { ViewContext } from '../../../context';
import MenuFile from '../../feature/MenuFile';
import MenuView from '../../feature/MenuView';
import './style.css';

export default function Header() {
    const { view } = useContext(ViewContext);
    return (
        <header id="app-header">
            <div id="app-logo">
                <img src={view.theme === 'dark' ? './logo-white.svg' : './logo.svg'} alt="Colyrics" />
            </div>
            <div id="app-menu">
                <MenuFile />
                <MenuView />
            </div>
        </header>
    );
}