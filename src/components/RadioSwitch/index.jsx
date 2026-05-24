import './style.css';

export default function RadioSwitch({ options, ...props }) {
    return (
        <div className={`radio-switch ${props.className ?? ''}`}>
        {options.map(({ value: optValue, label, icon: Icon }) => (
            <div key={optValue} className={`radio-switch-option ${props.value === optValue ? 'selected' : ''}`}>
                <label title={label} className='radio-switch-label'>
                    {
                        Icon && (
                        <Icon
                            size={props.iconSize ?? 16}
                        />
                    )}
                    {props.iconOnly !== true && <span>{props.label}</span>}
                </label>
                <input
                    type="radio"
                    name={props.name}
                    value={optValue}
                    className='radio-switch-input'
                    checked={props.value === optValue}
                    onChange={() => props.onChange(optValue)}
                />
            </div>
        ))}
        </div>
    );
}