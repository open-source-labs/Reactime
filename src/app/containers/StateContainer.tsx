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
      AtomsRelationship?: any[];
      atomSelectors?: object;
      atomsComponents?: object;
    }
  >;
  toggleActionContainer?: any;
  AtomsRelationship?: any[];
  hierarchy: Record<string, unknown>;
  snapshots: [];
  viewIndex: number;
  
}

// eslint-disable-next-line react/prop-types
const StateContainer = (props: StateContainerProps): JSX.Element => {
  const { snapshot, hierarchy, snapshots, viewIndex, toggleActionContainer } = props;
  const [Text, setText] = useState('State');

  return (
    <Router>
      <div className="state-container">
        <div className="main-navbar-container">
          <div className="main-navbar-text">{Text}</div>
          <div className="main-navbar">
            <button  className="toggleAC" onClick={()=> toggleActionContainer()}>View Time Travel</button>
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
            render={() => {
              setText('Diff');
              return <DiffRoute snapshot={snapshot} />;
            }}
          />
          <Route
            path="/"
            render={() => {
              setText('State');
              return (
                <StateRoute
                  viewIndex={viewIndex}
                  snapshot={snapshot}
                  hierarchy={hierarchy}
                  snapshots={snapshots}
                />
              );
            }}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default StateContainer;
