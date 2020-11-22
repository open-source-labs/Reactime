/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import Select from 'react-select';
import { useStoreContext } from '../store';
import { setTab } from '../actions/actions';

const SwitchAppDropdown = () => {
  const [{ currentTab, tabs }, dispatch] = useStoreContext();

  const tabsArray:any[] = [];
  Object.keys(tabs).forEach(tab => {
    tabsArray.unshift({ value: tab, label: tabs[tab].title});
  });

  const currTab = {
    value: currentTab,
    label: tabs[currentTab].title,
  };

  return (
    <Select
      className="tab-select-container"
      classNamePrefix="tab-select"
      value={currTab}
      onChange={e => {
        dispatch(setTab(parseInt(e.value, 10)));
      }}
      options={tabsArray}
    />
  );
};

export default SwitchAppDropdown;
