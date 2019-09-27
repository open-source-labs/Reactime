import React from 'react'; 
import Select from 'react-select'; 

// SwitchStateDropdown should display options including all 
// and specific states being used
    // TODO: Need to get the getter name (for functional components) 
    // and state name for stateful components 
const SwitchStateDropdown = () => {
    // Requirements: 
        // Should be able to filter the Actions by the name of the state being changed
        // Should consider how to import the state names being changed 
        // Should display the "All state", as well as specific state names as the options
        // When clicked on "All state" >> should display all Actions
        // When clicked on a specific "state" >> should only display Actions corresponding to the state

    const sampleDropdown = [
        {label: 'Overview'}, 
        {label: 'setUsername'}, 
        {label: 'setPassword'}
    ]; 

    return (
        <Select 
        className="state-dropdown" 
        placeholder="Choose your state" 
        options={sampleDropdown}
        />
    )
}

export default SwitchStateDropdown; 