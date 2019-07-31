// listening for messages from npm package
window.addEventListener('message', (msg) => {
  // post initial Message to npm package
  const { action } = msg.data;
  if (action === 'recordSnap') chrome.runtime.sendMessage(msg.data);
});

// listening for messages from background.js
chrome.runtime.onMessage.addListener((request) => {
  // send the message to npm package
  const { action } = request;
  switch (action) {
    case 'jumpToSnap':
    case 'stepToSnap':
    case 'setLock':
    case 'setPause':
      window.postMessage(request);
      break;
    default:
      break;
  }
});

// since contentScript is run everytime a page is refreshed
// tell the background script that the tab has reloaded
chrome.runtime.sendMessage({ action: 'tabReload' });

window.postMessage({ action: 'contentScriptStarted' });
