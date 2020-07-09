import React, { useState } from 'react';
import {
  MemoryRouter as Router,
  Route,
  NavLink,
  Switch,
} from 'react-router-dom';
import StateRoute from '../components/StateRoute.tsx';
import DiffRoute from '../components/DiffRoute.tsx';

interface StateContainerProps {
  snapshot:{state?:object|string, children?:[]}; 
  hierarchy:object;
  snapshots:[]; 
  viewIndex:number;
}

// eslint-disable-next-line react/prop-types
const StateContainer = (props:StateContainerProps) => {
  const { snapshot, hierarchy, snapshots, viewIndex } = props
  const [Text, setText] = useState('State');
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
              return <StateRoute viewIndex={viewIndex} snapshot={snapshot} hierarchy={hierarchy} snapshots={snapshots}/>;
            }}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default StateContainer;
