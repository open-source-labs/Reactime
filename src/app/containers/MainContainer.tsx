/* eslint-disable max-len */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Split from 'react-split';
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

function MainContainer(): any {
  const [store, dispatch] = useStoreContext();
  const {
    tabs, currentTab, port: currentPort, split,
  } = store;
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

  // Error Page launch IF(Content script not launched OR RDT not installed OR Target not React app)
  if (!tabs[currentTab] || !tabs[currentTab].status.reactDevToolsInstalled || !tabs[currentTab].status.targetPageisaReactApp) {
    return (
      <ErrorContainer />
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

  function handleSplit(currentSplitMode: boolean): JSX.Element {
    if (!currentSplitMode) {
      return (
        <div className="state-container-container">
          <StateContainer
            webMetrics={webMetrics}
            viewIndex={viewIndex}
            snapshot={snapshotDisplay}
            hierarchy={hierarchyDisplay}
            snapshots={snapshots}
            currLocation={currLocation}
          />
        </div>
      );
    }
    return (
      <Split
        sizes={[50, 50]}
        minSize={200}
        snapOffset={1}
        className="split"
        gutterStyle={function () {
          return {
            backgroundColor: 'dimgrey',
            width: '8px',
          };
        }}
      >
        <StateContainer
          webMetrics={webMetrics}
          viewIndex={viewIndex}
          snapshot={snapshotDisplay}
          hierarchy={hierarchyDisplay}
          snapshots={snapshots}
          currLocation={currLocation}
        />
        <StateContainer
          webMetrics={webMetrics}
          viewIndex={viewIndex}
          snapshot={snapshotDisplay}
          hierarchy={hierarchyDisplay}
          snapshots={snapshots}
          currLocation={currLocation}
        />
      </Split>
    );
  }

  return (
    <div className="main-container">
      <div id="bodyContainer" className="body-container">
        <ActionContainer
          actionView={actionView}
          setActionView={setActionView}
          toggleActionContainer={toggleActionContainer}
        />
        {snapshots.length ? (handleSplit(split)) : null}
        <TravelContainer snapshotsLength={snapshots.length} />
        <ButtonsContainer />
      </div>
    </div>
  );
}

export default MainContainer;
