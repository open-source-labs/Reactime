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
      action: 'initialConnectSnapshots',
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
chrome.runtime.onMessage.addListener((request, sender) => {
  const { action } = request;
  const { persist } = mode;

  console.log('request: ', request)
  console.log('sender: ', sender)

  switch (action) {
    case 'tabReload':
      firstSnapshot = true;
      mode.locked = false;
      mode.paused = false;
      if (!persist) snapshotArr = [];
      break;
    case 'recordSnap':
      if (firstSnapshot) {
        firstSnapshot = false;
        // don't add anything to snapshot storage if mode is persisting for the initial snapshot
        if (!persist) snapshotArr.push(request.payload);
        if (bg) {
          bg.postMessage({
            action: 'initialConnectSnapshots',
            payload: {
              snapshots: snapshotArr,
              mode,
            },
          });
        }
        break;
      }
      snapshotArr.push(request.payload);
      // TODO:
      // get active tab id
      const tabID = sender.tab.id;
      // get snapshot arr from tab object
      console.log(tabID)

      // send message to devtools
      if(bg) {
        bg.postMessage({
          action: 'sendSnapshots',
          payload: snapshotArr,
        });
      }
      break;
    default:
  }
});
