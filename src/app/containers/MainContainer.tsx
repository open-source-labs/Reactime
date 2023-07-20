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
  // we destructure the returned context object from the invocation of the useStoreContext function. Properties not found on the initialState object (store/dispatch) are from the useReducer function invocation in the App component
  const [store, dispatch] = useStoreContext();
  // we continue to destructure 'store' and get the tabs/currentTab/port
  const { tabs, currentTab, port } = store;
  // We create a local state 'actionView' and set it to true
  const [actionView, setActionView] = useState(true);

  // this function handles Time Jump sidebar view
  const toggleActionContainer = () => {
    // sets actionView to the opposite boolean value
    setActionView(!actionView);

    // aside is like an added text that appears "on the side" aside some text.
    const toggleElem = document.querySelector('aside');
    // toggles the addition or the removal of the 'no-aside' class
    toggleElem.classList.toggle('no-aside');

    const recordBtn = document.getElementById('recordBtn');
    // switches whether to display the record toggle button by changing the display property between none and flex
    if (recordBtn.style.display === 'none') {
      recordBtn.style.display = 'flex';
    } else {
      recordBtn.style.display = 'none';
    }
  };
  // let port;
  useEffect(() => {
    // only open port once so if it exists, do not run useEffect again
    if (port) return;

    // chrome.runtime allows our application to retrieve our service worker (our eventual bundles/background.bundle.js after running npm run build), details about the manifest, and allows us to listen and respond to events in our application lifecycle.
    // we connect to our service worker
    const currentPort = chrome.runtime.connect();

    // listen for a message containing snapshots from the background script
    currentPort.onMessage.addListener(
      // parameter message is an object with following type script properties
      (message: { 
        action: string; 
        payload: Record<string, unknown>; 
        sourceTab: number 
      }) => {
        // we destructure message into action, payload, sourceTab
        const { action, payload, sourceTab } = message;
        let maxTab: number;

        // if the sourceTab doesn't exist or is 0
        if (!sourceTab) {
          // we create a tabsArray of strings composed of keys from our payload object
          const tabsArray: Array<string> = Object.keys(payload);
          // we then map out our tabsArray where we convert each string into a number
          const numTabsArray: number[] = tabsArray.map((tab) => Number(tab));
          // we then get the largest tab number value
          maxTab = Math.max(...numTabsArray);
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

        // we return true so that the connection stays open, otherwise the message channel will close
        return true;
      },
    );

    // Below is used to track bugs in case the above connection closes. Remember that it should persist throughout the application lifecycle
    currentPort.onDisconnect.addListener(() => {
      console.log('this port is disconnecting line 79');
      // disconnecting
    });

    // assign port to state so it could be used by other components
    dispatch(setPort(currentPort));

    // !!!!! NOTE: There is no dependency array declared here. This may result in an infinite loop. Needs more investigation !!!!!
  });

  // Error Page launch IF(Content script not launched OR RDT not installed OR Target not React app)
  if (
    !tabs[currentTab] ||
    !tabs[currentTab].status.reactDevToolsInstalled ||
    !tabs[currentTab].status.targetPageisaReactApp
  ) {
    return <ErrorContainer />;
  }

  const { currLocation, viewIndex, sliderIndex, snapshots, hierarchy, webMetrics } =
    tabs[currentTab];
  // if viewIndex is -1, then use the sliderIndex instead
  const snapshotView = viewIndex === -1 ? snapshots[sliderIndex] : snapshots[viewIndex];

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
