import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

const Dropdown = props => {
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

Dropdown.propTypes = {
  selectedSpeed: PropTypes.shape({ value: PropTypes.number, label: PropTypes.string }).isRequired,
  speeds: PropTypes.arrayOf(PropTypes.object).isRequired,
  setSpeed: PropTypes.func.isRequired,
};

export default Dropdown;
