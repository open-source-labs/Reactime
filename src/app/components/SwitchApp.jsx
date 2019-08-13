import React from 'react';
import Select from 'react-select';
import { useStoreContext } from '../store';
import { setTab } from '../actions/actions';

const SwitchAppDropdown = () => {
  // const { loadApp } = setTab;
  const [{ currentTab, tabs }, dispatch] = useStoreContext();

  const tabsArray = [];

  Object.keys(tabs).forEach((tab) => {
    tabsArray.push({ value: tab, label: tab });
  });

  const currTab = {
    value: currentTab,
    label: currentTab,
  };

  return (
    <Select
      className="react-select-container"
      classNamePrefix="react-select"
      value={currTab}
      onChange={(e) => {
        dispatch(setTab(parseInt(e.value, 10)));
      }}
      options={tabsArray}
    />
  );
};

export default SwitchAppDropdown;
