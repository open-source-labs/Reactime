/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Route, NavLink, Routes, Navigate } from 'react-router-dom';
import BarGraph from './BarGraph';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTabInApp } from '../../../slices/mainSlice';
import {
  PerfData,
  Series,
  PerformanceVisxProps,
  RootState,
  MainState,
} from '../../../FrontendTypes';

const collectNodes = (snaps, componentName) => {
  const componentsResult = [];
  const renderResult = [];
  let trackChanges = 0;
  let newChange = true;
  for (let x = 0; x < snaps.length; x += 1) {
    const snapshotList = [];
    snapshotList.push(snaps[x]);
    for (let i = 0; i < snapshotList.length; i += 1) {
      const cur = snapshotList[i];
      if (cur.name === componentName) {
        const renderTime = Number(
          Number.parseFloat(cur.componentData.actualDuration).toPrecision(5),
        );
        if (renderTime === 0) {
          break;
        } else {
          renderResult.push(renderTime);
        }
        // compare the last pushed component Data from the array to
        // the current one to see if there are differences
        if (x !== 0 && componentsResult.length !== 0) {
          // needs to be stringified because values are hard to determine if
          // true or false if in they're seen as objects
          if (
            JSON.stringify(
              Object.values(
                componentsResult[newChange ? componentsResult.length - 1 : trackChanges],
              )[0],
            ) !== JSON.stringify(cur.componentData.props)
          ) {
            newChange = true;
            const props = { [`snapshot${x}`]: { ...cur.componentData.props } };
            componentsResult.push(props);
          } else {
            newChange = false;
            trackChanges = componentsResult.length - 1;
            const props = { [`snapshot${x}`]: { state: 'Same state as prior snapshot' } };
            componentsResult.push(props);
          }
        } else {
          const props = { [`snapshot${x}`]: { ...cur.componentData.props } };
          componentsResult.push(props);
        }
        break;
      }
      if (cur.children?.length > 0) {
        for (const child of cur.children) {
          snapshotList.push(child);
        }
      }
    }
  }

  const finalResults = componentsResult.map((e, index) => {
    const name = Object.keys(e)[0];
    e[name].rendertime = renderResult[index];
    return e;
  });
  return finalResults;
};

type currNum = number;

/* DATA HANDLING HELPER FUNCTIONS */
const traverse = (snapshot, data, snapshots, currTotalRender: currNum = 0): void => {
  if (!snapshot.children[0]) return;

  // loop through snapshots
  snapshot.children.forEach((child, idx: number) => {
    const componentName = child.name + -[idx + 1];

    // Get component Rendering Time
    const renderTime = Number(Number.parseFloat(child.componentData.actualDuration).toPrecision(5));
    // sums render time for all children
    const childrenRenderTime = currTotalRender + renderTime;
    // components as keys and set the value to their rendering time
    data.barStack[data.barStack.length - 1][componentName] = renderTime;

    // Get component stateType
    if (!data.componentData[componentName]) {
      data.componentData[componentName] = {
        stateType: 'stateless',
        renderFrequency: 0,
        totalRenderTime: 0,
        rtid: '',
        information: {},
      };
      if (child.state !== 'stateless') data.componentData[componentName].stateType = 'stateful';
    }
    // increment render frequencies
    if (renderTime > 0) {
      data.componentData[componentName].renderFrequency += 1;
    }

    // add to total render time
    data.componentData[componentName].totalRenderTime += renderTime;
    // Get rtid for the hovering feature
    data.componentData[componentName].rtid = child.rtid;
    data.componentData[componentName].information = collectNodes(snapshots, child.name);
    traverse(snapshot.children[idx], data, snapshots, childrenRenderTime);
  });
  // reassigns total render time to max render time
  data.maxTotalRender = Math.max(currTotalRender, data.maxTotalRender);
};

// Retrieve snapshot series data from Chrome's local storage.
const allStorage = (): Series[] => {
  let values = localStorage.getItem('project');
  const newValues: Series[] = values === null ? [] : JSON.parse(values);
  return newValues;
};

// Gets snapshot Ids for the regular bar graph view.
const getSnapshotIds = (obj, snapshotIds = []): string[] => {
  snapshotIds.push(`${obj.name}.${obj.branch}`);
  if (obj.children) {
    obj.children.forEach((child) => {
      getSnapshotIds(child, snapshotIds);
    });
  }
  return snapshotIds;
};

// Returns array of snapshot objs each with components and corresponding render times.
const getPerfMetrics = (snapshots, snapshotsIds): PerfData => {
  const perfData: PerfData = {
    barStack: [],
    componentData: {},
    maxTotalRender: 0,
  };
  snapshots.forEach((snapshot, i: number) => {
    perfData.barStack.push({ snapshotId: snapshotsIds[i], route: snapshot.route.url });
    traverse(snapshot, perfData, snapshots);
  });
  return perfData;
};

const getActions = () => {
  // Creates the actions array used to populate the compare actions dropdown (WORK IN PROGRESS)
  const project = localStorage.getItem('project');
  const seriesArr: Series[] = project === null ? [] : JSON.parse(project);
  const actionsArr = [];

  if (seriesArr.length) {
    for (let i = 0; i < seriesArr.length; i += 1) {
      for (const actionObj of seriesArr[i].data.barStack) {
        if (actionObj.name === 'action') {
          actionObj.seriesName = seriesArr[i].name;
          actionsArr.push(actionObj);
        }
      }
    }
  }
  return actionsArr;
};

/* EXPORT COMPONENT */
const PerformanceVisx = (props: PerformanceVisxProps): JSX.Element => {
  // hook used to dispatch onhover action in react
  const {
    width, // from ParentSize provided in StateRoute
    height, // from ParentSize provided in StateRoute
    snapshots, // from 'tabs[currentTab]' object in 'MainContainer'
    hierarchy, // from 'tabs[currentTab]' object in 'MainContainer'
  } = props;
  const dispatch = useDispatch();
  const { currentTabInApp }: MainState = useSelector((state: RootState) => state.main);
  const data = getPerfMetrics(snapshots, getSnapshotIds(hierarchy));
  const [route, setRoute] = useState('All Routes');
  const [snapshot, setSnapshot] = useState('All Snapshots');

  getActions();

  useEffect(() => {
    dispatch(setCurrentTabInApp('performance')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'performance' to facilitate render.
    renderForTutorial();
  }, []);

  const allRoutes = []; // create allRoutes variable to hold urls
  const filteredSnapshots = [];

  for (let i = 0; i < data.barStack.length; i += 1) {
    // loop through data.barStack
    const url = new URL(data.barStack[i].route); // set url variable to new route url
    if (!allRoutes.includes(url.pathname)) {
      // if all the routes do not have the pathname property on url then push it onto all routes array
      allRoutes.push(url.pathname);
    }
    if (route && route === url.pathname) {
      // if the route exists and it is equal to url.pathname then push data.barstack at i into filteredSnapshots array
      filteredSnapshots.push(data.barStack[i]);
    }
  }
  if (route !== 'All Routes') {
    // if route does not equal to All Routes, set data.barstack to filteredSnapshots array
    data.barStack = filteredSnapshots;
  }

  let maxHeight = 0; // maxheight is referring to the max height in render time to choose the scaling size for graph
  if (snapshot !== 'All Snapshots') {
    const checkData = [data.barStack.find((comp) => comp.snapshotId === snapshot)]; // filter barStack to make it equal to an array of length 1 with object matching snapshot ID to mirror the data.barStack object's shape
    const holdData = [];

    for (const key in checkData[0]) {
      // looping through checkData which is composed of a single snapshot while pushing key/values to a new object and setting maxHeight
      if (key !== 'route' && key !== 'snapshotId') {
        if (maxHeight < checkData[0][key]) maxHeight = checkData[0][key];
        const name = {};
        name[key] = checkData[0][key];
        holdData.push(name);
        holdData[holdData.length - 1].route = checkData[0].route;
        holdData[holdData.length - 1].snapshotId = key;
      }
    }

    data.maxTotalRender = maxHeight * 1.15; // maxTotalRender height of bar is aligned to y-axis. 1.15 adjusts the numbers on the y-axis so the max bar's true height never reaches the max of the y-axis
    if (holdData) data.barStack = holdData; // assign holdData to data.barStack to be used later to create graph
  }

  const renderForTutorial = () => {
    // This will redirect to the proper tabs during the tutorial
    // Updated redirect to Navigate v23 redirect no longer supported in react router dom after v6
    if (currentTabInApp === 'performance') return <Navigate to='/performance/' />;
    if (currentTabInApp === '/performance-comparison')
      return <Navigate to='/performance/comparison' />;
    return null;
  };

  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            hierarchy ? (
              <div>
                <BarGraph
                  data={data}
                  width={width}
                  height={height}
                  comparison={allStorage()}
                  setRoute={setRoute}
                  allRoutes={allRoutes}
                  filteredSnapshots={filteredSnapshots}
                  setSnapshot={setSnapshot}
                  snapshot={snapshot}
                />
              </div>
            ) : null
          }
        />
      </Routes>
    </>
  );
};

export default PerformanceVisx;
