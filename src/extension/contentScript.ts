/* eslint-disable @typescript-eslint/no-inferrable-types */
// import 'core-js';

let firstMessage = true;

// listening for window messages
window.addEventListener('message', msg => { // runs automatically every second
  // window listener picks up the message it sends, so we should filter
  // messages sent by contentscrip
  if (firstMessage) {
    // tell the background script that the tab has reloaded
    chrome.runtime.sendMessage({ action: 'tabReload' });
    firstMessage = false;
  }

  // post initial Message to background.js
  const { action }: { action: string } = msg.data;

  if (action === 'recordSnap') { // this is firing on page load
    chrome.runtime.sendMessage(msg.data);
  }
});

// listening for messages from the UI
chrome.runtime.onMessage.addListener(request => { // seems to never fire
  // send the message to npm package
  const { action }: { action: string } = request;
  switch (action) {
    case 'jumpToSnap':
      chrome.runtime.sendMessage(request);
      window.postMessage(request, '*');
      break;
    case 'setLock':
    case 'setPause':
      window.postMessage(request, '*');
      break;
    default:
      break;
  }
  return true; // attempt to fix port closing console error
});

chrome.runtime.sendMessage({ action: 'injectScript' });
