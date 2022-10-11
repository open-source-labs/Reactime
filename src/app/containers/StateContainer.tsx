// @ts-nocheck
import React, { useState } from 'react';
import {
  MemoryRouter as Router,
  Route,
  NavLink,
  Switch,
} from 'react-router-dom';
import StateRoute from '../components/StateRoute';
import DiffRoute from '../components/DiffRoute';
interface StateContainerProps {
  snapshot: Record<
    number,
    {
      name?: string;
      componentData?: Record<string, unknown>;
      state?: Record<string, unknown>;
      stateSnaphot?: Record<string, unknown>;
      children?: unknown[];
    }
  >;
  toggleActionContainer?: any;
  webMetrics?: object;
  hierarchy: Record<string, unknown>;
  snapshots?: [];
  viewIndex?: number;
  currLocation?: object;
}

// eslint-disable-next-line react/prop-types
const StateContainer = (props: StateContainerProps): JSX.Element => {
  const {
    snapshot,
    hierarchy,
    snapshots,
    viewIndex,
    webMetrics,
    currLocation,
    snapshots,
  } = props;

  return (
    <Router>
      <div className="state-container">
        <div className="main-navbar-container">
          <div className="main-navbar-text" />
          <div className="main-navbar">
            <NavLink
              className="main-router-link"
              activeClassName="is-active"
              exact
              to="/"
            >
              State
            </NavLink>
            <NavLink
              className="main-router-link"
              activeClassName="is-active"
              to="/diff"
            >
              Diff
            </NavLink>
          </div>
        </div>
        <Switch>
          <Route
            path="/diff"
            render={() => <DiffRoute snapshot={snapshot} />}
          />
          <Route
            path="/"
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
