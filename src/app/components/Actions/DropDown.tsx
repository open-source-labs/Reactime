import Select from 'react-select';
import React, { useEffect, useState } from 'react';

interface DropDownProps {
    onChange: (selectedHook: string) => void;
}

const DropDown = ({onChange}: DropDownProps): JSX.Element => {
    
    const options = [
    {value: 'useState', label: 'useState'},
    {value: 'useReducer', label: 'useReducer'}, 
    {value: 'useContext', label: 'useContext'}
];
    const handleChange = (selectedHook: {value:string; label: string} | null) => {
        onChange(selectedHook.value);
    }



    return (
        <Select 
        placeholder = 'Select Hook'
        onChange={handleChange}
        options = {options}
        /> 
    )
}
export default DropDown;