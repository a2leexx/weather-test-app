import { useEffect, useState } from 'react';

import styles from './Checkbox.module.css';

export interface CheckboxProps {
    value?: boolean;
    onChange?: (newValue: boolean) => void;
}

export const Checkbox = ({ value, onChange }: CheckboxProps) => {
    const [isChecked, setIsChecked] = useState<boolean>(value ?? false);

    useEffect(() => {
        setIsChecked(value ?? false);
    }, [value]);

    const onCheckboxChange = () => {
        onChange?.(!isChecked);
        setIsChecked(isChecked => !isChecked);
    };

    return (
        <input
            className={styles.checkbox}
            checked={isChecked} onChange={onCheckboxChange}
            type="checkbox"
        />
    );
};