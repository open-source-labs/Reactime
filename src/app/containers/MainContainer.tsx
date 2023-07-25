/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import ActionContainer from './ActionContainer';
import TravelContainer from './TravelContainer';
import ButtonsContainer from './ButtonsContainer';
import ErrorContainer from './ErrorContainer';
import StateContainer from './StateContainer';
import {
  addNewSnapshots,
  initialConnect,
  setPort,
  setTab,
  deleteTab,
  noDev,
  setCurrentLocation,
  pause,
} from '../actions/actions';
import { useStoreContext } from '../store';

/*
  This is the main container where everything in our application is rendered
*/

function MainContainer(): JSX.Element {
  
  const [store, dispatch] = useStoreContext(); // we destructure the returned context object from the invocation of the useStoreContext function. Properties not found on the initialState object (store/dispatch) are from the useReducer function invocation in the App component
  
  const { tabs, currentTab, port } = store; // we continue to destructure 'store' and get the tabs/currentTab/port
  
  const [actionView, setActionView] = useState(true); // We create a local state 'actionView' and set it to true

  // this function handles Time Jump sidebar view
  const toggleActionContainer = () => {
    setActionView(!actionView); // sets actionView to the opposite boolean value

    const toggleElem = document.querySelector('aside'); // aside is like an added text that appears "on the side" aside some text.
    toggleElem.classList.toggle('no-aside'); // toggles the addition or the removal of the 'no-aside' class

    const recordBtn = document.getElementById('recordBtn');

    if (recordBtn.style.display === 'none') { // switches whether to display the record toggle button by changing the display property between none and flex
      recordBtn.style.display = 'flex';
    } else {
      recordBtn.style.display = 'none';
    }
  };
  
  // let port;
  useEffect(() => {
    if (port) return; // only open port once so if it exists, do not run useEffect again

    // chrome.runtime allows our application to retrieve our service worker (our eventual bundles/background.bundle.js after running npm run build), details about the manifest, and allows us to listen and respond to events in our application lifecycle.
    const currentPort = chrome.runtime.connect(); // we connect to our service worker

    // listen for a message containing snapshots from the /extension/build/background.js service worker
    currentPort.onMessage.addListener(
      (message: { // parameter message is an object with following type script properties
        action: string; 
        payload: Record<string, unknown>; 
        sourceTab: number 
      }) => {
        const { action, payload, sourceTab } = message; // we destructure message into action, payload, sourceTab
        let maxTab: number;

        if (!sourceTab) { // if the sourceTab doesn't exist or is 0
          const tabsArray: Array<string> = Object.keys(payload); // we create a tabsArray of strings composed of keys from our payload object
          const numTabsArray: number[] = tabsArray.map((tab) => Number(tab)); // we then map out our tabsArray where we convert each string into a number
        
          maxTab = Math.max(...numTabsArray); // we then get the largest tab number value
        }

        switch (action) {
          case 'deleteTab': {
            dispatch(deleteTab(payload));
            break;
          }
          case 'devTools': {
            dispatch(noDev(payload));
            break;
          }
          case 'changeTab': {
            dispatch(setTab(payload));
            break;
          }
          case 'sendSnapshots': {
            dispatch(setTab(sourceTab));
            // set state with the information received from the background script
            dispatch(addNewSnapshots(payload));
            break;
          }
          case 'initialConnectSnapshots': {
            dispatch(initialConnect(payload));
            break;
          }
          case 'setCurrentLocation': {
            dispatch(setCurrentLocation(payload));
            break;
          }
          default:
        }
        return true; // we return true so that the connection stays open, otherwise the message channel will close
      },
    );

    currentPort.onDisconnect.addListener(() => { // used to track when the above connection closes unexpectedly. Remember that it should persist throughout the application lifecycle
      console.log('this port is disconnecting line 53');
    });

    dispatch(setPort(currentPort)); // assign port to state so it could be used by other components
  });

  // Error Page launch IF(Content script not launched OR RDT not installed OR Target not React app)
  if (
    !tabs[currentTab] ||
    !tabs[currentTab].status.reactDevToolsInstalled ||
    !tabs[currentTab].status.targetPageisaReactApp
  ) {
    return <ErrorContainer />;
  }

  const { currLocation, viewIndex, sliderIndex, snapshots, hierarchy, webMetrics } = tabs[currentTab]; // we destructure the currentTab object
  const snapshotView = viewIndex === -1 ? snapshots[sliderIndex] : snapshots[viewIndex]; // if viewIndex is -1, then use the sliderIndex instead

  // cleaning hierarchy and snapshotView from stateless data
  const statelessCleaning = (obj: {
    name?: string;
    componentData?: object;
    state?: string | any;
    stateSnapshot?: object;
    children?: any[];
  }) => {
    const newObj = { ...obj };
    if (newObj.name === 'nameless') {
      delete newObj.name;
    }
    if (newObj.componentData) {
      delete newObj.componentData;
    }
    if (newObj.state === 'stateless') {
      delete newObj.state;
    }
    if (newObj.stateSnapshot) {
      newObj.stateSnapshot = statelessCleaning(obj.stateSnapshot);
    }
    if (newObj.children) {
      newObj.children = [];
      if (obj.children.length > 0) {
        obj.children.forEach((element: { state?: object | string; children?: [] }) => {
          if (element.state !== 'stateless' || element.children.length > 0) {
            const clean = statelessCleaning(element);
            newObj.children.push(clean);
          }
        });
      }
    }
    return newObj;
  };
  const snapshotDisplay = statelessCleaning(snapshotView);
  const hierarchyDisplay = statelessCleaning(hierarchy);

  return (
    <div className='main-container'>
      <div id='bodyContainer' className='body-container'>
        <ActionContainer
          actionView={actionView}
          setActionView={setActionView}
          toggleActionContainer={toggleActionContainer}
        />
        {snapshots.length ? (
          <div className='state-container-container'>
            <StateContainer
              webMetrics={webMetrics}
              viewIndex={viewIndex}
              snapshot={snapshotDisplay}
              hierarchy={hierarchyDisplay}
              snapshots={snapshots}
              currLocation={currLocation}
            />
          </div>
        ) : null}
        <TravelContainer snapshotsLength={snapshots.length} />
        <ButtonsContainer />
      </div>
    </div>
  );
}

export default MainContainer;
