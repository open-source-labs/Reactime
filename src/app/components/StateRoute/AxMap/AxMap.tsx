import React from "react";
import { ParentSize } from '@visx/responsive';
import AxTree from "./Ax";
import { AxContainer } from "../../../FrontendTypes";

// Container to hold AxTree. AxTree is conditionally rendered based on the state of the setter function "showTree" in StateRoute

const AxContainer = (props: AxContainer) => {
    const {
        axSnapshots, // from 'tabs[currentTab]' object in 'MainContainer'
        snapshot, // from 'tabs[currentTab]' object in 'MainContainer'
        snapshots, // from 'tabs[currentTab].snapshotDisplay' object in 'MainContainer'
        currLocation, // from 'tabs[currentTab]' object in 'MainContainer'
      } = props;
      
    return (
    <div style={{height: '90vh'}}>
      <ParentSize className='componentMapContainer'>
        {({ width, height }) => {
          // eslint-disable-next-line react/prop-types
          const maxHeight: number = 1200;
          const h = Math.min(height, maxHeight);
          console.log('h: ', h);
          console.log('width', width)
          return (
              <AxTree
                axSnapshots={axSnapshots}
                snapshot={snapshot}
                snapshots={snapshots}
                currLocation={currLocation}
                width={width}
                height={h}
              />
          );
        }}
      </ParentSize>
    </div>
    )
}

export default AxContainer;