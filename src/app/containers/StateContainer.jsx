import React from 'react';
import PropTypes from 'prop-types';
import {
  MemoryRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';
import Tree from '../components/Tree';
import Chart from '../components/Chart';
import Diff from '../components/Diff';

const StateContainer = ({ snapshot }) => (
  <Router>
    <div className="state-container">
      <div className="navbar">
        <NavLink className="router-link" activeClassName="is-active" exact to="/">
          Tree
        </NavLink>
        <NavLink className="router-link" activeClassName="is-active" to="/chart">
          Chart
        </NavLink>
        <NavLink className="router-link" activeClassName="is-active" to="/diff">
          Diff
        </NavLink>
      </div>
      <Switch>
        <Route path="/chart" render={() => <Chart snapshot={snapshot} />} />
        <Route path="/diff" render={() => <Diff snapshot={snapshot} />} />
        <Route path="/" render={() => <Tree snapshot={snapshot} />} />
      </Switch>
    </div>
  </Router>
);

StateContainer.propTypes = {
  snapshot: PropTypes.shape({
    state: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default StateContainer;
