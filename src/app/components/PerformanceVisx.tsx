/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
// @ts-nocheck
import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ParentSize } from '@visx/responsive';
import {
  MemoryRouter as Router,
  Route,
  NavLink,
  Switch,
} from 'react-router-dom';
import { Component } from 'react';
import { render } from 'react-dom';
import RenderingFrequency from './RenderingFrequency';
// import Switch from '@material-ui/core/Switch';
import BarGraph from './BarGraph';
import BarGraphComparison from './BarGraphComparison';
import BarGraphComparisonActions from './BarGraphComparisonActions';
import { useStoreContext } from '../store';
// import snapshots from './snapshots';
import snapshots from './snapshots';

const exclude = ['childExpirationTime', 'staticContext', '_debugSource', 'actualDuration', 'actualStartTime', 'treeBaseDuration', '_debugID', '_debugIsCurrentlyTiming', 'selfBaseDuration', 'expirationTime', 'effectTag', 'alternate', '_owner', '_store', 'get key', 'ref', '_self', '_source', 'firstBaseUpdate', 'updateQueue', 'lastBaseUpdate', 'shared', 'responders', 'pending', 'lanes', 'childLanes', 'effects', 'memoizedState', 'pendingProps', 'lastEffect', 'firstEffect', 'tag', 'baseState', 'baseQueue', 'dependencies', 'Consumer', 'context', '_currentRenderer', '_currentRenderer2', 'mode', 'flags', 'nextEffect', 'sibling', 'create', 'deps', 'next', 'destroy', 'parentSub', 'child', 'key', 'return', 'children', '$$typeof', '_threadCount', '_calculateChangedBits', '_currentValue', '_currentValue2', 'Provider', '_context', 'stateNode', 'elementType', 'type'];

/* NOTES
Issue - Not fully compatible with recoil apps. Reference the recoil-todo-test.
Barstacks display inconsistently...however, almost always displays upon initial test app load or
when empty button is clicked. Updating state after initial app load typically makes bars disappear.
However, cycling between updating state and then emptying sometimes fixes the stack bars. Important
to note - all snapshots do render (check HTML doc) within the chrome extension but they do
not display because height is not consistently passed to each bar. This side effect is only
seen in recoil apps...
 */

// typescript for PROPS from StateRoute.tsx
interface BarStackProps {
  width: number;
  height: number;
  snapshots: [];
  hierarchy: any;
}

const makePropsPretty = data => {
  const propsFormat = [];
  const nestedObj = [];
  if (typeof data !== 'object') {
    return <p>{data}</p>;
  }
  for (const key in data) {
    if (data[key] !== 'reactFiber' && typeof data[key] !== 'object' && exclude.includes(key) !== true) {
      propsFormat.push(<p className="stateprops">
        {`${key}: ${data[key]}`}
      </p>);
    } else if (data[key] !== 'reactFiber' && typeof data[key] === 'object' && exclude.includes(key) !== true) {
      const result = makePropsPretty(data[key]);
      nestedObj.push(result);
    }
  }
  if (nestedObj) {
    propsFormat.push(nestedObj);
  }
  return propsFormat;
};

const collectNodes = (snaps, componentName) => {
  const componentsResult = [];
  const renderResult = [];
  let trackChanges = 0;
  let newChange = true;
  for (let x = 0; x < snaps.length; x++) {
    const snapshotList = [];
    snapshotList.push(snaps[x]);
    for (let i = 0; i < snapshotList.length; i++) {
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
        // compare the last pushed component Data from the array to the current one to see if there are differences
        if (x !== 0 && componentsResult.length !== 0) {
          // needs to be stringified because values are hard to determine if true or false if in they're seen as objects
          if (JSON.stringify(Object.values(componentsResult[newChange ? componentsResult.length - 1 : trackChanges])[0]) !== JSON.stringify(cur.componentData.props)) {
            newChange = true;
            // const props = { [`snapshot${x}`]: { rendertime: formatRenderTime(cur.componentData.actualDuration), ...cur.componentData.props } };
            const props = { [`snapshot${x}`]: { ...cur.componentData.props } };
            componentsResult.push(props);
          } else {
            newChange = false;
            trackChanges = componentsResult.length - 1;
            const props = { [`snapshot${x}`]: { state: 'Same state as prior snapshot' } };
            componentsResult.push(props);
          }
        } else {
          // const props = { [`snapshot${x}`]: { ...cur.componentData.props}};
          // props[`snapshot${x}`].rendertime = formatRenderTime(cur.componentData.actualDuration);
          const props = { [`snapshot${x}`]: { ...cur.componentData.props } };
          componentsResult.push(props);
        }
        break;
      }
      if (cur.children && cur.children.length > 0) {
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
  // for (let i = 0; i < finalResults.length; i++) {
  //   for (const componentSnapshot in finalResults[i]) {
  //     finalResults[i][componentSnapshot] = makePropsPretty(finalResults[i][componentSnapshot]).reverse();
  //   }
  // }
  return finalResults;
};

/* DATA HANDLING HELPER FUNCTIONS */
const traverse = (snapshot, data, snapshots, currTotalRender = 0) => {
  if (!snapshot.children[0]) return;

  // loop through snapshots
  snapshot.children.forEach((child, idx) => {
    const componentName = child.name + -[idx + 1];

    // Get component Rendering Time
    const renderTime = Number(
      Number.parseFloat(child.componentData.actualDuration).toPrecision(5),
    );
    // sums render time for all children
    currTotalRender += renderTime;
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
      data.componentData[componentName].renderFrequency++;
    }
    // else {

    // }

    // add to total render time
    data.componentData[componentName].totalRenderTime += renderTime;
    // Get rtid for the hovering feature
    data.componentData[componentName].rtid = child.rtid;
    data.componentData[componentName].information = collectNodes(snapshots, child.name);
    traverse(snapshot.children[idx], data, snapshots, currTotalRender);
  });
  // reassigns total render time to max render time
  data.maxTotalRender = Math.max(currTotalRender, data.maxTotalRender);
  return data;
};

// Retrieve snapshot series data from Chrome's local storage.
const allStorage = () => {
  let values = localStorage.getItem('project')
  values = values === null ? [] : JSON.parse(values);
  console.log('allStorage', values)
  return values;
};

const getActions = () => {
  let seriesArr = localStorage.getItem('project')
  seriesArr = seriesArr === null ? [] : JSON.parse(seriesArr);
  const actionsArr = [];

  if (seriesArr.length) {
    for (let i = 0; i < seriesArr.length; i++) {
      for (const action of seriesArr[i].data.barStack) {
        if (action.name !== '') {
          action.seriesName = seriesArr[i].name;
          actionsArr.push(action);
        }
      }
    }
  }
  console.log('actionsArr', actionsArr)
  return actionsArr;
}

// Gets snapshot Ids for the regular bar graph view.
const getSnapshotIds = (obj, snapshotIds = []): string[] => {
  snapshotIds.push(`${obj.name}.${obj.branch}`);
  if (obj.children) {
    obj.children.forEach(child => {
      getSnapshotIds(child, snapshotIds);
    });
  }
  return snapshotIds;
};

// Returns array of snapshot objs each with components and corresponding render times.
const getPerfMetrics = (snapshots, snapshotsIds): {} => {
  const perfData = {
    barStack: [],
    componentData: {},
    maxTotalRender: 0,
  };
  snapshots.forEach((snapshot, i) => {
    perfData.barStack.push({ snapshotId: snapshotsIds[i] });
    traverse(snapshot, perfData, snapshots);
  });
  return perfData;
};



/* EXPORT COMPONENT */
const PerformanceVisx = (props: BarStackProps) => {
  // hook used to dispatch onhover action in rect
  const { width, height, snapshots, hierarchy, } = props;
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const [detailsView, setDetailsView] = useState('barStack');
  const [comparisonView, setComparisonView] = useState('barStack');
  const [comparisonData, setComparisonData] = useState();
  const NO_STATE_MSG = 'No state change detected. Trigger an event to change state';
  const data = getPerfMetrics(snapshots, getSnapshotIds(hierarchy));
  const [ series, setSeries ] = useState(true);
  const [ action, setAction ] = useState(false);

  const renderComparisonBargraph = () => {
    if (hierarchy && series) return (
      <BarGraphComparison
        comparison={allStorage()}
        data={data}
        width={width}
        height={height}
        setSeries={setSeries}
        series={series}
        setAction={setAction}
      />
    );
    return (
      <BarGraphComparisonActions 
          // comparison={allStorage()}
          data={getActions()}
          width={width}
          height={height}
          setSeries={setSeries}
          action={action}
          setAction={setAction}
          comparison={allStorage()}
      />
    );
  };

  const renderBargraph = () => {
    if (hierarchy) {
      return <BarGraph data={data} width={width} height={height} />;
    }
  };

  const renderComponentDetailsView = () => {
    if (hierarchy) {
      console.log(data.componentData)
      return <RenderingFrequency data={data.componentData} />;
    }
    return <div className="noState">{NO_STATE_MSG}</div>;
  };

  return (
    <Router>
      <div className="performance-nav-bar-container">
        <NavLink
          className="router-link-performance"
          // className="router-link"
          activeClassName="is-active"
          exact
          to="/"
        >
          Snapshots View
        </NavLink>
        <NavLink
          className="router-link-performance"
          // className="router-link"
          activeClassName="is-active"
          to="/comparison"
        >
          Comparison View
        </NavLink>
        <NavLink
          className="router-link-performance"
          // className="router-link"
          activeClassName="is-active"
          to="/componentdetails"
        >
          Component Details
        </NavLink>
      </div>

      <Switch>
        <Route path="/comparison" render={renderComparisonBargraph} />
        <Route path="/componentdetails" render={renderComponentDetailsView} />
        <Route path="/" render={renderBargraph} />
      </Switch>
    </Router>
  );
};

export default PerformanceVisx;
