/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { launchContentScript } from '../slices/mainSlice';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { useDispatch, useSelector } from 'react-redux';
import { MainState, RootState } from '../FrontendTypes';
/*
This is the loading screen that a user may get when first initalizing the application. This page checks:

  1. if the content script has been launched on the current tab
  2. if React Dev Tools has been installed
  3. if target tab contains a compatible React app
*/

function ErrorContainer(): JSX.Element {
  const dispatch = useDispatch();
  const { tabs, currentTitle, currentTab }: MainState = useSelector(
    (state: RootState) => state.main,
  );
  const [loadingArray, setLoading] = useState([true, true, true]); // We create a local state "loadingArray" and set it to an array with three true elements. These will be used as hooks for error checking against a 'status' object that is declared later in a few lines. 'loadingArray' is used later in the return statement to display a spinning loader icon if it's true. If it's false, either a checkmark icon or an exclamation icon will be displayed to the user.
  const titleTracker = useRef(currentTitle); // useRef returns an object with a property 'initialValue' and a value of whatever was passed in. This allows us to reference a value that's not needed for rendering
  const timeout = useRef(null);

  console.log(
    'ErrorContainer state variables: tabs: ',
    tabs,
    'currentTab: ',
    currentTab,
    'currentTitle: ',
  );
  // function that launches the main app
  function launch(): void {
    dispatch(launchContentScript(tabs[currentTab]));
  }

  const status = {
    // We create a status object that we may use later if tabs[currentTab] exists
    contentScriptLaunched: false,
    reactDevToolsInstalled: false,
    targetPageisaReactApp: false,
  };

  if (tabs[currentTab]) {
    // If we do have a tabs[currentTab] object, we replace the status obj we declared above  with the properties of the tabs[currentTab].status
    Object.assign(status, tabs[currentTab].status);
  }

  // hook that sets timer while waiting for a snapshot from the background script, resets if the tab changes/reloads
  useEffect(() => {
    // We declare a function
    function setLoadingArray(i: number, value: boolean) {
      // 'setLoadingArray' checks an element in our 'loadingArray' local state and compares it with passed in boolean argument. If they don't match, we update our local state replacing the selected element with the boolean argument
      if (loadingArray[i] !== value) {
        // this conditional helps us avoid unecessary state changes if the element and the value are already the same
        const loadingArrayClone = [...loadingArray];
        loadingArrayClone[i] = value;
        setLoading(loadingArrayClone);
      }
    }

    if (titleTracker.current !== currentTitle) {
      // if the current tab changes/reloads, we reset loadingArray to it's default [true, true, true]
      titleTracker.current = currentTitle;
      setLoadingArray(0, true);
      setLoadingArray(1, true);
      setLoadingArray(2, true);

      if (timeout.current) {
        // if there is a current timeout set, we clear it
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    }

    if (!status.contentScriptLaunched) {
      // if content script hasnt been launched/found, set a timer or immediately update 'loadingArray' state

      if (loadingArray[0] === true) {
        // if loadingArray[0] is true, then that means our timeout.current is still null so we now set it to a setTimeout function that will flip loadingArray[0] to false after 3 seconds
        timeout.current = setTimeout(() => {
          setLoadingArray(0, false);
        }, 3000); // increased from 1500
      }
    } else {
      setLoadingArray(0, false); // if status.contentScriptLaunched is true, that means timeout.current !== null. This means that useEffect was triggered previously.
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
  }, [status, currentTitle, timeout, loadingArray]); // within our dependency array, we're keeping track of if the status, currentTitle/tab, timeout, or loadingArray changes and we re-run the useEffect hook if they do

  return (
    <div className='error-container'>
      <img src='../assets/whiteBlackSquareLogo.png' alt='Reactime Logo' height='50px' />

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
