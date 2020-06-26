/* eslint-disable object-curly-newline */
import React from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter as Router, Route, NavLink, Switch } from 'react-router-dom';

import Chart from './Chart';
import Tree from './Tree';
import PerfView from './PerfView';

const NO_STATE_MSG = 'No state change detected. Trigger an event to change state';
// eslint-disable-next-line react/prop-types

const StateRoute = ({ snapshot, hierarchy }) => {
  // gabi :: the hierarchy get set on the first click in the page, when page in refreshed we don't have a hierarchy so we need to check if hierarchy was initialize involk render chart
  const renderChart = () => {
    if (hierarchy) {
      return <Chart hierarchy={hierarchy} />;
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  // gabi :: the snapshot get set on the first click in the page, when page in refreshed we don't have a hierarchy so we need to check if snapshot was initialize involk render chart
  const renderTree = () => {
    if (hierarchy) {
      return <Tree snapshot={snapshot} />;
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  const renderPerfView = () => {
    if (snapshot) {
      return <PerfView snapshot={snapshot} />;
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  return (
    <Router> 
      <div className="navbar">
        <NavLink className="router-link" activeClassName="is-active" exact to="/">
        State Tree
        </NavLink>
        <NavLink className="router-link" activeClassName="is-active" to="/chart">
        History
        </NavLink>
        <NavLink className="router-link" activeClassName="is-active" to="/performance">
        Performance
        </NavLink>
      </div>
      <Switch>
        <Route path="/chart" render={renderChart} />
        <Route path="/performance" render={renderPerfView} />
        <Route path="/" render={renderTree} />
      </Switch>
    </Router>
  );
};

StateRoute.propTypes = {
  snapshot: PropTypes.shape({
    state: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default StateRoute;
