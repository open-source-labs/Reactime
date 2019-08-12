import React from 'react';
import SwitchAppDropdown from '../components/SwitchApp';
import MainReducer from '../reducers/mainReducer';
import { statement } from '@babel/template';
import { useStoreContext } from '../store';

const appearance = {
  constainer: {
    width: '100px',
  },
};

// const tabs = s

function HeadContainer () {
  const [state, dispatch] = useStoreContext();

  console.log(state)

  // for (let tabs in statement.tabs){

  // }
  return (
    <div className="head-container">
      <SwitchAppDropdown style={appearance} />
    </div>
  )

}

export default HeadContainer;
