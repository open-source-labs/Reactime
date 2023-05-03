import React from 'react';
import Select from 'react-select';
import { useStoreContext } from '../store';
import { setTab } from '../actions/actions';

const SwitchAppDropdown = () => {
  const [{ currentTab, tabs }, dispatch] = useStoreContext();

  const tabsArray: any[] = [];
  Object.keys(tabs).forEach((tab) => {
    tabsArray.unshift({ value: tab, label: tabs[tab].title });
  });

  const currTab = {
    value: currentTab,
    label: tabs[currentTab].title,
  };

  const customStyles = {
    menu: (provided, state) => {
      const outline = state.isSelected ? 'transparent' : 'transparent';
      const margin = 0;

      return { ...provided, outline, margin };
    },
  };
  console.log('currTab', currTab);
  console.log('customStyles', customStyles);
  console.log('tabsArray', tabsArray);

  return (
    <Select
      className='tab-select-container'
      classNamePrefix='tab-select'
      value={currTab}
      styles={customStyles}
      onChange={(e) => {
        dispatch(setTab(parseInt(e.value, 10)));
      }}
      options={tabsArray}
    />
  );
};

export default SwitchAppDropdown;
