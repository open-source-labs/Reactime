/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import React, { useState } from 'react';
import {
  MemoryRouter as Router,
  Route,
  NavLink,
  Switch,
} from 'react-router-dom';
import Tree from './Tree';
import Map from './Map';
import PerfView from './PerfView';

const Chart = require('./Chart').default;

const ErrorHandler = require('./ErrorHandler').default;

const NO_STATE_MSG =
  'No state change detected. Trigger an event to change state';
// eslint-disable-next-line react/prop-types

interface StateRouteProps {
  snapshot: {
    name?: string;
    componentData?: object;
    state?: string | object;
    stateSnaphot?: object;
    children?: any[];
  };
  hierarchy: object;
  snapshots: [];
  viewIndex: number;
}

const StateRoute = (props: StateRouteProps) => {
  const { snapshot, hierarchy, snapshots, viewIndex } = props;
  const [noRenderData, setNoRenderData] = useState(false);

  //Test Map
  const renderMap = () => {
    if (hierarchy) {
      return <Map viewIndex={viewIndex} snapshots={snapshots} />;
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  // the hierarchy gets set on the first click in the page
  // when the page is refreshed we may not have a hierarchy, so we need to check if hierarchy was initialized
  // if true involk render chart with hierarchy
  const renderChart = () => {
    if (hierarchy) {
      return <Chart hierarchy={hierarchy} />;
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  // the hierarchy gets set on the first click in the page
  // when the page is refreshed we may not have a hierarchy, so we need to check if hierarchy was initialized
  // if true involk render Tree with snapshot
  const renderTree = () => {
    if (hierarchy) {
      return <Tree snapshot={snapshot} />;
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };
  
  let perfChart;
  if (true) {
    
    perfChart = (
      <PerfView
        viewIndex={viewIndex}
        snapshots={snapshots}
        setNoRenderData={setNoRenderData}
        width={600}
        height={1000}
      />
    );
  }
  
  //This will intermitently block Recoil PerfCharts from rendering
  // else {
  //   perfChart = (
  //     <div className="no-data-message">
  //       Application must be running in development mode in order to view
  //       performance data
  //     </div>
  //   );
  // }

  const renderPerfView = () => <ErrorHandler>{perfChart}</ErrorHandler>;

  return (
    <Router>
      <div className="navbar">
        <NavLink
          className="router-link"
          activeClassName="is-active"
          exact
          to="/"
        >
          Tree
        </NavLink>
        <NavLink
          className="router-link"
          activeClassName="is-active"
          to="/chart"
        >
          History
        </NavLink>
        <NavLink className="router-link" activeClassName="is-active" to="/map">
          Map
        </NavLink>
        <NavLink
          className="router-link"
          activeClassName="is-active"
          to="/performance"
        >
          Performance
        </NavLink>
      </div>
      <Switch>
        <Route path="/map" render={renderMap} />
        <Route path="/chart" render={renderChart} />
        <Route path="/performance" render={renderPerfView} />
        <Route path="/" render={renderTree} />
      </Switch>
    </Router>
  );
};

export default StateRoute;
