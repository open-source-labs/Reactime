/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import Action from '../components/Action';
import SwitchAppDropdown from '../components/SwitchApp';
import { emptySnapshots, changeView, changeSlider } from '../RTKslices';
import { useDispatch, useSelector } from 'react-redux';
// import { useStoreContext } from '../store';
import RouteDescription from '../components/RouteDescription';
import { Obj } from '../FrontendTypes';
import { Button, Switch } from '@mui/material';
// import { mainSlice } from '../RTKslices';
/*
  This file renders the 'ActionContainer'. The action container is the leftmost column in the application. It includes the button that shrinks and expands the action container, a dropdown to select the active site, a clear button, the current selected Route, and a list of selectable snapshots with timestamps.
*/

// resetSlider locates the rc-slider elements on the document and resets it's style attributes
const resetSlider = () => {
  const slider = document.querySelector('.rc-slider-handle');
  const sliderTrack = document.querySelector('.rc-slider-track');
  if (slider) {
    slider.setAttribute('style', 'left: 0');
    sliderTrack.setAttribute('style', 'width: 0');
  }
};

function ActionContainer(props): JSX.Element {
  const dispatch = useDispatch();
  const currentTab = useSelector((state: any) => state.main.currentTab)
  const tabs = useSelector((state: any) => state.main.tabs)
  const port = useSelector((state: any) => state.main.port)


  // const [{ tabs, currentTab, port }, dispatch] = useStoreContext(); // we destructure the returned context object from the invocation of the useStoreContext function. Properties not found on the initialState object (dispatch) are from the useReducer function invocation in the App component
  const { currLocation, hierarchy, sliderIndex, viewIndex } = tabs[currentTab]; // we destructure the currentTab object
  const { 
    toggleActionContainer, // function that handles Time Jump Sidebar view from MainContainer
    actionView, // local state declared in MainContainer
    setActionView // function to update actionView state declared in MainContainer
  } = props;
  const [recordingActions, setRecordingActions] = useState(true); // We create a local state 'recordingActions' and set it to true
  let actionsArr: JSX.Element[] = []; // we create an array 'actionsArr' that will hold elements we create later on
  // we create an array 'hierarchyArr' that will hold objects and numbers
  const hierarchyArr: (number | {})[] = [];

  /* 
  function to traverse state from hierarchy and also getting information on display name and component name
  
  the obj parameter is an object with the following structure:
    {
      stateSnapshot: {
        route: any;
        children: any[];
      };
    name: number;
    branch: number;
    index: number;
    children?: [];
    }
  */

  const displayArray = (obj: Obj): void => {
    if (
      obj.stateSnapshot.children.length > 0 && // if the 'stateSnapshot' has a non-empty 'children' array
      obj.stateSnapshot.children[0] && // and there is an element
      obj.stateSnapshot.children[0].state && // with a 'state'
      obj.stateSnapshot.children[0].name // and a 'name'
    ) {
      const newObj: Record<string, unknown> = { // we create a new Record object (whose property keys are Keys and whose property values are Type. This utility can be used to map the properties of a type to another type) and populate it's properties with relevant values from our argument 'obj'.
        index: obj.index,
        displayName: `${obj.name}.${obj.branch}`,
        state: obj.stateSnapshot.children[0].state,
        componentName: obj.stateSnapshot.children[0].name,
        routePath: obj.stateSnapshot.route.url,
        componentData:
          JSON.stringify(obj.stateSnapshot.children[0].componentData) === '{}'
            ? ''
            : obj.stateSnapshot.children[0].componentData,
      };
      hierarchyArr.push(newObj); // we push our record object into 'hiearchyArr' defined on line 35
    }

    if (obj.children) { // if argument has a 'children' array, we iterate through it and run 'displayArray' on each element
      obj.children.forEach((element): void => {
        displayArray(element);
      });
    }
  };

  // the hierarchy gets set on the first click in the page
  if (hierarchy) displayArray(hierarchy); // when page is refreshed we may not have a hierarchy so we need to check if hierarchy was initialized. If it was initialized, invoke displayArray to display the hierarchy

  // This function allows us to use our arrow keys to jump between snapshots. It passes an event and the index of each action-component. Using the arrow keys allows us to highligh snapshots and the enter key jumps to the selected snapshot
  function handleOnKeyDown(e: KeyboardEvent, i: number): void {
    let currIndex = i;
    
    if (e.key === 'ArrowUp') { // up arrow key pressed
      currIndex--;
      if (currIndex < 0) return;
      dispatch(changeView(currIndex));
    }
    
    else if (e.key === 'ArrowDown') { // down arrow key pressed
      currIndex++;
      if (currIndex > hierarchyArr.length - 1) return;
      dispatch(changeView(currIndex));
    } else if (e.key === 'Enter') { // enter key pressed
      e.stopPropagation(); // prevents further propagation of the current event in the capturing and bubbling phases
      e.preventDefault(); // needed or will trigger onClick right after
      dispatch(changeSlider(currIndex));
    }
  }

  // Sort hierarchyArr by index property of each object. This will be useful when later when we build our components so that our components will be displayed in index/chronological order
  hierarchyArr.sort((a: Obj, b: Obj): number => a.index - b.index);

  // we create a map of components that are constructed from "hierarchyArr's" elements/snapshots
  actionsArr = hierarchyArr.map(
    (snapshot: {
      routePath: any;
      state?: Record<string, unknown>;
      index: number;
      displayName: string;
      componentName: string;
      componentData: { actualDuration: number } | undefined;
    }) => {
      const { index } = snapshot; // destructure index from snapshot
      const selected = index === viewIndex; // boolean on whether the current index is the same as the viewIndex
      const last = viewIndex === -1 && index === hierarchyArr.length - 1; // boolean on whether the view index is less than 0 and if the index is the same as the last snapshot's index value in hierarchyArr
      const isCurrIndex = index === currLocation.index;
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
          //not sure if we need to prop drill dispatch anymore as we can import it directly within action component
          //line 142 commented out for this reason above
          // dispatch={dispatch}
          sliderIndex={sliderIndex}
          handleOnkeyDown={handleOnKeyDown}
          viewIndex={viewIndex}
          isCurrIndex={isCurrIndex}
          routePath={snapshot.routePath}
        />
      );
    },
  );
  useEffect(() => {
    setActionView(true);
  }, [setActionView]);

  // Function sends message to background.js which sends message to the content script
  const toggleRecord = (): void => {
    port.postMessage({
      action: 'toggleRecord',
      tabId: currentTab,
    });
    setRecordingActions(!recordingActions); // Record button's icon is being togggled on click
  };

  type routes = {
    [route: string]: [];
  };

  const routes: {} = {}; // Logic to create the route description components begin

  for (let i = 0; i < actionsArr.length; i += 1) {
    // iterate through our actionsArr
    if (!routes.hasOwnProperty(actionsArr[i].props.routePath)) {
      routes[actionsArr[i].props.routePath] = [actionsArr[i]]; // if 'routes' doesn't have a property key that is the same as the current component at index[i] routePath we create an array with the first element being the component at index [i].
    } else {
      routes[actionsArr[i].props.routePath].push(actionsArr[i]); // If it does exist, we push the component at index [i] to the apporpriate routes[routePath]
    }
  }

  // the conditional logic below will cause ActionContainer.test.tsx to fail as it cannot find the Empty button
  // UNLESS actionView={true} is passed into <ActionContainer /> in the beforeEach() call in ActionContainer.test.tsx
  return (
    <div id='action-id' className='action-container'>
      <div className='actionToolContainer'>
        <div id='arrow'>
          <aside className='aside'>
            <a onClick={toggleActionContainer} className='toggle'>
              <i />
            </a>
          </aside>
        </div>
        <a type='button' id='recordBtn' onClick={toggleRecord}>
          <i />
          {recordingActions ? <Switch defaultChecked /> : <Switch />}
        </a>
      </div>
      {actionView ? (
        <div className='action-button-wrapper'>
          <SwitchAppDropdown />
          <div className='action-component exclude'>
            <Button
              variant='contained'
              className='empty-button'
              style={{ backgroundColor: '#ff6569' }}
              onClick={() => {
                dispatch(emptySnapshots()); // set slider back to zero, visually
                resetSlider();
              }}
              type='button'
            >
              Clear
            </Button>
          </div>
          {/* Rendering of route description components */}
          {Object.keys(routes).map((route, i) => (
            <RouteDescription key={`route${i}`} actions={routes[route]} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ActionContainer;
