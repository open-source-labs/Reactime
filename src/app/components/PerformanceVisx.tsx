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
import RenderingFrequency from './RenderingFrequency';
// import Switch from '@material-ui/core/Switch';
import BarGraph from './BarGraph';
import BarGraphComparison from './BarGraphComparison';
import { useStoreContext } from '../store';
// import snapshots from './snapshots';
import { Component } from 'react';

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



// function getComponentsArr(componentName, snapshots, node) {
//   //Input: Name of component and all snapshots
//   //Output: One array of each individual snapshot

//   //NOTE:
//     //Every snapshot is an object with a children array with a snapshot that also has a children array etc
//     //Children arrays more than one signify siblings 

// }
// // snapshots.map(rootNode => {
// //     // rootNode.name
// //   let currNode = rootNode
// //   while (currNode) {
// //     if (currNode.name === componentName) {
// //       return currNode.componentData.props
// //     } else {
// //       currNode = currNode.children[0]
// //       currNode = currNode.children[1]
// //     }
// //   }
// // })

const collectNodes = (snaps, componentName) => {
  const componentsResult = [];
  // console.log("This is the snapshots", snaps);
  // componentsResult.splice(0, componentsResult.length); { /* We used the .splice method here to ensure that nodeList did not accumulate with page refreshes */ }
  // componentsResult.push(snaps);

  for (let x = 0; x < snaps.length; x++) {
    const snapshotList = []
    snapshotList.push(snaps[x]);

    for (let i = 0; i < snapshotList.length; i++) {

      const cur = snapshotList[i];
      if (cur.name === componentName) {
        componentsResult.push(cur.componentData.props);
        break;
      }
      if (cur.children && cur.children.length > 0) {
        for (let child of cur.children) {
          snapshotList.push(child);
        }
      }
    }
  }  
  //console.log('componentsResult looks like: ', componentsResult);
  return componentsResult;
}




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
        props: {},
      };
      if (child.state !== 'stateless') data.componentData[componentName].stateType = 'stateful';
    }
    // increment render frequencies
    if (renderTime > 0) {
      // console.log('what is the child', child);
      // console.log('por que?', data.componentData[componentName]);
      data.componentData[componentName].renderFrequency++;
    } else {
      // console.log('what is the child', child);
      // console.log('we dont increment here', data.componentData[componentName], 'and the child', child);
    }

    // add to total render time
    data.componentData[componentName].totalRenderTime += renderTime;
    // Get rtid for the hovering feature
    data.componentData[componentName].rtid = child.rtid;
    data.componentData[componentName].props = collectNodes(snapshots, child.name);
    traverse(snapshot.children[idx], data, snapshots, currTotalRender);
  });
  // reassigns total render time to max render time
  data.maxTotalRender = Math.max(currTotalRender, data.maxTotalRender);
  return data;
};

// Retrieve snapshot series data from Chrome's local storage.
const allStorage = () => {
  const values = [];
  const keys = Object.keys(localStorage);
  let i = keys.length;
  console.log('allstorage keys', keys);

  while (i--) {
    const series = localStorage.getItem(keys[i]);
    values.push(JSON.parse(series));
  }
  console.log('allstorage values', values);
  return values;
};

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
  console.log('show me all of the snapshots', snapshots);
  snapshots.forEach((snapshot, i) => {
    perfData.barStack.push({ snapshotId: snapshotsIds[i] });
    traverse(snapshot, perfData, snapshots);
  });
  return perfData;
};

/* EXPORT COMPONENT */
const PerformanceVisx = (props: BarStackProps) => {
  // hook used to dispatch onhover action in rect
  const {
    width, height, snapshots, hierarchy,
  } = props;
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const [detailsView, setDetailsView] = useState('barStack');
  const [comparisonView, setComparisonView] = useState('barStack');
  const [comparisonData, setComparisonData] = useState();
  const NO_STATE_MSG = 'No state change detected. Trigger an event to change state';
  const data = getPerfMetrics(snapshots, getSnapshotIds(hierarchy));

  const renderComparisonBargraph = () => {
    if (hierarchy) {
      return (
        <BarGraphComparison
          comparison={allStorage()}
          data={data}
          width={width}
          height={height}
        />
      );
    }
  };

  const renderBargraph = () => {
    if (hierarchy) {
      return <BarGraph data={data} width={width} height={height} />;
    }
  };

  const renderComponentDetailsView = () => {
    console.log('show me snapshots', snapshots)
    console.log('what is heirarchy', hierarchy);
    console.log('this is the info for rendering frequency', data.componentData);
    if (hierarchy) {
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
