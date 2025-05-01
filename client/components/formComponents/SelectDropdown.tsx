import React from 'react'

interface Item {
    title: string,
    value: string | number
}

interface SelectDropdownProps {
    value: string | number,
    setValue: (val: string | number | any) => void;
    className: string,
    options: Item[]
}

const SelectDropdown = (props: SelectDropdownProps) => {
    const { value, setValue, className, options } = props;

    const setData = (e: string | any) => {
        setValue(e.target.value)
    }

    return (
        <select className={className} value={value} onChange={(e) => setData(e)} >
            {options.map((item:Item) => (
                <option value={item.value}>{item.title}</option>
            ))}
        </select>
    )
}

export default SelectDropdown