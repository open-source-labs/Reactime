/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import React from 'react';
import { MemoryRouter as Router, Route, NavLink, Switch } from 'react-router-dom';


const Chart = require('./Chart').default;
import Tree from './Tree';
import PerfView from './PerfView';
const ErrorHandler = require('./ErrorHandler').default;

const NO_STATE_MSG = 'No state change detected. Trigger an event to change state';
// eslint-disable-next-line react/prop-types


interface StateRouteProps {
  snapshot: { name?: string; componentData?: object; state?: string | object; stateSnaphot?: object; children?: any[]; }; 
  hierarchy: object; 
  snapshots: []; 
  viewIndex: number;
}

const StateRoute = (props:StateRouteProps) => {
  const { snapshot, hierarchy, snapshots, viewIndex } = props
  // gabi :: the hierarchy get set on the first click in the page, when page in refreshed we don't have a hierarchy so we need to check if hierarchy was initialize involk render chart
  const renderChart = () => {
    if (hierarchy) {
      return <Chart hierarchy={hierarchy} />;
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  // gabi :: the hierarchy get set on the first click in the page, when page in refreshed we don't have a hierarchy so we need to check if snapshot was initialize involk render chart
  const renderTree = () => {
    if (hierarchy) {
      return <Tree snapshot={snapshot} />;
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  const renderPerfView = () => {
    if (hierarchy) {
      return (
        <ErrorHandler>
          <PerfView viewIndex={viewIndex} snapshots={snapshots} width={600} height={600}/>
        </ErrorHandler>
      );
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  return (
    <Router>
      <div className="navbar">
        <NavLink className="router-link" activeClassName="is-active" exact to="/">
        Tree
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

export default StateRoute;