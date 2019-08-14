import React, { useEffect, useState } from 'react';
import HeadContainer from './HeadContainer';
import ActionContainer from './ActionContainer';
import StateContainer from './StateContainer';
import TravelContainer from './TravelContainer';
import ButtonsContainer from './ButtonsContainer';

import {
  addNewSnapshots, initialConnect, setPort, setTab, deleteTab,
} from '../actions/actions';
import { useStoreContext } from '../store';

function MainContainer() {
  const [npmExists, setnpm] = useState(false);
  const [store, dispatch] = useStoreContext();
  const { tabs, currentTab, port: currentPort } = store;

  // add event listeners to background script
  useEffect(() => {
    // only open port once
    if (currentPort) return;
    // open connection with background script
    const port = chrome.runtime.connect();

    // listen for a message containing snapshots from the background script
    port.onMessage.addListener(message => {
      const { action, payload, sourceTab } = message;
      switch (action) {
        case 'deleteTab': {
          dispatch(deleteTab(payload));
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
          setnpm(true);
          break;
        }
        default:
      }
    });

    port.onDisconnect.addListener(() => {
      // disconnecting
    });

    // assign port to state so it could be used by other components
    dispatch(setPort(port));
  });

  if (!npmExists) return <div style={{ color: 'black' }}>please install our npm package in your app</div>;
  const { viewIndex, sliderIndex, snapshots } = tabs[currentTab];

  // if viewIndex is -1, then use the sliderIndex instead
  const snapshotView = viewIndex === -1 ? snapshots[sliderIndex] : snapshots[viewIndex];
  return (
    <div className="main-container">
      <HeadContainer />
      <div className="body-container">
        <ActionContainer />
        {snapshots.length ? <StateContainer snapshot={snapshotView} /> : null}
        <TravelContainer snapshotsLength={snapshots.length} />
        <ButtonsContainer />
      </div>
    </div>
  );
}

export default MainContainer;
