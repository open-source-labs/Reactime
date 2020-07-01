import React from 'react';
import Select from 'react-select';
import { useStoreContext } from '../store';
import { setTab } from '../actions/actions';


const SwitchAppDropdown = () => {
  const [{ currentTab, tabs }, dispatch] = useStoreContext();
  console.log('tabs object -->', tabs);
  
  const tabsArray = [];
  Object.keys(tabs).forEach(tab => {
    tabsArray.push({ value: tab, label: tabs[tab].title });
  });
  console.log('tabs object -->', tabsArray);

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
