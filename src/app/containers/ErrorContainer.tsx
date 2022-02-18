/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { launchContentScript } from '../actions/actions';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { useStoreContext } from '../store';

function ErrorContainer(props): JSX.Element {
  const [store, dispatch] = useStoreContext();
  const { tabs, currentTitle, currentTab } = store;
  // hooks for error checks
  const [loadingArray, setLoading] = useState([true, true, true]);
  const titleTracker = useRef(currentTitle);
  const timeout = useRef(null);

  function launch(): void{ dispatch(launchContentScript(tabs[currentTab])); }

  // check if tabObj exists > set status
  const status = { contentScriptLaunched: false, reactDevToolsInstalled: false, targetPageisaReactApp: false };
  if (tabs[currentTab]) { Object.assign(status, tabs[currentTab].status); }

  // hook that sets timer while waiting for a snapshot from the background script, resets if the tab changes/reloads
  useEffect(() => {
    function setLoadingArray(i: number, value: boolean) {
      if (loadingArray[i] !== value) { // avoid unecessary state changes
        const loadingArrayClone = [...loadingArray];
        loadingArrayClone[i] = value;
        setLoading(loadingArrayClone);
      }
    }

    // check for tab reload/change: reset loadingArray
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
    // if content script hasnt been found, set timer or immediately resolve
    if (!status.contentScriptLaunched) {
      if (loadingArray[0] === true) {
        timeout.current = setTimeout(() => { setLoadingArray(0, false); }, 1500);
      }
    } else {
      setLoadingArray(0, false);
    }
    if (loadingArray[0] === false && status.contentScriptLaunched === true) {
      setLoadingArray(1, false);
    }
    if (loadingArray[1] === false && status.reactDevToolsInstalled === true) {
      setLoadingArray(2, false);
    }
  }, [status, currentTitle, timeout, loadingArray]);

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

        <p>Checking if target is a compatible React app</p>
        <Loader loading={loadingArray[2]} result={status.targetPageisaReactApp} />

      </div>

      <br />
      <div className="errorMsg">
        <ErrorMsg loadingArray={loadingArray} status={status} launchContent={launch} />
      </div>
    </div>
  );
}

export default ErrorContainer;
