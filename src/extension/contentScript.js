let reloaded = true;

// listening for messages from npm package
window.addEventListener('message', msg => {
  // post initial Message to npm package
  const { action } = msg.data;
  if (action === 'recordSnap') {
    if (reloaded) {
      reloaded = false;
      // since contentScript is run everytime a page is refreshed
      // tell the background script that the tab has reloaded
      chrome.runtime.sendMessage({ action: 'tabReload' });
    }

    chrome.runtime.sendMessage(msg.data);
  }
});

// listening for messages from background.js
chrome.runtime.onMessage.addListener(request => {
  // send the message to npm package
  const { action } = request;
  switch (action) {
    case 'jumpToSnap':
    case 'setLock':
    case 'setPause':
      window.postMessage(request);
      break;
    default:
      break;
  }
});

window.postMessage({ action: 'contentScriptStarted' });
