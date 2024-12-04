import Select from 'react-select';
import React, { useEffect, useState } from 'react';

const DropDown = (): JSX.Element => {
    const [hook, setHook] = useState('useState');

    const handleChange = (selectedHook: {hooks:string}) => {
        setHook(selectedHook);
    }

const options = [
    {value: 'useState', label: 'useState'},
    {value: 'useReducer', label: 'useReducer'}, 
    {value: 'useContext', label: 'useContext'}
];

    return (
        <Select 
        placeholder = 'Select Hook'
        onChange={handleChange}
        options = {options}
        /> 
    )
}
export default DropDown;