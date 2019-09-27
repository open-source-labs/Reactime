// store ports in an array
const portsArr = [];
const reloaded = {};
const firstSnapshotReceived = {};
const tabsObj = {};

function createTabObj(title) {
  return {
    title,
    snapshots: [],
    //* inserting a new property
    snapshotHierarchy: {},
    mode: {
      persist: false,
      locked: false,
      paused: false,
    },
  };
}

function buildHierarchy() {
  // if empty is clicked hierarchy needs to be reset to an object

  // once state is modified (when user does something with app), a step appears in actionContainer.jsx column
  // that current state snapshot is added to our hierarchy object

}
// create a helper function that groups all the snapshots underneath each other
  // current state snapshot
    // needs to be supplied by the UI
    // also need to figure out how we would traverse through the big ass object to find the current state
  // Create a new object with name, 

// establishing connection with devtools
chrome.runtime.onConnect.addListener(port => {
  // push every port connected to the ports array
  portsArr.push(port);

  // send tabs obj to the connected devtools as soon as connection to devtools is made
  if (Object.keys(tabsObj).length > 0) {
    port.postMessage({
      action: 'initialConnectSnapshots',
      payload: tabsObj,
    });
  }

  // every time devtool is closed, remove the port from portsArr
  port.onDisconnect.addListener(e => {
    for (let i = 0; i < portsArr.length; i += 1) {
      if (portsArr[i] === e) {
        portsArr.splice(i, 1);
        break;
      }
    }
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
  // IGNORE THE AUTOMATIC MESSAGE SENT BY CHROME WHEN CONTENT SCRIPT IS FIRST LOADED
  if (request.type === 'SIGN_CONNECT') return;
  const tabTitle = sender.tab.title;
  const tabId = sender.tab.id;
  const { action } = request;
  let isReactTimeTravel = false;

  // Filter out tabs that don't have reactime
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
      tabsObj[tabId].mode.locked = false;
      tabsObj[tabId].mode.paused = false;
      // dont remove snapshots if persisting
      if (!persist) {
        tabsObj[tabId].snapshots.splice(1);

        // send a message to devtools
        portsArr.forEach(bg => bg.postMessage({
          action: 'initialConnectSnapshots',
          payload: tabsObj,
        }));
      }

      reloaded[tabId] = true;

      break;
    }
    case 'recordSnap': {
      const sourceTab = tabId;

      // first snapshot received from tab
      if (!firstSnapshotReceived[tabId]) {
        firstSnapshotReceived[tabId] = true;
        reloaded[tabId] = false;

        tabsObj[tabId].snapshots.push(request.payload);
        console.log(tabsObj[tabId].snapshots);
        if (portsArr.length > 0) {
          portsArr.forEach(bg => bg.postMessage({
            action: 'initialConnectSnapshots',
            payload: tabsObj,
          }));
        }
        break;
      }

      // don't add anything to snapshot storage if tab is reloaded for the initial snapshot
      if (reloaded[tabId]) {
        reloaded[tabId] = false;
      } else tabsObj[tabId].snapshots.push(request.payload);

      // send message to devtools
      if (portsArr.length > 0) {
        portsArr.forEach(bg => bg.postMessage({
          action: 'sendSnapshots',
          payload: tabsObj,
          sourceTab,
        }));
      }
      break;
    }
    default:
      break;
  }
});

// when tab is closed, remove the tabid from the tabsObj
chrome.tabs.onRemoved.addListener(tabId => {
  // tell devtools which tab to delete
  if (portsArr.length > 0) {
    portsArr.forEach(bg => bg.postMessage({
      action: 'deleteTab',
      payload: tabId,
    }));
  }

  // delete the tab from the tabsObj
  delete tabsObj[tabId];
  delete reloaded[tabId];
  delete firstSnapshotReceived[tabId];
});

// when reactime is installed
// create a context menu that will open our devtools in a new window
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'reactime',
    title: 'Reactime',
    contexts: ['page', 'selection', 'image', 'link'],
  });
});

// when context menu is clicked, listen for the menuItemId,
// if user clicked on reactime, open the devtools window
chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
  const options = {
    type: 'panel',
    left: 0,
    top: 0,
    width: 380,
    height: window.screen.availHeight,
    url: chrome.runtime.getURL('panel.html'),
  };
  if (menuItemId === 'reactime') chrome.windows.create(options);
});
