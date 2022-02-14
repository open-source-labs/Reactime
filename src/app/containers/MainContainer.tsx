import React, { useEffect, useState } from 'react';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';
import ButtonsContainer from './ButtonsContainer';
import {
  addNewSnapshots,
  initialConnect,
  setPort,
  setTab,
  deleteTab,
  setCurrentLocation,
} from '../actions/actions';
import { useStoreContext } from '../store';

function MainContainer(): any {
  const [store, dispatch] = useStoreContext();
  const { tabs, currentTab, port: currentPort } = store;
  const [actionView, setActionView] = useState(true);
  // this function handles Time Jump sidebar view
  const toggleActionContainer = () => {
    setActionView(!actionView);
    const toggleElem = document.querySelector('aside');
    toggleElem.classList.toggle('no-aside');
  };

  useEffect(() => {
    // only open port once
    if (currentPort) return;
    // open long-lived connection with background script
    const port = chrome.runtime.connect();

    // listen for a message containing snapshots from the background script
    port.onMessage.addListener(
      (message: {
        action: string;
        payload: Record<string, unknown>;
        sourceTab: number;
      }) => {
        const { action, payload, sourceTab } = message;
        let maxTab;
        if (!sourceTab) {
          const tabsArray: any = Object.keys(payload);
          maxTab = Math.max(...tabsArray);
        }
        switch (action) {
          case 'deleteTab': {
            dispatch(deleteTab(payload));
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
            dispatch(setTab(maxTab));
            dispatch(initialConnect(payload));
            break;
          }
          case 'setCurrentLocation': {
            dispatch(setCurrentLocation(payload));
            break;
          }
          default:
        }
        return true;
      },
    );

    port.onDisconnect.addListener(() => {
      console.log('this port is disconeccting line 79');
      // disconnecting
    });

    // assign port to state so it could be used by other components
    dispatch(setPort(port));
  });

  if (!tabs[currentTab]) {
    return (
      <div className="error-container">
        <img src="../assets/logo-no-version.png" height="50px" />
        <a
          href="https://reactime.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          No React application found. Please visit reactime.io to more info.
        </a>
        <p>
          If you are using a React application, make sure tha you application is running in development mode.
          <br />
          NOTE: The React Developer Tools extension is also required for Reactime to run, if you do not already have it installed on your browser.
        </p>
      </div>
    );
  }
  const {
    currLocation, viewIndex, sliderIndex, snapshots, hierarchy, webMetrics,
  } = tabs[currentTab];
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
        obj.children.forEach(
          (element: { state?: object | string; children?: [] }) => {
            if (element.state !== 'stateless' || element.children.length > 0) {
              const clean = statelessCleaning(element);
              newObj.children.push(clean);
            }
          },
        );
      }
    }
    return newObj;
  };
  const snapshotDisplay = statelessCleaning(snapshotView);
  const hierarchyDisplay = statelessCleaning(hierarchy);

  return (
    <div className="main-container">
      <div id="bodyContainer" className="body-container1">
        <ActionContainer
          actionView={actionView}
          setActionView={setActionView}
          toggleActionContainer={toggleActionContainer}
        />
        {snapshots.length ? (
          <StateContainer
            webMetrics={webMetrics}
            viewIndex={viewIndex}
            snapshot={snapshotDisplay}
            hierarchy={hierarchyDisplay}
            snapshots={snapshots}
            currLocation={currLocation}
          />
        ) : null}
        <TravelContainer snapshotsLength={snapshots.length} />
        <ButtonsContainer />
      </div>
    </div>
  );
}

export default MainContainer;
