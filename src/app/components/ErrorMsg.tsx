/* eslint-disable react/prop-types */
import React from 'react';

// parses loadingArray and status and returns the correct message
function parseError(loadingArray: [], status: any): string {
  let stillLoading = true;
  loadingArray.forEach(e => { if (e === false) stillLoading = false; });
  // As long as everything is still loading dont diplay an error message
  if (stillLoading) return 'default';
  // Return first status that fails
  if (!status.contentScriptLaunched) return 'Content Script Error';
  if (!status.reactDevToolsInstalled) return 'RDT Error';
  if (!status.targetPageisaReactApp) return 'Not React App';
  return 'default';
}

function ErrorMsg({
  loadingArray, status, launchContent,
}): JSX.Element {
  switch (parseError(loadingArray, status)) {
    case 'Content Script Error':
      return (
        <div>
          Could not connect to the Target App. Try closing Reactime and reloading the page.
          <br />
          NOTE: By default Reactime only launches the content script on URLS starting with localhost.
          <br />
          If your target URL does not match, you can manually launch the content script below.
          <br />
          <br />
          <button type="button" className="launchContentButton" onClick={launchContent}> Launch </button>
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
