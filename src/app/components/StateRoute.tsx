/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import React, { useState } from 'react';
import { MemoryRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import Tree from './Tree';
import PerfView from './PerfView';
import { spawn } from 'child_process';

const Chart = require('./Chart').default;
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
  const { snapshot, hierarchy, snapshots, viewIndex } = props;
  const [noRenderData, setNoRenderData] = useState(false);

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

  let perfChart;
  if (!noRenderData) {
    perfChart = (
      <PerfView viewIndex={viewIndex}
        snapshots={snapshots}
        setNoRenderData={setNoRenderData}
        width={600}
        height={1000}
      />
    );
  } else { 
    perfChart = <div className="no-data-message">Rendering Data is not available for this application</div>; 
  }

  const renderPerfView = () => {
    return (
      <ErrorHandler>
        {perfChart}
      </ErrorHandler>
    );
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
