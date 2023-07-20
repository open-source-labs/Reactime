/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { launchContentScript } from '../actions/actions';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { useStoreContext } from '../store';

/*
This is the loading screen that a user may get when first initalizing the application. This page checks:

  1. if the content script has been launched on the current tab
  2. if React Dev Tools has been installed
  3. if target tab contains a compatible React app
*/

function ErrorContainer(): JSX.Element {
  // We destructure the returned context object from the invocation of the useStoreContext function. Properties not found on the initialState object (store/dispatch) are from the useReducer function invocation in the App component
  const [store, dispatch] = useStoreContext();
  // We continue to destructure store and get the tabs/currentTab/port
  const { tabs, currentTitle, currentTab } = store;

  // We create a local state "loadingArray" and set it to an array with three true elements. These will be used as hooks for error checking against a 'status' object that is declared later in a few lines.
  // This loadingArray is used later in the return statement to display a spinning loader icon if it's true. If it's false, either a checkmark icon or an exclamation icon will be displayed to the user.
  const [loadingArray, setLoading] = useState([true, true, true]);

  // useRef returns an object with a property 'initialValue' and a value of whatever was passed in. This allows us to reference a value that's not needed for rendering
  const titleTracker = useRef(currentTitle);
  const timeout = useRef(null);

  // function that launches the main app
  function launch(): void {
    dispatch(launchContentScript(tabs[currentTab]));
  }

  // We create a status object that we may use later if tabs[currentTab] exists
  const status = {
    contentScriptLaunched: false,
    reactDevToolsInstalled: false,
    targetPageisaReactApp: false,
  };

  // If we do have a tabs[currentTab] object, we replace the status obj we declared above  with the properties of the tabs[currentTab].status
  if (tabs[currentTab]) {
    Object.assign(status, tabs[currentTab].status);
  }

  // hook that sets timer while waiting for a snapshot from the background script, resets if the tab changes/reloads
  useEffect(() => {
    // We declare a function setLoadingArray which checks our local state loadingArray and compares it with a boolean value. If they don't match, we set the element to the passed in value boolean and update our local state with the new loadingArray 
    function setLoadingArray(i: number, value: boolean) {
      // this conditional helps us avoid unecessary state changes if the element and the value are already the same
      if (loadingArray[i] !== value) {
        const loadingArrayClone = [...loadingArray];
        loadingArrayClone[i] = value;
        setLoading(loadingArrayClone);
      }
    }

    // if the current tab changes/reloads, we reset loadingArray to it's default [true, true, true]
    if (titleTracker.current !== currentTitle) {
      titleTracker.current = currentTitle;

      setLoadingArray(0, true);
      setLoadingArray(1, true);
      setLoadingArray(2, true);

      // if there is a current timeout set, we clear it
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    }

    // We check our status object and see if contentScriptLaunched is false
    // if content script hasnt been found, set timer or immediately resolve
    if (!status.contentScriptLaunched) {
      // if contentScriptLaunched is false, we check our loadingArray state at position [0]
      if (loadingArray[0] === true) {
        // if the element was true, then that means our timeout.current is still null so we now set it to a setTimeout function that will flip loadingArray[0] to false after 1.5 seconds
        timeout.current = setTimeout(() => {
          setLoadingArray(0, false);
        }, 1500);
      }
    } else {
      // if status.contentScriptLaunched is true, that means timeout.current !== null. This means that useEffect was triggered previously.
      setLoadingArray(0, false);
    }

    // The next two if statements are written in a way to allow the checking of 'content script hook', 'reactDevTools check', and 'target page is a react app' to be run in chronological order.
    if (loadingArray[0] === false && status.contentScriptLaunched === true) {
      setLoadingArray(1, false);
    }
    if (loadingArray[1] === false && status.reactDevToolsInstalled === true) {
      setLoadingArray(2, false);
    }

    // Unload async function when Error Container is unmounted
    return () => {
      clearTimeout(timeout.current);
    };

  // within our dependency array, we're keeping track of if the status, currentTitle/tab, timeout, or loadingArray changes and we re-run the useEffect hook if they do
  }, [status, currentTitle, timeout, loadingArray]);

  return (
    <div className='error-container'>
      <img src='../assets/logo-no-version.png' alt='Reactime Logo' height='50px' />

      <h2>Launching Reactime on tab: {currentTitle}</h2>

      <div className='loaderChecks'>
        <p>Checking if content script has been launched on current tab</p>
        <Loader loading={loadingArray[0]} result={status.contentScriptLaunched} />

        <p>Checking if React Dev Tools has been installed</p>
        <Loader loading={loadingArray[1]} result={status.reactDevToolsInstalled} />

        <p>Checking if target is a compatible React app</p>
        <Loader loading={loadingArray[2]} result={status.targetPageisaReactApp} />
      </div>

      <br />
      <div className='errorMsg'>
        <ErrorMsg loadingArray={loadingArray} status={status} launchContent={launch} />
      </div>
      <br />
      <a
        href='https://github.com/open-source-labs/reactime'
        target='_blank'
        rel='noopener noreferrer'
      >
        Please visit the Reactime Github for more info.
      </a>
    </div>
  );
}

export default ErrorContainer;
