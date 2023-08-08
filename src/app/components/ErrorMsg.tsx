/* eslint-disable react/prop-types */
import React from 'react';

/*
This file determines what text will be displayed to the user if any one of the following fail to load:

  1. if the content script has been launched on the current tab
  2. if React Dev Tools has been installed
  3. if target tab contains a compatible React app

*/

// parses loadingArray and status and returns the correct message
function parseError(loadingArray: [], status: Record<string, unknown>): string {
  let stillLoading = true;
  loadingArray.forEach((e) => {
    if (e === false) stillLoading = false;
  });

  if (stillLoading) return 'default'; // As long as everything is still loading dont diplay an error message

  // If we're done loading everything, return the first status that fails
  if (!status.contentScriptLaunched) return 'Content Script Error';
  if (!status.reactDevToolsInstalled) return 'RDT Error';
  if (!status.targetPageisaReactApp) return 'Not React App';
  return 'default';
}

function ErrorMsg({ loadingArray, status, launchContent }): JSX.Element {
  switch (parseError(loadingArray, status)) { // parseError returns a string based on the loadingArray and status. The returned string is matched to a case so that an appropriate error message will be displayed to the user
    case 'Content Script Error':
      return (
        <div>
          Could not connect to the Target App. Try closing Reactime and reloading the page.
          <br />
          <br />
          If you encounter this error on the initial launch of Reactime, refresh the webpage you are developing. 
          <br />
          If Reactime is running as an iframe in your developer tools, right click on the Reactime application and click 'Reload Frame'
          <br />
          <br />
          NOTE: By default Reactime only launches the content script on URLS starting with
          localhost.
          <br />
          If your target URL does not match, you can manually launch the content script below.
          <br />
          <br />
          <button type='button' className='launchContentButton' onClick={launchContent}>
            {' '}
            Launch{' '}
          </button>
        </div>
      );
    case 'RDT Error':
      return (
        <div>
          React Dev Tools is not installed!
          <br />
          <br />
          If you encounter this error on the initial launch of Reactime, refresh the webpage you are developing. 
          <br />
          If Reactime is running as an iframe in your developer tools, right click on the Reactime application and click 'Reload Frame'
          <br />
          <br />
          <a
            href='https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en'
            target='_blank'
            rel='noopener noreferrer'
          >
            NOTE: The React Developer Tools extension is required for Reactime to run, if you do not
            already have it installed on your browser.
          </a>
        </div>
      );
    case 'Not React App':
      return (
        <div>
          The Target app is either not a React application or is not compatible with Reactime
        </div>
      );
    default:
      return null;
  }
}

export default ErrorMsg;
