import React from 'react';
import Select from 'react-select';
import { useStoreContext } from '../store';
import { setTab } from '../actions/actions';

const SwitchAppDropdown = (): JSX.Element => {
  const [{ currentTab, tabs }, dispatch] = useStoreContext();

  const tabsArray: {}[] = [];
  Object.keys(tabs).forEach((tab) => {
    tabsArray.unshift({ value: tab, label: tabs[tab].title });
  });

  const currTab: {} = {
    value: currentTab,
    label: tabs[currentTab].title,
  };

  const customStyles: {} = {
    menu: (provided, state):{} => {
      const outline: string = state.isSelected ? 'transparent' : 'transparent';
      const margin: number = 0;

      return { ...provided, outline, margin };
    },
  };

  return (
    <Select
      className='tab-select-container'
      classNamePrefix='tab-select'
      value={currTab}
      styles={customStyles}
      onChange={(e): void => {
        dispatch(setTab(parseInt(e.value, 10)));
      }}
      options={tabsArray}
    />
  );
};

export default SwitchAppDropdown;
