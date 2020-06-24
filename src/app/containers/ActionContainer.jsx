/* eslint-disable react/no-array-index-key */
/* eslint-disable no-inner-declarations */
import React from 'react';
import { diff } from 'jsondiffpatch';
import Action from '../components/Action';

import { emptySnapshots } from '../actions/actions';
import { useStoreContext } from '../store';

const resetSlider = () => {
  const slider = document.querySelector('.rc-slider-handle');
  if (slider) { slider.setAttribute('style', 'left: 0'); }
};

function ActionContainer() {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { hierarchy, sliderIndex, viewIndex } = tabs[currentTab];
  console.log('actionContainer tabs[currentTab];', tabs[currentTab])

  let actionsArr = [];
  let hierarchyArr = [];

    // gabi and nate :: delete function to traverse state from snapshots, now we are tranversing state from hiararchy and alsog getting infromation on display name and component name
    const displayArray = (obj) => {
      const newObj = {
        index: obj.index,
        displayName : `${obj.name}.${obj.branch}`,
        state: obj.stateSnapshot.children[0].state,
        componentName: obj.stateSnapshot.children[0].name,
      }
      hierarchyArr.push(newObj)
      if(obj.children){
        obj.children.forEach((element) => {
          displayArray(element)
        })
      }
    }    
    displayArray(hierarchy)
    console.log('this is hierarchyArr', hierarchyArr)
    
    actionsArr = hierarchyArr.map((snapshot, index) => {
      const selected = index === viewIndex;
      return (
        <Action
          key={`action${index}`}
          index={index}
          state={snapshot.state}
          displayName={snapshot.displayName}
          componentName={snapshot.componentName} 
          selected={selected}
          dispatch={dispatch}
          sliderIndex={sliderIndex}
        />
      );
    });

  return (
    <div className="action-container">
      <div className="action-component exclude">
        <button
          className="empty-button"
          onClick={() => {
            dispatch(emptySnapshots());
            // set slider back to zero
            resetSlider();
          }}
          type="button"
        >
          Empty
        </button>
      </div>
      <div>{actionsArr}</div>
    </div>
  );
}

export default ActionContainer;
