// @ts-nocheck
import React, { useState } from 'react';
/* <Router> that keeps the history of your “URL” in memory (does not read/write to the address bar)
 Useful in tests and non-browser environments like React Native.
*/
import { MemoryRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import StateRoute from '../components/StateRoute/StateRoute';
import DiffRoute from '../components/DiffRoute';
import { StateContainerProps } from '../FrontendTypes';

// eslint-disable-next-line react/prop-types
const StateContainer = (props: StateContainerProps): JSX.Element => {
  const { 
    snapshot, // from 'tabs[currentTab]' object from 'MainContainer'
    hierarchy, // from 'tabs[currentTab]' object from 'MainContainer'
    snapshots, // from 'tabs[currentTab].snapshotDisplay' object from 'MainContainer'
    viewIndex, // from 'tabs[currentTab]' object from 'MainContainer'
    webMetrics, // from 'tabs[currentTab]' object from 'MainContainer'
    currLocation // from 'tabs[currentTab]' object from 'MainContainer'
  } = props;

  return (
    <Router>
      <div className='state-container'>
        <div className='main-navbar-container'>
          <div className='main-navbar-text' />
          <div className='main-navbar'>
            <NavLink className='main-router-link' activeClassName='is-active' exact to='/'>
              State
            </NavLink>
            <NavLink className='main-router-link' activeClassName='is-active' to='/diff'>
              Diff
            </NavLink>
          </div>
        </div>
        <Switch>
          <Route path='/diff' render={() => <DiffRoute snapshot={snapshot} />} />
          <Route
            path='/'
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
        </Switch>
      </div>
    </Router>
  );
};

export default StateContainer;
