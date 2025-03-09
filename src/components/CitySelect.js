import { useState, useRef, useEffect } from 'react';
import styles from './CitySelect.module.css';

export default function CitySelect({ value, onChange, options, placeholder }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
    };

    const filteredOptions = options.filter(city => 
        city.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <input
                type="text"
                className={styles.input}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
            />
            {isOpen && filteredOptions.length > 0 && (
                <div className={styles.dropdown}>
                    {filteredOptions.map((city, index) => (
                        <div
                            key={index}
                            className={styles.option}
                            onClick={() => {
                                setInputValue(city);
                                onChange(city);
                                setIsOpen(false);
                            }}
                        >
                            {city}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 