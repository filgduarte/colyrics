import { useMemo } from 'react';
import './style.css';

export default function RadioSwitch({ options, ...props }) {
    const selectedIndex = useMemo(() => 
        options.findIndex(({ value }) => value === props.value),
        [options, props.value]
    );

    return (
        <div className={`radio-switch ${props.className ?? ''}`}>
            <div
                className="radio-switch-slider"
                style={{ transform: `translateX(${selectedIndex * 100}%)` }}
            />
            {options.map(({ value: optValue, label, icon: Icon, iconOnly }) => (
                <div key={optValue} className={`radio-switch-option ${props.value === optValue ? 'selected' : ''}`}>
                    <label title={label} className='radio-switch-label' htmlFor={`${props.name}-${optValue}`}>
                        {
                            Icon && (
                            <Icon
                                size={props.iconSize ?? 16}
                            />
                        )}
                        {!iconOnly && <span>{label}</span>}
                    </label>
                    <input
                        id={`${props.name}-${optValue}`}
                        type="radio"
                        name={props.name}
                        title={label}
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