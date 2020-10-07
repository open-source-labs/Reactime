/* eslint-disable max-len */
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
  snapshot: Record<number,
  { name?: string; componentData?: Record<string, unknown>;
    state?: Record<string, unknown>; stateSnaphot?: Record<string, unknown>; children?: unknown[]; 
    AtomsRelationship?: any[]
  }
  > ;
  AtomsRelationship?: any[];
  hierarchy:Record<string, unknown>;
  snapshots:[];
  viewIndex:number;
}

// eslint-disable-next-line react/prop-types
const StateContainer = (props:StateContainerProps): unknown => {
  const {
    snapshot, hierarchy, snapshots, viewIndex,
  } = props;
  const [Text, setText] = useState('State');

  console.log(props)
  
  return (
    <Router>
      <div className="state-container">
        <div className="main-navbar-container">
          <div className="main-navbar-text">{Text}</div>
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
            render={() => {
              setText('Diff');
              return <DiffRoute snapshot={snapshot} />;
            }}
          />
          <Route
            path="/"
            render={() => {
              setText('State');
              return <StateRoute viewIndex={viewIndex} snapshot={snapshot} hierarchy={hierarchy} snapshots={snapshots} />;
            }}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default StateContainer;
