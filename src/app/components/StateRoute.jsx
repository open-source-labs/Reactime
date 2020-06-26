import React from 'react';
import PropTypes from 'prop-types';
import {
  MemoryRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';

import Chart from './Chart';
import Tree from './Tree';

// eslint-disable-next-line react/prop-types

const StateRoute = ({ snapshot, hierarchy }) => {
  // gabi :: the hierarchy get set on the first click in the page, when page in refreshed we don't have a hierarchy so we need to check if hierarchy was initialize involk render chart  
  const renderChart = () =>{ 
    if (hierarchy){
      return <Chart hierarchy={hierarchy} />
    }
    else{
      return <div className='noState'> No state change detected. Trigger an event to change state </div>;
    }
  }

  // gabi :: the snapshot get set on the first click in the page, when page in refreshed we don't have a hierarchy so we need to check if snapshot was initialize involk render chart 
  const renderTree = () => { 
    if (hierarchy){
      return <Tree snapshot={snapshot} />
    }
    else{
      return <div className='noState'> No state change detected. Trigger an event to change state </div>;
    }
  }

  return (
  <Router>
    <div className="navbar">
      <NavLink className="router-link" activeClassName="is-active" exact to="/">
        Tree
      </NavLink>
      <NavLink className="router-link" activeClassName="is-active" to="/chart">
        Chart
      </NavLink>
    </div>
    <Switch>
      <Route path="/chart" render={renderChart} />
      <Route path="/" render={renderTree} />
    </Switch>
  </Router>
)};

StateRoute.propTypes = {
  snapshot: PropTypes.shape({
    state: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default StateRoute;
