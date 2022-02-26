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

const NO_STATE_MSG = 'No state change detected. Trigger an event to change state';
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
  currLocation: object;
}

const StateRoute = (props: StateRouteProps) => {
  const { snapshot, hierarchy, snapshots, viewIndex, webMetrics, currLocation } = props;
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { hierarchy, sliderIndex, viewIndex } = tabs[currentTab];
  const isRecoil = !!snapshot.atomsComponents;

  // Map
  const renderComponentMap = () => {
    if (hierarchy) {
      return (
        <ParentSize className="componentMapContainer">
          {({ width, height }) => (
            // eslint-disable-next-line react/prop-types
            <ComponentMap currentSnapshot={currLocation.stateSnapshot} width={width} height={height} />
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
        <ParentSize>
          {({ width, height }) => (
            <History
              width={width}
              height={height}
              hierarchy={hierarchy}
              dispatch={dispatch}
              sliderIndex={sliderIndex}
              viewIndex={viewIndex}
              currLocation={currLocation}
              // added snapshots 11/4 Rob
              snapshots={snapshots}
            />
          )}
        </ParentSize>
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
    let LCPColor; let FIDColor; let FCPColor; let
      TTFBColor;

    if (webMetrics.LCP <= 2000) LCPColor = '#0bce6b';
    if (webMetrics.LCP > 2000 && webMetrics.LCP < 4000) LCPColor = '#E56543';
    if (webMetrics.LCP > 4000) LCPColor = '#fc2000';
    if (webMetrics.FID <= 100) FIDColor = '#0bce6b';
    if (webMetrics.FID > 100 && webMetrics.FID <= 300) FIDColor = '#fc5a03';
    if (webMetrics.FID > 300) FIDColor = '#fc2000';
    if (webMetrics.FCP <= 900) FCPColor = '#0bce6b';
    if (webMetrics.FCP > 900 && webMetrics.FCP <= 1100) FCPColor = '#fc5a03';
    if (webMetrics.FCP > 1100) FCPColor = '#fc2000';
    if (webMetrics.TTFB <= 600) TTFBColor = '#0bce6b';
    if (webMetrics.TTFB > 600) TTFBColor = '#fc2000';

    return (
      <div className="web-metrics-container">
        <WebMetrics
          color={LCPColor}
          series={(webMetrics.LCP / 2500) * 100}
          formatted={val => (Number.isNaN(val)
            ? '- ms'
            : `${((val / 100) * 2500).toFixed(2)} ms`)}
          label="LCP"
          name="Largest Contentful Paint"
          description="Measures loading performance. The benchmark is less than 2500 ms."
        />
        <WebMetrics
          color={FIDColor}
          series={webMetrics.FID * 25}
          formatted={val => (Number.isNaN(val) ? '- ms' : `${(val / 25).toFixed(2)} ms`)}
          label="FID"
          name="First Input Delay"
          description="Measures interactivity. The benchmark is less than 100 ms."
        />
        <WebMetrics
          color={FCPColor}
          series={(webMetrics.FCP / 1000) * 100}
          formatted={val => `${((val / 100) * 1000).toFixed(2)} ms`}
          label="FCP"
          name="First Contentful Paint"
          description="Measures the time it takes the browser to render the first piece of DOM content. No benchmark."
        />
        <WebMetrics
          color={TTFBColor}
          series={(webMetrics.TTFB / 10) * 100}
          formatted={val => `${((val / 100) * 10).toFixed(2)} ms`}
          label="TTFB"
          name="Time to First Byte"
          description="Measures the time it takes for a browser to receive the first byte of page content. The benchmark is 600 ms."
        />
      </div>
    );
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
        <NavLink
          className="router-link"
          activeClassName="is-active"
          exact
          to="/"
        >
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
        <NavLink className="router-link" activeClassName="is-active" to="/tree">
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
