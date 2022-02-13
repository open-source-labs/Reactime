import React, { useEffect, useState } from 'react';
import { useStoreContext } from '../store';

function ErrorContainer(props): any {
  const [store, dispatch] = useStoreContext();
  const { tabs, currentTab } = store;

  function contentScriptCheck() {
    // if (arg !== undefined && arg.reactDevToolsInstalled === false) {
    //   return (
    //     <p> React Dev Tools not installed! </p>
    //   );
    // }
    // return <p> React Dev Tools found </p>;
  }
  console.log(currentTab);
  console.log(tabs[currentTab]);


  return (
    <div className="error-container">
      <img src="../assets/logo-no-version.png" alt="Reactime Logo" height="50px" />

      <h2>
        Launching Reactime on tab:
        {' '}
        {currentTab}
      </h2>

      <div className="loaderChecks">
        <p>Checking if a content script has been launched on this tab</p>
        <p>Checking if React Dev Tools has been installed</p>
        <p>Checking if this is React app</p>
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
      {/* <div>
        {mynewFunc() }
      </div> */}
    </div>
  );
}

export default ErrorContainer;
