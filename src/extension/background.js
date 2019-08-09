let bg;
const tabsObj = {};
function createTabObj() {
  return {
    snapshotArr: [],
    mode: {
      persist: false,
      locked: false,
      paused: false,
    },
    firstSnapshot: true,
  };
}

// establishing connection with devtools
chrome.runtime.onConnect.addListener((port) => {
  bg = port;

  // if snapshots were saved in the snapshotArr,
  // send it to devtools as soon as connection to devtools is made
  if (Object.values(tabsObj)[0].snapshotArr.length > 0) {
    // later we want to send the entire tabsObj to devTools
    // but currently since devTools can only handle one tab at a time
    // we will test our obj assuming that the user opened only one tab
    // below is what we want the postMessage to look like eventually
    // ---------------------------------------------------------------
    // bg.postMessage({
    //   action: 'initialConnectSnapshots',
    //   payload: tabsObj,
    // });
    // ---------------------------------------------------------------
    bg.postMessage({
      action: 'initialConnectSnapshots',
      payload: {
        snapshots: Object.values(tabsObj)[0].snapshotArr,
        mode: Object.values(tabsObj)[0].mode,
      },
    });
  }

  // receive snapshot from devtools and send it to contentScript
  port.onMessage.addListener((msg) => {
    // ---------------------------------------------------------------
    // message incoming from devTools should look like this:
    // {
    //   action: 'emptySnap',
    //   payload: tabsObj,
    //   tabId: 101
    // }
    // ---------------------------------------------------------------
    const { action, payload, tabId } = msg;
    switch (action) {
      case 'import':
        snapshotArr = payload;
        break;
      case 'emptySnap':
        tabsObj[tabId].snapshotArr.splice(1);
        break;
      case 'setLock':
        tabsObj[tabId].mode.locked = payload;
        break;
      case 'setPause':
        tabsObj[tabId].mode.paused = payload;
        break;
      case 'setPersist':
        tabsObj[tabId].mode.persist = payload;
        break;
      default:
    }

    // Instead of sending the message to the active tab,
    // now we can send messages to specific tabs that we specify
    // using tabId
    // ---------------------------------------------------------------
    // chrome.tabs.sendMessage(tabId, msg);
    // ---------------------------------------------------------------
    // find active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // send message to tab
      chrome.tabs.sendMessage(tabs[0].id, msg);
    });
  });
});

// background.js recieves message from contentScript.js
chrome.runtime.onMessage.addListener((request, sender) => {
  // IGNORE THE AUTOMTAIC MESSAGE SENT BY CHROME WHEN CONTENT SCRIPT IS FIRST LOADED
  if (request.type === 'SIGN_CONNECT') return;

  const tabId = sender.tab.id;
  const { action } = request;
  let isReactTimeTravel = false;

  // Filter out tabs that don't have react-time-travel
  if (action === 'tabReload' || action === 'recordSnap') {
    isReactTimeTravel = true;
  }

  // everytime we get a new tabid, add it to the object
  if (isReactTimeTravel && !(tabId in tabsObj)) {
    tabsObj[tabId] = createTabObj();
  }

  const { persist } = tabsObj[tabId].mode;

  console.log('request: ', request)
  console.log('sender: ', sender)

  switch (action) {
    case 'tabReload':
      tabsObj[tabId].firstSnapshot = true;
      tabsObj[tabId].mode.locked = false;
      tabsObj[tabId].mode.paused = false;
      if (!persist) tabsObj[tabId].snapshotArr = [];
      break;
    case 'recordSnap':
      if (tabsObj[tabId].firstSnapshot) {
        tabsObj[tabId].firstSnapshot = false;
        // don't add anything to snapshot storage if mode is persisting for the initial snapshot
        if (!persist) tabsObj[tabId].snapshotArr.push(request.payload);
        if (bg) {
          bg.postMessage({
            action: 'initialConnectSnapshots',
            payload: {
              snapshots: tabsObj[tabId].snapshotArr,
              mode: tabsObj[tabId].mode,
            },
          });
        }
        break;
      }

      tabsObj[tabId].snapshotArr.push(request.payload);

      // send message to devtools
      if (bg) {
        bg.postMessage({
          action: 'sendSnapshots',
          payload: tabsObj[tabId].snapshotArr,
        });
      }
      break;
    default:
  }
});

// when tab is closed, remove the tabid from the tabsObj
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabsObj[tabId];
});
