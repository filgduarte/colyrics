import './style.css';

export default function Panel({icon: Icon, ...props}) {
    const id = props.title ? props.title.toLowerCase().replace(/\s+/g, '-') : undefined;

    return(
        <section id={id} className={`app-panel ${props.className ?? ''}`}>
            <header className="panel-header">
                <h2>
                    {
                        Icon && (
                        <Icon
                            size={props.iconSize ?? 16}
                        />
                    )}
                    {props.title}
                </h2>
                <div className="panel-header-actions">
                    {props.actions}
                </div>
            </header>
            <main className="panel-content">
                {props.children}
            </main>
            {props.footer && (
                <footer className="panel-footer">
                    {props.footer}
                </footer>
            )}
        </section>
    )
}