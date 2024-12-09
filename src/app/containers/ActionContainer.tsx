/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import Action from '../components/Actions/Action';
import SwitchAppDropdown from '../components/Actions/SwitchApp';
import { emptySnapshots, changeView, changeSlider } from '../slices/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import RouteDescription from '../components/Actions/RouteDescription';
import DropDown from '../components/Actions/DropDown';
import ProvConContainer from './ProvConContainer';
import { ActionContainerProps, CurrentTab, MainState, Obj, RootState } from '../FrontendTypes';
import { Button, Switch } from '@mui/material';

/*
  This file renders the 'ActionContainer'. The action container is the leftmost column in the application. It includes the button that shrinks and expands the action container, a dropdown to select the active site, a clear button, the current selected Route, and a list of selectable snapshots with timestamps.
*/


// resetSlider locates the rc-slider elements on the document and resets it's style attributes
const resetSlider = () => {
  const slider = document.querySelector('.rc-slider-handle');
  const sliderTrack = document.querySelector('.rc-slider-track');
  if (slider && sliderTrack) {
    slider.setAttribute('style', 'left: 0');
    sliderTrack.setAttribute('style', 'width: 0');
  }
};

function ActionContainer(props: ActionContainerProps): JSX.Element {

  const [dropdownSelection, setDropdownSelection] = useState('TimeJump');

  const dispatch = useDispatch();
  const { currentTab, tabs, port }: MainState = useSelector((state: RootState) => state.main);

  const { currLocation, hierarchy, sliderIndex, viewIndex }: Partial<CurrentTab> = tabs[currentTab]; // we destructure the currentTab object
  const {
    toggleActionContainer, // function that handles Time Jump Sidebar view from MainContainer
    actionView, // local state declared in MainContainer
    setActionView, // function to update actionView state declared in MainContainer
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
      const newObj: Record<string, unknown> = {
        // we create a new Record object (whose property keys are Keys and whose property values are Type.
        //This utility can be used to map the properties of a type to another type) and populate it's properties with
        //relevant values from our argument 'obj'.
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

    if (obj.children) {
      // if argument has a 'children' array, we iterate through it and run 'displayArray' on each element
      obj.children.forEach((element): void => {
        //recursive call
        displayArray(element);
      });
    }
  };

  // the hierarchy gets set on the first click in the page
  if (hierarchy) displayArray(hierarchy); // when page is refreshed we may not have a hierarchy so we need to check if hierarchy was initialized. If it was initialized, invoke displayArray to display the hierarchy

  // This function allows us to use our arrow keys to jump between snapshots. It passes an event and the index of each action-component. Using the arrow keys allows us to highligh snapshots and the enter key jumps to the selected snapshot
  function handleOnKeyDown(e: Partial<KeyboardEvent>, i: number): void {
    let currIndex = i;

    if (e.key === 'ArrowUp') {
      // up arrow key pressed
      currIndex--;
      if (currIndex < 0) return;
      dispatch(changeView(currIndex));
    } else if (e.key === 'ArrowDown') {
      // down arrow key pressed
      currIndex++;
      if (currIndex > hierarchyArr.length - 1) return;
      dispatch(changeView(currIndex));
    } else if (e.key === 'Enter') {
      // enter key pressed
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
          sliderIndex={sliderIndex}
          handleOnkeyDown={handleOnKeyDown}
          viewIndex={viewIndex}
          isCurrIndex={isCurrIndex}
          routePath={snapshot.routePath}
        />
      );
    },
  );

  // JR: this is questionable, why would you always set it to true?
  // useEffect(() => {
  //   setActionView(true);
  // }, [setActionView]);

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
            <a
              onClick={(e) => {
                e.stopPropagation;
                toggleActionContainer();
              }}
              className='toggle'
            >
              {' '}
              {/* JR: updating onClick to stop propagation so that it detects the click only on the arrow and not the parent*/}
              <i />
            </a>
          </aside>
          <div className='collapse'>Collapse</div>
        </div>
        {/* <a type='button' id='recordBtn' onClick={toggleRecord}>
          <i />
          <div
            className='toggle-record'
            style={{ display: 'flex', alignItems: 'center', textAlign: 'right' }}
          >
            Record
          </div>
          {recordingActions ? <Switch defaultChecked /> : <Switch />}
        </a> */}
      </div>
      {actionView ? (
        <div className='action-button-wrapper'>
          <a type='button' id='recordBtn' onClick={toggleRecord}>
            <i />
            <div
              className='toggle-record'
              style={{ display: 'flex', alignItems: 'center', textAlign: 'right' }}
            >
              Record
            </div>
            {recordingActions ? <Switch defaultChecked /> : <Switch />}
          </a>
          <SwitchAppDropdown />
          {/* add new component here for dropdown menu for useStae/ useReducer- ragad */}
         <DropDown
         dropdownSelection = {dropdownSelection}
         setDropdownSelection={setDropdownSelection}
         />
          <div className='action-component exclude'>
            <Button
              className='clear-button'
              variant='contained'
              //style={{ backgroundColor: '#ff6569' }}
              onClick={() => {
                dispatch(emptySnapshots()); // set slider back to zero, visually
                resetSlider();
              }}
              type='button'
            >
              Clear
            </Button>
          </div>
          <div className='snapshots'>
            {dropdownSelection === 'Provider/Consumer' && <ProvConContainer/>}
            {dropdownSelection === 'TimeJump' && 
              Object.keys(routes).map((route, i) => (
                <RouteDescription key={`route${i}`} actions={routes[route]} />
              ))
            }
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ActionContainer;
