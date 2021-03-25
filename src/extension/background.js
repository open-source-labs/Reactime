// Import snapshots from "../app/components/snapshots".
import 'core-js';
// Store ports in an array.
const portsArr = [];
const reloaded = {};
const firstSnapshotReceived = {};
// There will be the same number of objects in here as there are
// Reactime tabs open for each user application being worked on.
const tabsObj = {};
// Will store Chrome web vital metrics and their corresponding values.
const metrics = {};

// This function will create the first instance of the test app's tabs object
// which will hold test app's snapshots, link fiber tree info, chrome tab info, etc.
//console.log("hello from background.js");
function createTabObj(title) {
  // update tabsObj
  return {
    title,
    // snapshots is an array of ALL state snapshots for statefull and stateless components the reactime tab working on a specific user application
    snapshots: [],
    // records initial snapshot to refresh page in case empty function is called
    initialSnapshot: [],
    // index here is the tab index that shows total amount of state changes
    index: 0,
    //* this is our pointer so we know what the current state the user is checking (this accounts for time travel aka when user clicks jump on the UI)
    currLocation: null,
    // points to the node that will generate the next child set by newest node or jump
    currParent: 0,
    // points to the current branch
    currBranch: 0,
    //* inserting a new property to build out our hierarchy dataset for d3
    hierarchy: null,
    // records initial hierarchy to refresh page in case empty function is called
    initialHierarchy: null,
    mode: {
      persist: false,
      paused: false,
      empty: false,
    },
    // stores web metrics calculated by the content script file
    webMetrics: {},
  };
}

// Each node stores a history of the link fiber tree.
class Node {
  constructor(obj, tabObj) {
    // continues the order of number of total state changes
    this.index = tabObj.index++;
    // continues the order of number of states changed from that parent
    this.name = tabObj.currParent += 1;
    // marks from what branch this node is originated
    this.branch = tabObj.currBranch;
    this.stateSnapshot = obj;
    this.children = [];
  }
}

// Adds a new node to the current location.
// Invoked in the case 'recordSnap'.
function sendToHierarchy(tabObj, newNode) {
  if (!tabObj.currLocation) {
    tabObj.currLocation = newNode;
    tabObj.hierarchy = newNode;
  } else {
    tabObj.currLocation.children.push(newNode);
    // if the node's children's array is empty
    if (tabObj.currLocation.children.length > 1) {
      // increment the value of the nodes branch by 1
      newNode.branch += 1;
      // reassign value of current branch as the newNode branch value
      tabObj.currBranch = newNode.branch;
    }
    tabObj.currLocation = newNode;
  }
}

// This function is used when time jumping to a previous state,
// so that it runs recursively until it finds the correct index,
// and updates the tabsObject to the node at that index.
function changeCurrLocation(tabObj, rootNode, index, name) {
  // index comes from the app's main reducer to locate the correct current location on tabObj
  // check if current node has the index wanted
  if (rootNode.index === index) {
    tabObj.currLocation = rootNode;
    // index of current location from where the next node will be a child
    tabObj.currParent = name;
    return;
  }
  // base case if no children
  if (!rootNode || !rootNode.children.length) {
    return;
    // if not, recurse on each one of the children
  }

  if (rootNode.children) {
    rootNode.children.forEach((child) => {
      changeCurrLocation(tabObj, child, index, name);
    });
  }
}

// Establishing incoming connection with devtools.
chrome.runtime.onConnect.addListener((port) => {
  // port is one end of the connection - an object

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
  port.onDisconnect.addListener((e) => {
    for (let i = 0; i < portsArr.length; i += 1) {
      if (portsArr[i] === e) {
        portsArr.splice(i, 1);
        break;
      }
    }
  });

  // listen for message containing a snapshot from devtools and send it to contentScript -
  // (i.e. they're all related to the button actions on Reactime)
  port.onMessage.addListener((msg) => {
    // msg is action denoting a time jump in devtools

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
      case 'import': // create a snapshot property on tabId and set equal to tabs object
        // may need do something like filter payload from stateless
        tabsObj[tabId].snapshots = payload;
        return true;
      case 'emptySnap':
        // activates empty mode
        tabsObj[tabId].mode.empty = true;
        // records snapshot of page initial state
        tabsObj[tabId].initialSnapshot.push(tabsObj[tabId].snapshots[0]);
        // reset snapshots to page last state recorded
        tabsObj[tabId].snapshots = [
          tabsObj[tabId].snapshots[tabsObj[tabId].snapshots.length - 1],
        ];
        // records hierarchy of page initial state
        tabsObj[tabId].initialHierarchy = {
          ...tabsObj[tabId].hierarchy,
          children: [],
        };
        // resets hierarchy
        tabsObj[tabId].hierarchy.children = [];
        // resets hierarchy to page last state recorded
        tabsObj[tabId].hierarchy.stateSnapshot = {
          ...tabsObj[tabId].snapshots[0],
        };
        // resets currLocation to page last state recorded
        tabsObj[tabId].currLocation = tabsObj[tabId].hierarchy;
        // resets index
        tabsObj[tabId].index = 0;
        // resets currParent plus current state
        tabsObj[tabId].currParent = 1;
        // resets currBranch
        tabsObj[tabId].currBranch = 0;
        return true;
      // "Pause" is a deprecated feature from a previous Reactime version.
      case 'setPause':
        tabsObj[tabId].mode.paused = payload;
        break;
      case 'setPersist':
        tabsObj[tabId].mode.persist = payload;
        return true;
      case 'jumpToSnap':
        chrome.tabs.sendMessage(tabId, msg);
        return true; // attempt to fix message port closing error, consider return Promise
      default:
        return true;
    }
  });
});

// background.js listening for a message from contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // IGNORE THE AUTOMATIC MESSAGE SENT BY CHROME WHEN CONTENT SCRIPT IS FIRST LOADED
  if (request.type === 'SIGN_CONNECT') {
    return true;
  }
  const tabTitle = sender.tab.title;
  const tabId = sender.tab.id;
  const { action, index, name, value } = request;
  let isReactTimeTravel = false;

  if (name) {
    metrics[name] = value;
  }

  // Filter out tabs that don't have reactime, tabs that dont use react?
  if (
    action === 'tabReload' ||
    action === 'recordSnap' ||
    action === 'jumpToSnap' ||
    action === 'injectScript'
  ) {
    isReactTimeTravel = true;
  } else {
    return true;
  }

  // everytime we get a new tabid, add it to the object
  if (isReactTimeTravel && !(tabId in tabsObj)) {
    tabsObj[tabId] = createTabObj(tabTitle);
  }

  const { persist, empty } = tabsObj[tabId].mode;

  switch (action) {
    case 'jumpToSnap': {
      changeCurrLocation(tabsObj[tabId], tabsObj[tabId].hierarchy, index, name);
      break;
    }
    // This injects a script into the app that you're testing Reactime on,
    // so that Reactime's backend files can communicate with the app's DOM.
    case 'injectScript': {
      chrome.tabs.executeScript(tabId, {
        code: `
        // Function will attach script to the dom 
        const injectScript = (file, tag) => {
          const htmlBody = document.getElementsByTagName(tag)[0];
          const script = document.createElement('script');
          script.setAttribute('type', 'text/javascript');
          script.setAttribute('src', file);
          document.title=${tabId} + '-' + document.title
          htmlBody.appendChild(script);
        };
        injectScript(chrome.runtime.getURL('bundles/backend.bundle.js'), 'body');
      `,
      });
      break;
    }
    case 'tabReload': {
      tabsObj[tabId].mode.paused = false;
      // dont remove snapshots if persisting
      if (!persist) {
        if (empty) {
          // resets snapshots to page initial state recorded when emptied
          tabsObj[tabId].snapshots = tabsObj[tabId].initialSnapshot;
          // resets hierarchy to page initial state recorded when emptied
          tabsObj[tabId].hierarchy = tabsObj[tabId].initialHierarchy;
        } else {
          // triggered with new tab opened
          // resets snapshots to page initial state
          tabsObj[tabId].snapshots.splice(1);
          // checks if hierarchy before reset
          if (tabsObj[tabId].hierarchy) {
            // resets hierarchy to page initial state
            tabsObj[tabId].hierarchy.children = [];
            // resets currParent plus current state
            tabsObj[tabId].currParent = 1;
          } else {
            // resets currParent
            tabsObj[tabId].currParent = 0;
          }
        }
        // resets currLocation to page initial state
        tabsObj[tabId].currLocation = tabsObj[tabId].hierarchy;
        // resets index
        tabsObj[tabId].index = 0;
        // resets currBranch
        tabsObj[tabId].currBranch = 0;

        // send a message to devtools
        portsArr.forEach((bg) =>
          bg.postMessage({
            action: 'initialConnectSnapshots',
            payload: tabsObj,
          })
        );
      }
      reloaded[tabId] = true;

      break;
    }
    case 'recordSnap': {
      const sourceTab = tabId;
      tabsObj[tabId].webMetrics = metrics;
      if (!firstSnapshotReceived[tabId]) {
        firstSnapshotReceived[tabId] = true;
        reloaded[tabId] = false;
        tabsObj[tabId].webMetrics = metrics;
        tabsObj[tabId].snapshots.push(request.payload);
        sendToHierarchy(
          tabsObj[tabId],
          new Node(request.payload, tabsObj[tabId])
        );

        if (portsArr.length > 0) {
          portsArr.forEach((bg) =>
            bg.postMessage({
              action: 'initialConnectSnapshots',
              payload: tabsObj,
            })
          );
        }
        break;
      }

      // DUPLICATE SNAPSHOT CHECK
      const previousSnap =
        tabsObj[tabId].currLocation.stateSnapshot.children[0].componentData
          .actualDuration;
      const incomingSnap =
        request.payload.children[0].componentData.actualDuration;
      if (previousSnap === incomingSnap) break;

      // don't add anything to snapshot storage if tab is reloaded for the initial snapshot
      if (reloaded[tabId]) {
        reloaded[tabId] = false;
      } else {
        tabsObj[tabId].snapshots.push(request.payload);
        //! INVOKING buildHierarchy FIGURE OUT WHAT TO PASS IN!!!!

        if (!tabsObj[tabId][index]) {
          sendToHierarchy(
            tabsObj[tabId],
            new Node(request.payload, tabsObj[tabId])
          );
        }
        //  else {
        //   sendToHierarchy(
        //     tabsObj[tabId],
        //     new NewNode(request.payload, tabsObj[tabId])
        //   );
        // }
      }
      // sends new tabs obj to devtools
      if (portsArr.length > 0) {
        portsArr.forEach((bg) =>
          bg.postMessage({
            action: 'sendSnapshots',
            payload: tabsObj,
            sourceTab,
          })
        );
      }
      break;
    }
    default:
      break;
  }
  return true; // attempt to fix close port error
});

// when tab is closed, remove the tabid from the tabsObj
chrome.tabs.onRemoved.addListener((tabId) => {
  // tell devtools which tab to delete
  if (portsArr.length > 0) {
    portsArr.forEach((bg) =>
      bg.postMessage({
        action: 'deleteTab',
        payload: tabId,
      })
    );
  }

  // delete the tab from the tabsObj
  delete tabsObj[tabId];
  delete reloaded[tabId];
  delete firstSnapshotReceived[tabId];
});

// when a new url is loaded on the same tab,
// this remove the tabid from the tabsObj, recreate the tab and inject the script
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  // check if the tab title changed to see if tab need to restart
  if (changeInfo && tabsObj[tabId]) {
    if (changeInfo.title && changeInfo.title !== tabsObj[tabId].title) {
      // tell devtools which tab to delete
      if (portsArr.length > 0) {
        portsArr.forEach((bg) =>
          bg.postMessage({
            action: 'deleteTab',
            payload: tabId,
          })
        );
      }

      // delete the tab from the tabsObj
      delete tabsObj[tabId];
      delete reloaded[tabId];
      delete firstSnapshotReceived[tabId];

      // recreate the tab on the tabsObj
      tabsObj[tabId] = createTabObj(changeInfo.title);
    }
  }
});

// when tab view is changed, put the tabid as the current tab
chrome.tabs.onActivated.addListener((info) => {
  // tell devtools which tab to be the current
  if (portsArr.length > 0) {
    portsArr.forEach((bg) =>
      bg.postMessage({
        action: 'changeTab',
        payload: info,
      })
    );
  }
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
