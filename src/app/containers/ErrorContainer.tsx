/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { useStoreContext } from '../store';

function ErrorContainer(props): JSX.Element {
  const [store] = useStoreContext();
  const { tabs, currentTitle, currentTab } = store;
  // hooks for error checks
  const [loadingArray, setLoading] = useState([true, true, true]);
  const titleTracker = useRef(currentTitle);
  const timeout = useRef(null);

  // check if tabObj exists > set status
  const status = { contentScriptLaunched: false, reactDevToolsInstalled: false, targetPageisaReactApp: false };
  if (tabs[currentTab]) {
    Object.assign(status, tabs[currentTab].status);
  }

  // console.log('in error container, contentScriptLaunched =', contentScriptLaunched);
  // console.log('in error container, reactDevToolsInstalled =', reactDevToolsInstalled);
  // console.log('in error container, targetPageisaReactApp =', targetPageisaReactApp);

  // timer waiting for a snapshot from the background script, resets if the tab changes/reloads
  useEffect(() => {
    function setLoadingArray(i: number, value: boolean) {
      if (loadingArray[i] !== value) { // avoid unecessary state changes
        const loadingArrayClone = [...loadingArray];
        loadingArrayClone[i] = value;
        setLoading(loadingArrayClone);
      }
    }

    // check for tab reload/change
    if (titleTracker.current !== currentTitle) {
      titleTracker.current = currentTitle;
      setLoadingArray(0, true);
      setLoadingArray(1, true);
      setLoadingArray(2, true);
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    }
    // if content script hasnt been found, set timer
    if (!status.contentScriptLaunched) {
      if (loadingArray[0] === true) {
        timeout.current = setTimeout(() => {
          setLoadingArray(0, false);
        }, 2000);
      }
    } else {
      setLoadingArray(0, false);
      setLoadingArray(1, false);
      // TODO: SHOULD THIS AUTOMATICALLY SET LOADING ARRAY 3 TO NOT LOADING? TEST WITH RDT TURNED OFF
      // works on a reactapp like tictactoe but it doesn't work on the server when RDT disabled
      setLoadingArray(2, false);
    }
  }, [status.contentScriptLaunched, currentTitle, timeout, loadingArray]);

  return (
    <div className="error-container">
      <img src="../assets/logo-no-version.png" alt="Reactime Logo" height="50px" />

      <h2>
        Launching Reactime on tab:
        {' '}
        {currentTitle}
      </h2>

      <div className="loaderChecks">
        <p>Checking if content script has been launched on current tab</p>
        <Loader loading={loadingArray[0]} result={status.contentScriptLaunched} />

        <p>Checking if React Dev Tools has been installed</p>
        <Loader loading={loadingArray[1]} result={status.reactDevToolsInstalled} />

        <p>Checking if this is React app</p>
        <Loader loading={loadingArray[2]} result={status.targetPageisaReactApp} />

      </div>

      <br />
      <div className="errorMsg">
        <ErrorMsg loadingArray={loadingArray} status={status} />
      </div>

      <br />
      {/* <a
        href="https://reactime.io/"
        target="_blank"
        rel="noopener noreferrer"
      >
        No React application found. Please visit reactime.io to more info.
      </a> */}
      <p>
        <br />
        NOTE: The React Developer Tools extension is also required for Reactime to run, if you do not already have it installed on your browser.
      </p>
    </div>
  );
}

export default ErrorContainer;
