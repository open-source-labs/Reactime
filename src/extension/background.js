/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
// store ports in an array
const portsArr = [];
const reloaded = {};
const firstSnapshotReceived = {};
// there will be the same number of objects in here as there are reactime tabs open for each user application being worked on
const tabsObj = {};

function createTabObj(title) {
  // updating tabsObj
  return {
    title,
    // snapshots is an array of ALL state snapshots for the reactime tab working on a specific user application
    snapshots: [],
    index: 0,
    //* this is our pointer so we know what the current state the user is checking (this accounts for time travel aka when user clicks jump on the UI)
    currLocation: null,
    //* inserting a new property to build out our hierarchy dataset for d3
    hierarchy: null,
    mode: {
      persist: false,
      locked: false,
      paused: false,
    },
  };
}

class Node {
  constructor(obj, tabObj) {
    // eslint-disable-next-line no-param-reassign
    // eslint-disable-next-line no-multi-assign
    // eslint-disable-next-line no-plusplus
    this.index = tabObj.index++;
    this.stateSnapshot = obj;
    this.children = [];
  }
}

function sendToHierarchy(tabObj, newNode) {
  if (!tabObj.currLocation) {
    tabObj.currLocation = newNode;
    tabObj.hierarchy = newNode;
  } else {
    tabObj.currLocation.children.push(newNode);
    tabObj.currLocation = newNode;
  }
}

function changeCurrLocation(tabObj, rootNode, index) {
  // check if current node has the index wanted
  if (rootNode.index === index) {
    tabObj.currLocation = rootNode;
    return;
  }
  // base case if no children
  if (!rootNode.children.length) {
    return;
    // if not, recurse on each one of the children
  }
  rootNode.children.forEach(child => {
    changeCurrLocation(tabObj, child, index);
  });
}


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
        // reset children in root node to reset graph
        tabsObj[tabId].hierarchy.children = [];
        // reassigning pointer to the appropriate node to branch off of
        tabsObj[tabId].currLocation = tabsObj[tabId].hierarchy;
        // reset index
        tabsObj[tabId].index = 1;
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
  const { action, index } = request;
  let isReactTimeTravel = false;

  // Filter out tabs that don't have reactime
  if (action === 'tabReload' || action === 'recordSnap' || action === 'jumpToSnap') {
    isReactTimeTravel = true;
  } else return;

  // everytime we get a new tabid, add it to the object
  if (isReactTimeTravel && !(tabId in tabsObj)) {
    tabsObj[tabId] = createTabObj(tabTitle);
  }

  const { persist } = tabsObj[tabId].mode;

  switch (action) {
    case 'jumpToSnap': {
      changeCurrLocation(tabsObj[tabId], tabsObj[tabId].hierarchy, index);
      break;
    }
    // this case causes d3 graph to display 1 instead of 0
    case 'tabReload': {
      tabsObj[tabId].mode.locked = false;
      tabsObj[tabId].mode.paused = false;
      // dont remove snapshots if persisting
      if (!persist) {
        tabsObj[tabId].snapshots.splice(1);
        // reset children in root node to reset graph
        // if (tabsObj[tabId].hierarchy)
        tabsObj[tabId].hierarchy.children = [];
        // reassigning pointer to the appropriate node to branch off of
        tabsObj[tabId].currLocation = tabsObj[tabId].hierarchy;
        // reset index
        tabsObj[tabId].index = 1;

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
        sendToHierarchy(tabsObj[tabId], new Node(request.payload, tabsObj[tabId]));
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
      } else {
        tabsObj[tabId].snapshots.push(request.payload);
        //! INVOKING buildHierarchy FIGURE OUT WHAT TO PASS IN!!!!
        sendToHierarchy(tabsObj[tabId], new Node(request.payload, tabsObj[tabId]));
      }
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
