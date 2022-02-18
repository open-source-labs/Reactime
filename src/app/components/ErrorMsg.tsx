/* eslint-disable react/prop-types */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

// takes in the loadingArray and the status and returns the correct message
function parseError(loadingArray: [], status: any): string {
  // console.log('inside func', status);
  // console.log('inside func', loadingArray);

  let stillLoading = true;
  loadingArray.forEach(e => { if (e === false) stillLoading = false; });

  if (stillLoading) return 'Still Loading';
  // check for first in status that is not true
  if (!status.contentScriptLaunched) return 'Content Script Error';
  if (!status.reactDevToolsInstalled) return 'RDT Error';
  if (!status.targetPageisaReactApp) return 'Not React App';
  return 'default';
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function ErrorMsg({
  loadingArray, status, launchContent,
}): JSX.Element {
  switch (parseError(loadingArray, status)) {
    case 'Still Loading':
      return (
        <div>
          Still waiting for checks to complete
        </div>
      );
    case 'Content Script Error':
      return (
        <div>
          Content Script was not launched. Trying reloading the page.
          <br />
          NOTE: By default Reactime only works with URLS starting with localhost
          <br />
          If this is not the case you press the launch button to manually launch the content script.
          <br />
          <button type="button" className="launchContent" onClick={launchContent}> Launch </button>
        </div>
      );
    case 'RDT Error':
      return (
        <div>
          React Dev Tools isnt installed!
          <br />
          <a
            href="https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            NOTE: The React Developer Tools extension is required for Reactime to run, if you do not already have it installed on your browser.
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
