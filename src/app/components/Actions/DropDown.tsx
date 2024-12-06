import Select from 'react-select';
import React from 'react';

const DropDown = ({ dropdownSelection, setDropdownSelection }: { dropdownSelection: string; setDropdownSelection: (value: string) => void }): JSX.Element => {
  const handleChange = (selected: { value: string; label: string }) => {
    setDropdownSelection(selected.value); 
  };

  const options = [
    { value: 'TimeJump', label: 'TimeJump' },
    { value: 'Provider/Consumer', label: 'Provider/Consumer' },
  ];

  return (
    <Select
      placeholder="Select Hook"
      onChange={handleChange}
      options={options}
      value={options.find((option) => option.value === dropdownSelection)}
    />
  );
};

export default DropDown;
