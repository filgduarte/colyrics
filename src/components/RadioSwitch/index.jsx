import './style.css';

export default function RadioSwitch({ options, ...props }) {
    return (
        <div className={`radio-switch ${props.className ?? ''}`}>
        {options.map(({ value: optValue, label, icon: Icon }) => (
            <label key={optValue} className={`radio-option ${props.value === optValue ? 'selected' : ''}`}>
                <input
                    type="radio"
                    name={props.name}
                    value={optValue}
                    checked={props.value === optValue}
                    onChange={() => props.onChange(optValue)}
                />
                {Icon && <Icon />}
                {label && <span>{label}</span>}
            </label>
        ))}
        </div>
    );
}