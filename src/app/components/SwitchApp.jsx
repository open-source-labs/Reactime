import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

const SwitchAppDropdown = (props) => {
  const { selectedApp, loadApp, apps } = props;
  return (
    <Select
      className="react-select-container"
      classNamePrefix="react-select"
      value={selectedApp}
      onChange={
        // setApp (like setSpeed in speed dropdown) goes here
        loadApp
      }
      options={apps}
    />
  );
};

SwitchAppDropdown.propTypes = {
  selectedApp: PropTypes.shape({ value: PropTypes.number, label: PropTypes.string }).isRequired,
  loadApp: PropTypes.func.isRequired,
  apps: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SwitchAppDropdown;
