import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

const Dropdown = (props) => {
  const { options, handleChangeSpeed, selectedOption } = props;
  return (
    <Select
      className="react-select-container"
      classNamePrefix="react-select"
      value={selectedOption}
      onChange={handleChangeSpeed}
      options={options}
      menuPlacement="top"
    />
  );
};

Dropdown.propTypes = {
  selectedOption: PropTypes.shape({ value: PropTypes.number, label: PropTypes.string }).isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleChangeSpeed: PropTypes.func.isRequired,
};

export default Dropdown;
