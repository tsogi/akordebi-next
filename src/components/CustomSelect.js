import styles from './CustomSelect.module.css';

function CustomSelect({ value, onChange, options }){
    return <select className={`${styles.selectSort} text-[14px]`} value={value} onChange={onChange}>
        {
            options.map(option => <option value={option.value}>{option.label}</option>)
        }
    </select>
}

export default CustomSelect;