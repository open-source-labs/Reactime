// @ts-nocheck
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import React, { useState } from 'react';
import { MemoryRouter as Router, Route, NavLink, Routes, Outlet, Link } from 'react-router-dom';
import { ParentSize } from '@visx/responsive';
import Tree from './Tree';
import ComponentMap from './ComponentMap/ComponentMap';
import { changeView, changeSlider, toggleAxTree, setCurrentTabInApp } from '../../slices/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import PerformanceVisx from './PerformanceVisx/PerformanceVisx';
import WebMetricsContainer from './WebMetrics/WebMetricsContainer';
import { MainState, RootState, StateRouteProps } from '../../FrontendTypes';
import AxContainer from './AxMap/AxContainer';

const History = require('./History').default;
const NO_STATE_MSG = 'No state change detected. Trigger an event to change state';

const StateRoute = (props: StateRouteProps) => {
  const {
    axSnapshots,
    snapshot,
    hierarchy: propsHierarchy,
    snapshots,
    viewIndex: propsViewIndex,
    webMetrics,
    currLocation,
  } = props;

  const { tabs, currentTab }: MainState = useSelector((state: RootState) => state.main);
  const { hierarchy: tabsHierarchy, sliderIndex, viewIndex: tabsViewIndex } = tabs[currentTab];
  const hierarchy = propsHierarchy || tabsHierarchy;
  const viewIndex = propsViewIndex || tabsViewIndex;

  const dispatch = useDispatch();
  const [showTree, setShowTree] = useState(false);
  const [showParagraph, setShowParagraph] = useState(true);

  const enableAxTreeButton = () => {
    dispatch(toggleAxTree('toggleAxRecord'));
    dispatch(setCurrentTabInApp('AxTree'));
    setShowParagraph(false);
    setShowTree(true);
  };

  return (
    <div className='app-body'>
      <div className='main-navbar-container'>
        <div className='main-navbar'>
          <NavLink
            to='/'
            className={(navData) =>
              navData.isActive ? 'is-active router-link map-tab' : 'router-link map-tab'
            }
            end
          >
            Map
          </NavLink>
          <NavLink
            className={(navData) =>
              navData.isActive ? 'is-active router-link performance' : 'router-link performance-tab'
            }
            to='/performance'
          >
            Performance
          </NavLink>
          <NavLink
            className={(navData) =>
              navData.isActive ? 'is-active router-link history-tab' : 'router-link history-tab'
            }
            to='/history'
          >
            History
          </NavLink>
          <NavLink
            className={(navData) =>
              navData.isActive
                ? 'is-active router-link web-metrics-tab'
                : 'router-link web-metrics-tab'
            }
            to='/webMetrics'
          >
            Web Metrics
          </NavLink>
          <NavLink
            className={(navData) =>
              navData.isActive ? 'is-active router-link tree-tab' : 'router-link tree-tab'
            }
            to='/tree'
          >
            Tree
          </NavLink>
          <NavLink
            className={(navData) =>
              navData.isActive
                ? 'is-active router-link accessibility-tab'
                : 'router-link accessibility-tab'
            }
            to='/accessibility'
          >
            Accessibility
          </NavLink>
        </div>
      </div>

      <div className='app-content'>
        <Routes>
          <Route
            path='/accessibility'
            element={
              showTree ? (
                <div>
                  <AxContainer
                    axSnapshots={axSnapshots}
                    snapshot={snapshot}
                    snapshots={snapshots}
                    currLocation={currLocation}
                    setShowTree={setShowTree}
                    setShowParagraph={setShowParagraph}
                  />
                </div>
              ) : (
                <div>
                  {showParagraph && (
                    <div className='accessibility-text'>
                      <p>
                        A Note to Developers: Reactime is using the Chrome Debugger API in order to
                        grab the Accessibility Tree. Enabling this option will allow you to record
                        Accessibility Tree snapshots, but will result in the Chrome browser
                        notifying you that the Chrome Debugger has started.
                      </p>
                    </div>
                  )}
                  <div className='accessibility-controls'>
                    <input
                      type='radio'
                      id='enable'
                      name='accessibility'
                      value='enable'
                      onChange={enableAxTreeButton}
                    />
                    <label htmlFor='enable'>Enable</label>
                  </div>
                </div>
              )
            }
          />
          <Route
            path='/history'
            element={
              hierarchy ? (
                <ParentSize>
                  {({ width, height }) => (
                    <History
                      width={width}
                      height={height}
                      hierarchy={hierarchy}
                      sliderIndex={sliderIndex}
                      viewIndex={viewIndex}
                      currLocation={currLocation}
                      snapshots={snapshots}
                    />
                  )}
                </ParentSize>
              ) : (
                <div className='noState'>{NO_STATE_MSG}</div>
              )
            }
          />
          <Route
            path='/performance/*'
            element={
              hierarchy ? (
                <div style={{ height: '100%' }}>
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
                  <Outlet />
                </div>
              ) : (
                <div className='noState'>{NO_STATE_MSG}</div>
              )
            }
          />
          <Route path='/webMetrics' element={<WebMetricsContainer webMetrics={webMetrics} />} />
          <Route
            path='/tree'
            element={<Tree snapshot={snapshot} snapshots={snapshots} currLocation={currLocation} />}
          />
          <Route
            path='/'
            element={
              hierarchy ? (
                <ParentSize className='componentMapContainer'>
                  {({ width, height }) => {
                    const maxHeight = 1200;
                    const h = Math.min(height, maxHeight);
                    return (
                      <ComponentMap
                        currentSnapshot={currLocation.stateSnapshot}
                        width={width}
                        height={h}
                      />
                    );
                  }}
                </ParentSize>
              ) : null
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default StateRoute;
