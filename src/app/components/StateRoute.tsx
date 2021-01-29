// @ts-nocheck
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
import { ParentSize } from '@visx/responsive';
import Tree from './Tree';
import ComponentMap from './ComponentMap';
import { changeView, changeSlider } from '../actions/actions';
import { useStoreContext } from '../store';
import PerformanceVisx from './PerformanceVisx';
import Legend from './AtomsRelationshipLegend';
import AtomsRelationship from './AtomsRelationship';
import WebMetrics from './WebMetrics';


const History = require('./History').default;
const ErrorHandler = require('./ErrorHandler').default;

const NO_STATE_MSG =
  'No state change detected. Trigger an event to change state';
// eslint-disable-next-line react/prop-types

export interface StateRouteProps {
  snapshot: {
    name?: string;
    componentData?: object;
    state?: string | object;
    stateSnaphot?: object;
    children?: any[];
    atomsComponents?: any;
    atomSelectors?: any;
   
  };
  hierarchy: any;
  snapshots: [];
  viewIndex: number;
  webMetrics: object;
}

const StateRoute = (props: StateRouteProps) => {
  const { snapshot, hierarchy, snapshots, viewIndex, webMetrics } = props;
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { hierarchy, sliderIndex, viewIndex } = tabs[currentTab];
  const isRecoil = snapshot.atomsComponents ? true : false;
  const [noRenderData, setNoRenderData] = useState(false);
  // component map zoom state
  const [{ x, y, k }, setZoomState]: any = useState({
    x: 150,
    y: 250,
    k: 1,
  });

  // Map
  const renderComponentMap = () => {
    if (hierarchy) {
      return (
        <ParentSize>
          {({ width, height }) => (
            <ComponentMap snapshots={snapshots} width={width} height={height} />
          )}
        </ParentSize>
      );
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  // the hierarchy gets set upon the first click on the page
  // when the page is refreshed we may not have a hierarchy, so we need to check if hierarchy was initialized
  // if true, we invoke teh D3 render chart with hierarchy
  // by invoking History component, and passing in all the props required to render D3 elements and perform timeJump from clicking of node
  // otherwise we an alert to the user that no state was found.
  const renderHistory = () => {
    if (hierarchy) {
      return (
        <History
          hierarchy={hierarchy}
          dispatch={dispatch}
          sliderIndex={sliderIndex}
          viewIndex={viewIndex}
        />
      );
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  const renderAtomsRelationship = () => (
    <ParentSize>
      {({ width, height }) => (
        <>
          <AtomsRelationship
            width={width}
            height={height}
            snapshots={snapshots}
          />
        </>
      )}
    </ParentSize>
  );

  // the hierarchy gets set on the first click in the page
  // when the page is refreshed we may not have a hierarchy, so we need to check if hierarchy was initialized
  // if true invoke render Tree with snapshot
  const renderTree = () => {
    if (hierarchy) {
      return <Tree snapshot={snapshot} />;
    }
    return <div className="noState">{NO_STATE_MSG}</div>;

  };
  const renderWebMetrics = () => {
    return (
      <div>
        <WebMetrics webMetrics={webMetrics}/>
      </div>
    )
  };

  const renderPerfView = () => {
    if (hierarchy) {
      return (
        <ParentSize>
          {({ width, height }) => (
            <PerformanceVisx
              width={width}
              height={height}
              snapshots={snapshots}
              changeSlider={changeSlider}
              changeView={changeView}
              hierarchy={hierarchy}
            />
          )}
        </ParentSize>
      );
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  return (
    <Router>
      <div className="navbar">
        <NavLink className="router-link" 
        activeClassName="is-active" 
        exact to="/">
          Map
        </NavLink>
        <NavLink
          className="router-link"
          activeClassName="is-active"
          to="/performance"
        >
          Performance
        </NavLink>
        <NavLink
          className="router-link"
          activeClassName="is-active"
          to="/history"
        >
          History
        </NavLink>
        <NavLink
          className="router-link"
          activeClassName="is-active"
          to="/webMetrics"
        >
          Web Metrics
        </NavLink>
        <NavLink
          className="router-link"
          activeClassName="is-active"
          to="/tree"
        >
          Tree
        </NavLink>
        {isRecoil && (
          <NavLink
            className="router-link"
            activeClassName="is-active"
            to="/relationship"
          >
            AtomsRecoil
          </NavLink>
        )}
      </div>
      <Switch>
        <Route path="/performance" render={renderPerfView} />
        <Route path="/history" render={renderHistory} />
        <Route path="/relationship" render={renderAtomsRelationship} />
        <Route path="/webMetrics" render={renderWebMetrics} />
        <Route path="/tree" render={renderTree} />
        <Route path="/" render={renderComponentMap} />
      </Switch>
    </Router>
  );
};

export default StateRoute;
