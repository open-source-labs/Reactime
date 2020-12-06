// @ts-nocheck
import React, { useState } from 'react';
import RenderingFrequency from './RenderingFrequency';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import BarGraph from './BarGraph';

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

/* DATA HANDLING HELPER FUNCTIONS */
const traverse = (snapshot, data, currTotalRender = 0) => {
  if (!snapshot.children[0]) return;

  // loop through snapshots
  snapshot.children.forEach((child, idx) => {
    const componentName = child.name + -[idx + 1];

    // Get component Rendering Time
    const renderTime = Number(Number.parseFloat(child.componentData.actualDuration).toPrecision(5));
    // sums render time for all children
    currTotalRender += renderTime;
    // components as keys and set the value to their rendering time 
    data['barStack'][data.barStack.length - 1][componentName] = renderTime; 
    
    // Get component stateType
    if (!data.componentData[componentName]) {
      data.componentData[componentName] = {
        stateType: 'stateless',
        renderFrequency: 0,
        totalRenderTime: 0,
        rtid: ''
      };
      if (child.state !== 'stateless') data.componentData[componentName].stateType = 'stateful';
    }
    // increment render frequencies
    if (renderTime > 0) {
      data.componentData[componentName].renderFrequency++;
    }

   // add to total render time
    data.componentData[componentName].totalRenderTime += renderTime;
    // Get rtid for the hovering feature 
    data.componentData[componentName].rtid = child.rtid;
    traverse(snapshot.children[idx], data, currTotalRender);
  })
  // reassigns total render time to max render time
  data.maxTotalRender = Math.max(currTotalRender, data.maxTotalRender);
  return data;
};

const getSnapshotIds = (obj, snapshotIds = []): string[] => {
  snapshotIds.push(`${obj.name}.${obj.branch}`);
  if (obj.children) {
    obj.children.forEach(child => {
      getSnapshotIds(child, snapshotIds);
    });
  }
  return snapshotIds;
};

// Returns array of snapshot objs each with components and corresponding render times
const getPerfMetrics = (snapshots, snapshotsIds): {} => {
  const perfData = {
    barStack: [],
    componentData: {},
    maxTotalRender: 0,
  };
  snapshots.forEach((snapshot, i) => {
    perfData.barStack.push({snapshotId: snapshotsIds[i]});
    traverse(snapshot, perfData);
  });
  return perfData;
};
  
/* EXPORT COMPONENT */
const PerformanceVisx = (props: BarStackProps) => {
  // hook used to dispatch onhover action in rect
  const { width, height, snapshots, hierarchy } = props;

  const [isToggled, setIsToggled] = useState('barStack');
  const toggleView = () => {
    isToggled === 'frequencyCards' ? setIsToggled('barStack') : setIsToggled('frequencyCards');
  }
  // filter and structure incoming data for VISX
  const data = getPerfMetrics(snapshots, getSnapshotIds(hierarchy));
  
  // style={{ position: 'relative' }}
    // if performance tab is too small it will not return VISX component
    return  (
      <div className='renderTab'>
        <FormControlLabel style={{"margin-left":"30px", "margin-top": "0px"}}
        control={
          <Switch
            onChange={toggleView}
            name="checkedB"
            color="primary"
          />
        }
        label="Component Details"
      />
      {/* <button onClick={toggleView}>Toggle Button</button> */}
        <div style={{"display": "flex", "justify-content": "center"}}>
          {isToggled === 'frequencyCards' 
            ? <RenderingFrequency  data={data.componentData}/> 
            : <BarGraph data={data} width={width} height={height}/>
          }
        </div>
    </div>
  );
};

export default PerformanceVisx;
