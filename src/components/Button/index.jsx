import './style.css';

export default function Button({ icon: Icon, ...props }) {
    return (
        <button title={props.title} onClick={props.onClick} className={`button ${props.className ?? ''}`}>
            {
                Icon && (
                <Icon
                    size={props.iconSize ?? 16}
                />
            )}
            {props.iconOnly !== true && <span>{props.title}</span>}
        </button>
    );
}