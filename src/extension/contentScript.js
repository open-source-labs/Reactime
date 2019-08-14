let firstMessage = true;

// listening for messages from npm package
window.addEventListener('message', msg => {
  // window listener picks up the message it sends, so we should filter
  // messages sent by contentscript
  if (msg.data.action !== 'contentScriptStarted' && firstMessage) {
    // since contentScript is run everytime a page is refreshed
    // tell the background script that the tab has reloaded
    console.log('before sending tabReload');
    chrome.runtime.sendMessage({ action: 'tabReload' });
    firstMessage = false;
  }

  // post initial Message to npm package
  const { action } = msg.data;
  console.log('before sending recordsnap');
  if (action === 'recordSnap') chrome.runtime.sendMessage(msg.data);
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
