/* eslint-disable react/no-array-index-key */
/* eslint-disable no-inner-declarations */
import React from 'react';
import { diff } from 'jsondiffpatch';
import Action from '../components/Action';

import { emptySnapshots, changeView, changeSlider } from '../actions/actions';
import { useStoreContext } from '../store';

const resetSlider = () => {
  const slider = document.querySelector('.rc-slider-handle');
  if (slider) { slider.setAttribute('style', 'left: 0'); }
};

function ActionContainer() {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { hierarchy, sliderIndex, viewIndex } = tabs[currentTab];
  console.log(tabs[currentTab])
  let actionsArr = [];
  const hierarchyArr = [];

  // gabi and nate :: delete function to traverse state from snapshots, now we are tranversing state from hiararchy and alsog getting infromation on display name and component name
  const displayArray = obj => {

    if (obj.stateSnapshot.children.length > 0 && obj.stateSnapshot.children[0] && obj.stateSnapshot.children[0].state && obj.stateSnapshot.children[0].name) {
      const newObj = {
        index: obj.index,
        displayName: `${obj.name}.${obj.branch}`,
        state: obj.stateSnapshot.children[0].state,
        componentName: obj.stateSnapshot.children[0].name,
        componentData: JSON.stringify(obj.stateSnapshot.children[0].componentData) === '{}' ? '' : obj.stateSnapshot.children[0].componentData
      };
      hierarchyArr.push(newObj);
    }
    if (obj.children) {
      obj.children.forEach(element => {
        displayArray(element);
      });
    }
  };
  // gabi :: the hierarchy get set on the first click in the page, when page in refreshed we don't have a hierarchy so we need to check if hierarchy was inicialize involk displayArray to display the hierarchy
  if (hierarchy) displayArray(hierarchy);

  // Edwin: handles keyboard presses, function passes an event and index of each action-component
  function handleOnKeyDown(e, i) {
    let currIndex = i;
    // up array key pressed
    if (e.keyCode === 38) {
      currIndex -= 1;
      if (currIndex < 0) return;
      dispatch(changeView(currIndex));
    }
    // down arrow key pressed
    else if (e.keyCode === 40) {
      currIndex += 1;
      if (currIndex > hierarchyArr.length - 1) return;
      dispatch(changeView(currIndex));
    }
    // enter key pressed
    else if (e.keyCode === 13) {
      e.stopPropagation();
      e.preventDefault(); // needed or will trigger onClick right after
      dispatch(changeSlider(currIndex));
    }
  }

  actionsArr = hierarchyArr.map((snapshot, index) => {
    const selected = index === viewIndex;
    const last = viewIndex === -1 && index === hierarchyArr.length - 1;
    return (
      <Action
        key={`action${index}`}
        index={index}
        state={snapshot.state}
        displayName={snapshot.displayName}
        componentName={snapshot.componentName}
        componentData={snapshot.componentData}
        selected={selected}
        last={last}
        dispatch={dispatch}
        sliderIndex={sliderIndex}
        handleOnkeyDown={handleOnKeyDown}
        viewIndex={viewIndex}
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
