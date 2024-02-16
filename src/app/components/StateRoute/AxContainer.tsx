import React from "react";
import { ParentSize } from '@visx/responsive';
import AxTree from "./AxMap/Ax";

const AxContainer = (props) => {
    const {
        axSnapshots, // from 'tabs[currentTab]' object in 'MainContainer'
        snapshot, // from 'tabs[currentTab]' object in 'MainContainer'
        snapshots, // from 'tabs[currentTab].snapshotDisplay' object in 'MainContainer'
        currLocation, // from 'tabs[currentTab]' object in 'MainContainer'
      } = props;
      
    return (
    <div>
      <ParentSize className='componentMapContainer'>
        {({ width, height }) => {
          // eslint-disable-next-line react/prop-types
          const maxHeight: number = 1200;
          const h = Math.min(height, maxHeight);
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