import React from 'react';
import Select from 'react-select';
import { useStoreContext } from '../store';

const SwitchAppDropdown = () => {
  // const { selectedApp, loadApp, allApps } = props;
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
      // onChange={
      //   // setApp (like setSpeed in speed dropdown) goes here
      //   loadApp
      // }
      options={tabsArray}
    />
  );
};

export default SwitchAppDropdown;
