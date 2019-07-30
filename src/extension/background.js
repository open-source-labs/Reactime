let bg;
let snapshotArr = [];
const mode = {
  persist: false,
  locked: false,
  paused: false,
};
let firstSnapshot = true;

// establishing connection with devtools
chrome.runtime.onConnect.addListener((port) => {
  bg = port;

  // if snapshots were saved in the snapshotArr,
  // send it to devtools as soon as connection to devtools is made
  if (snapshotArr.length > 0) {
    bg.postMessage({
      action: 'initialConnectSnapshot',
      payload: {
        snapshots: snapshotArr,
        mode,
      },
    });
  }

  // receive snapshot from devtools and send it to contentScript
  port.onMessage.addListener((msg) => {
    const { action, payload } = msg;
    switch (action) {
      case 'emptySnap':
        snapshotArr.splice(1);
        break;
      case 'setLock':
        mode.locked = payload;
        break;
      case 'setPause':
        mode.paused = payload;
        break;
      case 'setPersist':
        mode.persist = payload;
        break;
      default:
    }
    // find active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // send message to tab
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  });
});

// background.js recieves message from contentScript.js
chrome.runtime.onMessage.addListener((request) => {
  const { action } = request;
  const { persist } = mode;

  switch (action) {
    case 'tabReload':
      firstSnapshot = true;
      if (!persist) snapshotArr = [];
      break;
    case 'recordSnap':
      // don't do anything for the first snapshot if current mode is persist
      if (persist && firstSnapshot) {
        firstSnapshot = false;
        break;
      }
      firstSnapshot = false;
      snapshotArr.push(request.payload);
      // if port is not null, send a message to devtools
      if (bg) {
        // TODO:
        // get active tab id
        // get snapshot arr from tab object

        // send message to devtools
        bg.postMessage({
          action: 'sendSnapshots',
          payload: snapshotArr,
        });
      }
      break;
    default:
  }
});
