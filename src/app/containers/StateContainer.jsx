import React from 'react';
import { MemoryRouter as Router, Route, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tree from '../components/Tree';
import Chart from '../components/Chart';

const StateContainer = ({ snapshot }) => (
  <Router>
    <div className="state-container">
      <div className="navbar">
        <NavLink className="router-link" activeClassName="is-active" to="/tree">
          Tree
        </NavLink>
        <NavLink className="router-link" activeClassName="is-active" to="/chart">
          Chart
        </NavLink>
      </div>
      <Route path="/tree" render={() => <Tree snapshot={snapshot} />} />
      <Route path="/chart" render={() => <Chart snapshot={snapshot} />} />
    </div>
  </Router>
);

StateContainer.propTypes = {
  snapshot: PropTypes.shape({
    state: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    children: PropTypes.arrayOf(
      PropTypes.object,
    ),
  }).isRequired,
};

export default StateContainer;
