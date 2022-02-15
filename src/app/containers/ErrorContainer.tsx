import React, { useState, useEffect, useRef } from 'react';
import Loader from '../components/Loader';
import { useStoreContext } from '../store';

function ErrorContainer(props): JSX.Element {
  const [store, dispatch] = useStoreContext();
  const { tabs, currentTitle, currentTab } = store;

  const [loadingArray, setLoading] = useState([true, true, true]);
  const [resultArray, setResult] = useState([false, true, true]);
  const titleTracker = useRef(currentTitle);
  const timeout = useRef(null);

  // timer waiting for a snapshot from the background script, resets if the tab changes/reloads
  useEffect(() => {
    // check for tab reload/change
    if (titleTracker.current !== currentTitle) {
      titleTracker.current = currentTitle;
      const newArray = [...loadingArray];
      newArray[0] = true;
      setLoading(newArray);
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null;
      }
    }

    if (loadingArray[0] === true) {
      timeout.current = setTimeout(() => {
        const newArray = [...loadingArray];
        newArray[0] = false;
        setLoading(newArray);
        // grey out other checkers
      }, 4000);
    }
  }, [currentTitle, loadingArray]);

  return (
    <div className="error-container">
      <img src="../assets/logo-no-version.png" alt="Reactime Logo" height="50px" />

      <h2>
        Launching Reactime on tab:
        {' '}
        {currentTitle}
      </h2>

      <div className="loaderChecks">
        <p>Waiting for content script on this tab</p>
        <Loader loading={loadingArray[0]} result={resultArray[0]} />

        <p>Checking if React Dev Tools has been installed</p>
        <Loader loading={loadingArray[1]} result={resultArray[1]} />

        <p>Checking if this is React app</p>
        <Loader loading={loadingArray[2]} result={resultArray[2]} />

      </div>
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

export default ErrorContainer;
