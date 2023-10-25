import React from 'react';
import Select from 'react-select';
import { DropdownProps } from '../FrontendTypes';

/*
  Allows the user to change the speed of the time-travel based on the selected dropdown value
  Component is created in the TravelContainer.tsx
*/

const Dropdown = (props: DropdownProps): JSX.Element => {
  const { speeds, setSpeed, selectedSpeed } = props;
  return (
    <Select
      className='react-select-container'
      classNamePrefix='react-select'
      value={selectedSpeed} // the text displayed will be based on the currently selected speed
      onChange={setSpeed} // allows the speed to change upon selection
      options={speeds} // custom speed options that are visible to the user
      menuPlacement='top'
    />
  );
};

export default Dropdown;
