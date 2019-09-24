import React from 'react'; 
import Select from 'react-select'; 

// SwitchStateDropdown should display options including all 
// and specific states being used
    // TODO: Need to get the getter name (for functional components) 
    // and state name for stateful components 
const SwitchStateDropdown = props => {
    // Requirements: 
        // Need to be able to filter by state name 
        // The way state name gets imported needs to be checked 
    return (
        <Select className="state-dropdown" 
        placeholder="Choose your state" 
        options={}
        />
    )
}

export default SwitchStateDropdown; 