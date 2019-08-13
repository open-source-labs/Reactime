import React from 'react';
import SwitchAppDropdown from '../components/SwitchApp';
import { useStoreContext } from '../store';


function HeadContainer() {
  const [store] = useStoreContext();
  const { tabs, currentTab } = store;
  // eslint-disable-next-line prefer-destructuring
  const title = tabs[currentTab].title;
  // console.log('tabs', tabs);
  // console.log('currentTab', currentTab);
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
