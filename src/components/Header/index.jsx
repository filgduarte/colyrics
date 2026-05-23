import { useViewSettings } from './hooks/useViewSettings.js'

export default function Header() {
    const { view, changeTheme, changeLayout } = useViewSettings();
    // Exemplo de troca de tema/layout

    return (
        <header className="app-header">
            <div className="logo"></div>
            <div className="file-menu"></div>
            <div className="view-menu">
                <button onClick={() => changeLayout(view.layout === 'sideToSide' ? 'stacked' : 'sideToSide')}>
                    Trocar layout
                </button>
                <button onClick={() => changeTheme(view.theme === 'light' ? 'dark' : 'light')}>
                    Trocar tema
                </button>
            </div>
        </header>
    )
}