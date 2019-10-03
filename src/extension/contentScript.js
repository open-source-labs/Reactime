let firstMessage = true;

// listening for messages from npm package
window.addEventListener('message', msg => {
  // window listener picks up the message it sends, so we should filter
  // messages sent by contentscript
  if (msg.data.action !== 'contentScriptStarted' && firstMessage) {
    // since contentScript is run everytime a page is refreshed
    // tell the background script that the tab has reloaded
    chrome.runtime.sendMessage({ action: 'tabReload' });
    firstMessage = false;
  }

  // post initial Message to background.js
  const { action } = msg.data;
  if (action === 'recordSnap') chrome.runtime.sendMessage(msg.data);
});

// listening for messages from the UI
chrome.runtime.onMessage.addListener(request => {
  // send the message to npm package
  const { action } = request;
  switch (action) {
    case 'jumpToSnap':
      chrome.runtime.sendMessage(request);
      window.postMessage(request);
      break;
    case 'setLock':
    case 'setPause':
      window.postMessage(request);
      break;
    default:
      break;
  }
});

window.postMessage({ action: 'contentScriptStarted' });
