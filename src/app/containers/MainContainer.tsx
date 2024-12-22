/* eslint-disable max-len */
import React, { useState } from 'react';
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
  aReactApp,
  setCurrentLocation,
  disconnected,
  endConnect,
} from '../slices/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MainState, RootState } from '../FrontendTypes';

/*
  This is the main container where everything in our application is rendered
*/

function MainContainer(): JSX.Element {
  const dispatch = useDispatch();

  const { currentTab, tabs, port }: MainState = useSelector((state: RootState) => state.main);

  const [actionView, setActionView] = useState(true); // We create a local state 'actionView' and set it to true

  // this function handles Time Jump sidebar view
  const toggleActionContainer = () => {
    setActionView(!actionView); // sets actionView to the opposite boolean value

    const bodyContainer = document.getElementById('bodyContainer');
    bodyContainer.classList.toggle('collapsed');

    const toggleElem = document.querySelector('aside'); // aside is like an added text that appears "on the side" aside some text.
    toggleElem.classList.toggle('no-aside'); // toggles the addition or the removal of the 'no-aside' class

    const collapse = document.querySelector('.collapse');
    collapse.classList.toggle('hidden');

    const recordBtn = document.getElementById('recordBtn');

    if (recordBtn.style.display === 'none') {
      // switches whether to display the record toggle button by changing the display property between none and flex
      recordBtn.style.display = 'flex';
    } else {
      recordBtn.style.display = 'none';
    }
  };

  // Function handles when Reactime unexpectedly disconnects
  const handleDisconnect = (msg): void => {
    if (msg === 'portDisconnect') dispatch(disconnected());
  };

  // Function to listen for a message containing snapshots from the /extension/build/background.js service worker
  const messageListener = ({
    action,
    payload,
    sourceTab,
  }: {
    action: string;
    payload: Record<string, unknown>;
    sourceTab: number;
  }) => {
    // const { action, payload, sourceTab } = message;
    let maxTab: number;

    if (!sourceTab && action !== 'keepAlive') {
      // if the sourceTab doesn't exist or is 0 and it is not a 'keepAlive' action
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
      // JR 12.20.23 9.53pm added a listener case for sending aReactApp to frontend
      case 'aReactApp': {
        dispatch(aReactApp(payload));
        break;
      }
      case 'changeTab': {
        dispatch(setTab(payload));
        break;
      }
      case 'sendSnapshots': {
        dispatch(setTab(payload));
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
  };

  async function awaitPortConnection() {
    if (port) return; // only open port once so if it exists, do not run useEffect again

    // Connect ot port and assign evaluated result (obj) to currentPort
    const currentPort = await chrome.runtime.connect({ name: 'panel' });

    // If messageListener exists on currentPort, remove it
    while (currentPort.onMessage.hasListener(messageListener))
      currentPort.onMessage.removeListener(messageListener);

    // Add messageListener to the currentPort
    currentPort.onMessage.addListener(messageListener);

    // If handleDisconnect exists on chrome.runtime, remove it
    while (chrome.runtime.onMessage.hasListener(handleDisconnect))
      chrome.runtime.onMessage.removeListener(handleDisconnect);

    // add handleDisconnect to chrome.runtime
    chrome.runtime.onMessage.addListener(handleDisconnect);

    // assign port to state so it could be used by other components
    dispatch(setPort(currentPort));

    dispatch(endConnect());
  }
  awaitPortConnection();

  if (
    !tabs[currentTab] ||
    //@ts-ignore
    !tabs[currentTab].status.reactDevToolsInstalled ||
    //@ts-ignore
    !tabs[currentTab].status.targetPageisaReactApp
  ) {
    // @ts-ignore
    return <ErrorContainer port={port} />;
  }

  const { axSnapshots, currLocation, viewIndex, sliderIndex, snapshots, hierarchy, webMetrics } =
    tabs[currentTab]; // we destructure the currentTab object which is passed in from background.js
  //@ts-ignore
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
          snapshots={snapshots}
          currLocation={currLocation}
        />
        {/* @ts-ignore */}
        {snapshots.length ? (
          <div className='state-container-container'>
            <StateContainer
              // @ts-ignore
              webMetrics={webMetrics}
              // @ts-ignore
              viewIndex={viewIndex}
              snapshot={snapshotDisplay}
              hierarchy={hierarchyDisplay}
              // @ts-ignore
              snapshots={snapshots}
              // @ts-ignore
              currLocation={currLocation}
              axSnapshots={axSnapshots}
            />
          </div>
        ) : null}
        <div className='bottom-controls'>
          {/* @ts-ignore */}
          <TravelContainer snapshotsLength={snapshots.length} />
          <ButtonsContainer />
        </div>
      </div>
    </div>
  );
}

export default MainContainer;
