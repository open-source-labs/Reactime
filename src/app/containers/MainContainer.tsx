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
  startReconnect,
} from '../slices/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MainState, RootState } from '../FrontendTypes';
import { toast } from 'react-hot-toast';
import { REACTIME_TOAST_DEFAULTS } from '../utils/toastConfig';

/*
  This is the main container where everything in our application is rendered
*/

function MainContainer(): JSX.Element {
  const dispatch = useDispatch();

  const { currentTab, tabs, port }: MainState = useSelector((state: RootState) => state.main);

  // Function handles when Reactime unexpectedly disconnects
  const handleDisconnect = (msg): void => {
    if (msg !== 'portDisconnect') return;
    dispatch(disconnected());

    // Surface the disconnect with an actionable toast: one-click reconnect
    // without forcing the user to find the Reconnect button. The fixed toast id
    // dedupes repeated disconnect messages so we don't stack toasts if Chrome
    // fires multiple onDisconnect events in quick succession.
    toast.error(
      (t) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>Lost connection to the tab</span>
          <button
            type='button'
            onClick={() => {
              dispatch(startReconnect());
              toast.dismiss(t.id);
            }}
            style={{
              background: 'var(--color-primary)',
              color: 'var(--text-primary)',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Reconnect
          </button>
        </span>
      ),
      {
        ...REACTIME_TOAST_DEFAULTS,
        id: 'port-disconnected',
        duration: 8000,
      },
    );
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
    let maxTab: number;

    // Add validation check
    if (!sourceTab && action !== 'keepAlive') {
      // Ensure payload exists and is an object
      if (payload && typeof payload === 'object') {
        const tabsArray = Object.keys(payload);
        const numTabsArray = tabsArray.map((tab) => Number(tab));
        maxTab = numTabsArray.length > 0 ? Math.max(...numTabsArray) : 0;
      } else {
        console.warn('Invalid payload received:', payload);
        maxTab = 0;
      }
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
        <ActionContainer snapshots={snapshots} currLocation={currLocation} />
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
