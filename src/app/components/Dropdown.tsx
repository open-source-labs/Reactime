import React from 'react';
import Select from 'react-select';
import { DropdownProps } from '../FrontendTypes'

const Dropdown = (props: DropdownProps): JSX.Element => {
  const { speeds, setSpeed, selectedSpeed } = props;
  return (
    <Select
      className='react-select-container'
      classNamePrefix='react-select'
      value={selectedSpeed}
      onChange={setSpeed}
      options={speeds}
      menuPlacement='top'
    />
  );
};

export default Dropdown;
