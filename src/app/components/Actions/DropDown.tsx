import Select from 'react-select';
import React, { useEffect, useState } from 'react';

const DropDown = (): JSX.Element => {
    // const [hook, setHook] = useState('useState');

    // const handleChange = (options: {value:string}) => {
    //     setHook(options.value);
    // }

const options = [
    {value: 'useState', label: 'useState'},
    {value: 'useReducer', label: 'useReducer'}, 
    {value: 'useContext', label: 'useContext'}
];

    return (
        <div>
             <Select 
        placeholder = 'Select Hook'
        // onChange={handleChange}
        options = {options}
        /> 
        {/* <p>Selected Hook: {hook}</p> */}
        </div>
       
    )
}
export default DropDown;