// @ts-nocheck
import React, { useState } from 'react';
/* <Router> that keeps the history of your “URL” in memory (does not read/write to the address bar)
 Useful in tests and non-browser environments like React Native.
*/
import { MemoryRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import StateRoute from '../components/StateRoute/StateRoute';
import DiffRoute from '../components/DiffRoute';
import { StateContainerProps } from '../FrontendTypes';

// eslint-disable-next-line react/prop-types
const StateContainer = (props: StateContainerProps): JSX.Element => {
  const {
    snapshot, // from 'tabs[currentTab]' object in 'MainContainer'
    hierarchy, // from 'tabs[currentTab]' object in 'MainContainer'
    snapshots, // from 'tabs[currentTab].snapshotDisplay' object in 'MainContainer'
    viewIndex, // from 'tabs[currentTab]' object in 'MainContainer'
    webMetrics, // from 'tabs[currentTab]' object in 'MainContainer'
    currLocation, // from 'tabs[currentTab]' object in 'MainContainer'
  } = props;

  return (
    <div className='state-container'>
      <div className='main-navbar-container'>
        <div className='main-navbar-text' />
        <div className='main-navbar'>
          <NavLink className='main-router-link' end to='/'>
            State
          </NavLink>
          <NavLink className='main-router-link' to='/diff'>
            Diff
          </NavLink>
        </div>
      </div>
      <Routes>
        <Route exact path='/diff' render={() => <DiffRoute snapshot={snapshot} />} />
        <Route
          exact path='/'
          render={() => (
            <StateRoute
              webMetrics={webMetrics}
              viewIndex={viewIndex}
              snapshot={snapshot}
              hierarchy={hierarchy}
              snapshots={snapshots}
              currLocation={currLocation}
            />
          )}
        />
      </Routes>
    </div>
  );
};

export default StateContainer;
