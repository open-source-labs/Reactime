let bg;
const tabsObj = {};

const reloaded = {};

function createTabObj(title) {
  return {
    title,
    snapshots: [],
    mode: {
      persist: false,
      locked: false,
      paused: false,
    },
    firstSnapshot: true,
  };
}

// establishing connection with devtools
chrome.runtime.onConnect.addListener(port => {
  bg = port;

  bg.postMessage({
    action: 'initialConnectSnapshots',
    payload: tabsObj,
  });

  // receive snapshot from devtools and send it to contentScript
  port.onMessage.addListener(msg => {
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
        tabsObj[tabId].snapshots = payload;
        return;
      case 'emptySnap':
        tabsObj[tabId].snapshots.splice(1);
        return;
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

    chrome.tabs.sendMessage(tabId, msg);
  });
});

// background.js recieves message from contentScript.js
chrome.runtime.onMessage.addListener((request, sender) => {
  // IGNORE THE AUTOMTAIC MESSAGE SENT BY CHROME WHEN CONTENT SCRIPT IS FIRST LOADED
  if (request.type === 'SIGN_CONNECT') return;
  const tabTitle = sender.tab.title;
  const tabId = sender.tab.id;
  const { action } = request;
  let isReactTimeTravel = false;

  // Filter out tabs that don't have react-time-travel
  if (action === 'tabReload' || action === 'recordSnap') {
    isReactTimeTravel = true;
  } else return;

  // everytime we get a new tabid, add it to the object
  if (isReactTimeTravel && !(tabId in tabsObj)) {
    tabsObj[tabId] = createTabObj(tabTitle);
  }

  const { persist } = tabsObj[tabId].mode;

  switch (action) {
    case 'tabReload': {
      tabsObj[tabId].firstSnapshot = true;
      tabsObj[tabId].mode.locked = false;
      tabsObj[tabId].mode.paused = false;
      if (!persist) {
        tabsObj[tabId].snapshots.splice(1);
        reloaded[tabId] = true;
      }

      bg.postMessage({
        action: 'initialConnectSnapshots',
        payload: tabsObj,
      });

      break;
    }
    case 'recordSnap': {
      const sourceTab = tabId;

      if (tabsObj[tabId].firstSnapshot) {
        tabsObj[tabId].firstSnapshot = false;
        break;
      }
      tabsObj[tabId].snapshots.push(request.payload);
      // send message to devtools
      if (bg) {
        bg.postMessage({
          action: 'sendSnapshots',
          payload: tabsObj,
          sourceTab,
        });
      }
      break;
    }
    default:
      break;
  }
});

// when tab is closed, remove the tabid from the tabsObj
chrome.tabs.onRemoved.addListener(tabId => {
  delete tabsObj[tabId];
});
