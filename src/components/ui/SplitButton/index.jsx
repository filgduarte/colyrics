import { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './style.css';

export default function SplitButton({ icon: Icon, options = [], ...props }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);

    const toggleDropdown = useCallback((e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    }, []);

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, closeDropdown]);

    // Close dropdown on Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeDropdown();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeDropdown]);

    const handleOptionClick = useCallback((optionOnClick) => {
        closeDropdown();
        optionOnClick?.();
    }, [closeDropdown]);

    const handleOptionKeyDown = useCallback((e, optionOnClick) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOptionClick(optionOnClick);
        }
    }, [handleOptionClick]);

    return (
        <div
            ref={containerRef}
            className={`split-button ${props.className ?? ''}`}
        >
            <button
                title={props.title}
                onClick={props.onClick}
                className="split-button-main"
            >
                {Icon && <Icon size={props.iconSize ?? 16} />}
                {props.iconOnly !== true && <span>{props.title}</span>}
            </button>

            <button
                className="split-button-toggle"
                onClick={toggleDropdown}
                aria-label={`${props.title} options`}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <ChevronDown size={14} className={`split-button-chevron${isOpen ? ' open' : ''}`} />
            </button>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="split-button-dropdown"
                    role="menu"
                    aria-label={`${props.title} options`}
                >
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className="split-button-option"
                            onClick={() => handleOptionClick(option.onClick)}
                            onKeyDown={(e) => handleOptionKeyDown(e, option.onClick)}
                            role="menuitem"
                            tabIndex={0}
                        >
                            {option.icon && <option.icon size={16} />}
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
