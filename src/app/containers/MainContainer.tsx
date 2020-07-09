import React, { useEffect } from 'react';
import HeadContainer from './HeadContainer.tsx';
import ActionContainer from './ActionContainer.tsx';
import StateContainer from './StateContainer.tsx';
import TravelContainer from './TravelContainer.tsx';
import ButtonsContainer from './ButtonsContainer.tsx';
import {
  addNewSnapshots, initialConnect, setPort, setTab, deleteTab,
} from '../actions/actions.ts';
import { useStoreContext } from '../store.tsx';

function MainContainer() {
  const [store, dispatch] = useStoreContext();
  const { tabs, currentTab, port: currentPort } = store;

  // add event listeners to background script
  useEffect(() => {
    // only open port once
    if (currentPort) return;
    // open connection with background script
    const port = chrome.runtime.connect();

    // listen for a message containing snapshots from the background script
    port.onMessage.addListener((message:{action:string, payload:object, sourceTab:number}) => {
      const { action, payload, sourceTab } = message;
      let maxTab;
      if (!sourceTab) {
        const tabsArray = Object.keys(payload);
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
        default:
      }
      return true;
    });

    port.onDisconnect.addListener(() => {
      // disconnecting
    });

    // assign port to state so it could be used by other components
    dispatch(setPort(port));
  });

  if (!tabs[currentTab]) {
    return (
      <div className="error-container">
        <a
          href="reactime.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          No React application found. Please visit reactime.io to more info.
        </a>
      </div>
    );
  }
  const {
    viewIndex,
    sliderIndex,
    snapshots,
    hierarchy,
  } = tabs[currentTab];

  // if viewIndex is -1, then use the sliderIndex instead
  const snapshotView = viewIndex === -1 ? snapshots[sliderIndex] : snapshots[viewIndex];
  // gabi :: cleannign hierarchy and snapshotView from stateless data
  const statelessCleanning = (obj:{name?:string; componentData?:object; state?:object|string;stateSnaphot?:object; children?:[]}) => {
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
    if (newObj.stateSnaphot) {
      newObj.stateSnaphot = statelessCleanning(obj.stateSnaphot);
    }
    if (newObj.children) {
      newObj.children = [];
      if (obj.children.length > 0) {
        obj.children.forEach((element:{state:object|string, children?:[]}) => {
          if (element.state !== 'stateless' || element.children.length > 0) {
            const clean = statelessCleanning(element);
            newObj.children.push(clean);
          }
        });
      }
    }
    return newObj;
  };
  const snapshotDisplay = statelessCleanning(snapshotView);
  const hierarchyDisplay = statelessCleanning(hierarchy);
  return (
    <div className="main-container">
      <HeadContainer />
      <div className="body-container">
        <ActionContainer />
        {snapshots.length ? <StateContainer viewIndex={viewIndex} snapshot={snapshotDisplay} hierarchy={hierarchyDisplay} snapshots={snapshots} /> : null}
        <TravelContainer snapshotsLength={snapshots.length} />
        <ButtonsContainer />
      </div>
    </div>
  );
}

export default MainContainer;
