// @ts-nocheck
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import React from 'react';
import { MemoryRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import { ParentSize } from '@visx/responsive';
import Tree from './Tree';
import ComponentMap from './ComponentMap/ComponentMap';
import { changeView, changeSlider } from '../../slices/mainSlice';
import { useSelector } from 'react-redux';
import PerformanceVisx from './PerformanceVisx/PerformanceVisx';
import WebMetrics from '../WebMetrics';
import { MainState, RootState, StateRouteProps } from '../../FrontendTypes';

/*
  Loads the appropriate StateRoute view and renders the Map, Performance, History, Webmetrics, and Tree navbar buttons after clicking on the 'State' button located near the top rightmost corner.
*/

const History = require('./History').default;
const NO_STATE_MSG = 'No state change detected. Trigger an event to change state'; // message to be returned if there has been no state change detected in our hooked/target app

const StateRoute = (props: StateRouteProps) => {
  const {
    snapshot, // from 'tabs[currentTab]' object in 'MainContainer'
    hierarchy, // from 'tabs[currentTab]' object in 'MainContainer'
    snapshots, // from 'tabs[currentTab].snapshotDisplay' object in 'MainContainer'
    viewIndex, // from 'tabs[currentTab]' object in 'MainContainer'
    webMetrics, // from 'tabs[currentTab]' object in 'MainContainer'
    currLocation, // from 'tabs[currentTab]' object in 'MainContainer'
  } = props;

  const { tabs, currentTab }: MainState = useSelector((state: RootState) => state.main);
  const { hierarchy, sliderIndex, viewIndex } = tabs[currentTab];

  const renderComponentMap = () => {
    if (hierarchy) {
      // if hierarchy was initialized/created render the Map
      return (
        <ParentSize className='componentMapContainer'>
          {({ width, height }) => (
            // eslint-disable-next-line react/prop-types
            <ComponentMap
              currentSnapshot={currLocation.stateSnapshot}
              width={width}
              height={height}
            />
          )}
        </ParentSize>
      );
    }
    return <div className='noState'>{NO_STATE_MSG}</div>; // otherwise, inform the user that there has been no state change in the target/hooked application.
  };

  const renderHistory: JSX.Element = () => {
    if (hierarchy) {
      // if hierarchy was initialized/created render the history
      return (
        <ParentSize>
          {({ width, height }) => (
            <History
              width={width}
              height={height}
              hierarchy={hierarchy}
              // Commented out dispatch that was prop drilled as conversion to RTK might invalidate need for prop drilling to access dispatch
              // dispatch={dispatch}
              sliderIndex={sliderIndex}
              viewIndex={viewIndex}
              currLocation={currLocation}
              snapshots={snapshots}
            />
          )}
        </ParentSize>
      );
    }
    return <div className='noState'>{NO_STATE_MSG}</div>; // otherwise, inform the user that there has been no state change in the target/hooked application.
  };

  const renderTree = () => {
    if (hierarchy) {
      // if a hierarchy has been created/initialized, render the appropriate tree based on the active snapshot
      return <Tree snapshot={snapshot} snapshots={snapshots} currLocation={currLocation} />;
    }
    return <div className='noState'>{NO_STATE_MSG}</div>; // otherwise, inform the user that there has been no state change in the target/hooked application.
  };
  const renderWebMetrics = () => {
    let LCPColor: String;
    let FIDColor: String;
    let FCPColor: String;
    let TTFBColor: String;
    let CLSColor: String;
    let INPColor: String;

    // adjust the strings that represent colors of the webmetrics performance bar for 'Largest Contentful Paint (LCP)', 'First Input Delay (FID)', 'First Contentfuly Paint (FCP)', 'Time to First Byte (TTFB)', 'Cumulative Layout Shift (CLS)', and 'Interaction to Next Paint (INP)' based on webMetrics outputs.
    if (webMetrics.LCP <= 2500) LCPColor = '#0bce6b';
    if (webMetrics.LCP > 2500 && webMetrics.LCP <= 4000) LCPColor = '#fc5a03';
    if (webMetrics.LCP > 4000) LCPColor = '#fc2000';

    if (webMetrics.FID <= 100) FIDColor = '#0bce6b';
    if (webMetrics.FID > 100 && webMetrics.FID <= 300) FIDColor = '#fc5a03';
    if (webMetrics.FID > 300) FIDColor = '#fc2000';

    if (webMetrics.FCP <= 1800) FCPColor = '#0bce6b';
    if (webMetrics.FCP > 1800 && webMetrics.FCP <= 3000) FCPColor = '#fc5a03';
    if (webMetrics.FCP > 3000) FCPColor = '#fc2000';

    if (webMetrics.TTFB <= 800) TTFBColor = '#0bce6b';
    if (webMetrics.TTFB > 800 && webMetrics.TTFB <= 1800) TTFBColor = '#fc5a03';
    if (webMetrics.TTFB > 1800) TTFBColor = '#fc2000';

    if (webMetrics.CLS <= 0.1) CLSColor = '#0bce6b';
    if (webMetrics.CLS > 0.1 && webMetrics.CLS <= 0.25) CLSColor = '#fc5a03';
    if (webMetrics.CLS > 0.25) CLSColor = '#fc2000';

    if (webMetrics.INP <= 200) INPColor = '#0bce6b';
    if (webMetrics.INP > 200 && webMetrics.INP <= 500) INPColor = '#fc5a03';
    if (webMetrics.INP > 500) INPColor = '#fc2000';

    return (
      <div className='web-metrics-container'>
        <WebMetrics
          color={LCPColor}
          series={webMetrics.LCP ? [webMetrics.LCP / 70 < 100 ? webMetrics.LCP / 70 : 100] : 0}
          formatted={(_) =>
            typeof webMetrics.LCP !== 'number' ? '- ms' : `${webMetrics.LCP.toFixed(2)} ms`
          }
          score={['2500 ms', '4000 ms']}
          overLimit={webMetrics.LCP > 7000}
          label='Largest Contentful Paint'
          name='Largest Contentful Paint'
          description='Measures loading performance.'
        />
        <WebMetrics
          color={FIDColor}
          series={webMetrics.FID ? [webMetrics.FID / 5 < 100 ? webMetrics.FID / 5 : 100] : 0}
          formatted={(_) =>
            typeof webMetrics.FID !== 'number' ? '- ms' : `${webMetrics.FID.toFixed(2)} ms`
          }
          score={['100 ms', '300 ms']}
          overLimit={webMetrics.FID > 500}
          label='First Input Delay'
          name='First Input Delay'
          description='Measures interactivity.'
        />
        <WebMetrics
          color={FCPColor}
          series={webMetrics.FCP ? [webMetrics.FCP / 50 < 100 ? webMetrics.FCP / 50 : 100] : 0}
          formatted={(_) =>
            typeof webMetrics.FCP !== 'number' ? '- ms' : `${webMetrics.FCP.toFixed(2)} ms`
          }
          score={['1800 ms', '3000 ms']}
          overLimit={webMetrics.FCP > 5000}
          label='First Contentful Paint'
          name='First Contentful Paint'
          description='Measures the time it takes the browser to render the first piece of DOM content.'
        />
        <WebMetrics
          color={TTFBColor}
          series={webMetrics.TTFB ? [webMetrics.TTFB / 30 < 100 ? webMetrics.TTFB / 30 : 100] : 0}
          formatted={(_) =>
            typeof webMetrics.TTFB !== 'number' ? '- ms' : `${webMetrics.TTFB.toFixed(2)} ms`
          }
          score={['800 ms', '1800 ms']}
          overLimit={webMetrics.TTFB > 3000}
          label='Time To First Byte'
          name='Time to First Byte'
          description='Measures the time it takes for a browser to receive the first byte of page content.'
        />
        <WebMetrics
          color={CLSColor}
          series={webMetrics.CLS ? [webMetrics.CLS * 200 < 100 ? webMetrics.CLS * 200 : 100] : 0}
          formatted={(_) =>
            `CLS Score: ${
              typeof webMetrics.CLS !== 'number'
                ? 'N/A'
                : `${webMetrics.CLS < 0.01 ? '~0' : webMetrics.CLS.toFixed(2)}`
            }`
          }
          score={['0.1', '0.25']}
          overLimit={webMetrics.CLS > 0.5}
          label='Cumulative Layout Shift'
          name='Cumulative Layout Shift'
          description={`Quantifies the visual stability of a web page by measuring layout shifts during the application's loading and interaction.`}
        />
        <WebMetrics
          color={INPColor}
          series={webMetrics.INP ? [webMetrics.INP / 7 < 100 ? webMetrics.INP / 7 : 100] : 0}
          formatted={(_) =>
            typeof webMetrics.INP !== 'number' ? '- ms' : `${webMetrics.INP.toFixed(2)} ms`
          }
          score={['200 ms', '500 ms']}
          overLimit={webMetrics.LCP > 700}
          label='Interaction to Next Paint'
          name='Interaction to Next Paint'
          description={`Assesses a page's overall responsiveness to user interactions by observing the latency of all click, tap, and keyboard interactions that occur throughout the lifespan of a user's visit to a page`}
        />
      </div>
    );
  };

  const renderPerfView = () => {
    if (hierarchy) {
      // if hierarchy was initialized/created render the PerformanceVisx
      return (
        <ParentSize>
          {({ width, height }) => (
            <PerformanceVisx
              width={width}
              height={height}
              snapshots={snapshots}
              // note: is propdrilled within Performance Visx, but doesn't seem to be used
              changeSlider={changeSlider}
              changeView={changeView}
              hierarchy={hierarchy}
            />
          )}
        </ParentSize>
      );
    }
    return <div className='noState'>{NO_STATE_MSG}</div>; // otherwise, inform the user that there has been no state change in the target/hooked application.
  };

  return (
    <Router>
      <div className='navbar'>
        <NavLink className='router-link map-tab' activeClassName='is-active' exact to='/'>
          Map
        </NavLink>
        <NavLink
          className='router-link performance-tab'
          activeClassName='is-active'
          to='/performance'
        >
          Performance
        </NavLink>
        <NavLink className='router-link history-tab' activeClassName='is-active' to='/history'>
          History
        </NavLink>
        <NavLink
          className='router-link web-metrics-tab'
          activeClassName='is-active'
          to='/webMetrics'
        >
          Web Metrics
        </NavLink>
        <NavLink className='router-link tree-tab' activeClassName='is-active' to='/tree'>
          Tree
        </NavLink>
      </div>
      <Switch>
        <Route path='/performance' render={renderPerfView} />
        <Route path='/history' render={renderHistory} />
        <Route path='/webMetrics' render={renderWebMetrics} />
        <Route path='/tree' render={renderTree} />
        <Route path='/' render={renderComponentMap} />
      </Switch>
    </Router>
  );
};

export default StateRoute;
