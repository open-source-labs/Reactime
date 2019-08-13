import React from 'react';
import SwitchAppDropdown from '../components/SwitchApp';
import { useStoreContext } from '../store';


function HeadContainer() {
  const [store] = useStoreContext();
  const { tabs, currentTab } = store;
  const { title } = tabs[currentTab];
  return (
    <div className="head-container">
      <SwitchAppDropdown />
      <div>
        {title}
      </div>
    </div>
  );
}

export default HeadContainer;
