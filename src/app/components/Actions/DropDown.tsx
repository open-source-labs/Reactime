import Select from 'react-select';
import React from 'react';

const DropDown = ({
  dropdownSelection,
  setDropdownSelection,
}: {
  dropdownSelection: string;
  setDropdownSelection: (value: string) => void;
}): JSX.Element => {
  const handleChange = (selected: { value: string; label: string }) => {
    setDropdownSelection(selected.value);
  };

  const options = [
    { value: 'Time Jump', label: 'Time Jump' },
    { value: 'Providers / Consumers', label: 'Providers / Consumers' },
  ];

  return (
    <div className='dropdown-container'>
      <Select
        placeholder='Select Hook'
        classNamePrefix='react-select'
        onChange={handleChange}
        options={options}
        value={options.find((option) => option.value === dropdownSelection)}
      />
    </div>
  );
};

export default DropDown;
