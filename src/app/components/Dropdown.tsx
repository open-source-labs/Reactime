// @ts-nocheck
import React from 'react';
import Select from 'react-select';

interface DropdownProps {
  selectedSpeed: { value: number; label: string },
  speeds: { value: number; label: string; }[];
  setSpeed: () => void;
}

const Dropdown = (props: DropdownProps): JSX.Element => {
  const { speeds, setSpeed, selectedSpeed } = props;
  return (
    <Select
      className="react-select-container"
      classNamePrefix="react-select"
      value={selectedSpeed}
      onChange={setSpeed}
      options={speeds}
      menuPlacement="top"
    />
  );
};

export default Dropdown;
