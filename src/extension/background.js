// Store ports in an array.
const portsArr = [];
const reloaded = {};
const firstSnapshotReceived = {};

// Toggle for recording accessibility snapshots
let toggleAxRecord = false;

// There will be the same number of objects in here as there are
// Reactime tabs open for each user application being worked on.
let activeTab;
const tabsObj = {};
// Will store Chrome web vital metrics and their corresponding values.
const metrics = {};

// Helper function to check if a URL is localhost
function isLocalhost(url) {
  return url?.startsWith('http://localhost:') || url?.startsWith('https://localhost:');
}

// Helper function to find localhost tab
async function findLocalhostTab() {
  try {
    // First check current window
    const currentWindowTabs = await chrome.tabs.query({ currentWindow: true });
    const localhostTab = currentWindowTabs.find((tab) => tab.url && isLocalhost(tab.url));

    if (localhostTab) {
      return localhostTab;
    }

    // If not found in current window, check all windows
    const allTabs = await chrome.tabs.query({});
    const localhostTabAnyWindow = allTabs.find((tab) => tab.url && isLocalhost(tab.url));

    if (localhostTabAnyWindow) {
      // Focus the window containing the localhost tab
      await chrome.windows.update(localhostTabAnyWindow.windowId, { focused: true });
      return localhostTabAnyWindow;
    }

    return null;
  } catch (error) {
    console.error('Error finding localhost tab:', error);
    return null;
  }
}

//keep alive functionality to address port disconnection issues
function setupKeepAlive() {
  // Clear any existing keep-alive alarms to prevent duplicates
  chrome.alarms.clear('keepAlive', (wasCleared) => {
    if (wasCleared) {
      console.log('Cleared existing keep-alive alarm.');
    }
  });

  // Create a new keep-alive alarm, we found .5 min to resolve the idle time port disconnection
  chrome.alarms.create('keepAlive', { periodInMinutes: 0.5 });

  // Log active alarms for debugging
  chrome.alarms.getAll((alarms) => {
    console.log(
      'Active alarms:',
      alarms.map((alarm) => alarm.name),
    );
  });

  // Listen for the keep-alive alarm
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'keepAlive') {
      console.log('Keep-alive alarm triggered.');
      pingServiceWorker();
    }
  });
}

// Ping the service worker to keep it alive
function pingServiceWorker() {
  try {
    chrome.runtime.getPlatformInfo(() => {
      console.log('Service worker pinged successfully.');
    });
  } catch (error) {
    console.error('Failed to ping service worker:', error);

    // Fallback: Trigger an empty event to wake up the service worker
    chrome.runtime.sendMessage({ type: 'ping' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Fallback message failed:', chrome.runtime.lastError.message);
      } else {
        console.log('Fallback message sent successfully:', response);
      }
    });
  }
}

// function pruning the chrome ax tree and pulling the relevant properties
const pruneAxTree = (axTree) => {
  const axArr = [];
  let orderCounter = 0;

  for (const node of axTree) {
    let {
      backendDOMNodeId,
      childIds,
      ignored,
      name,
      nodeId,
      ignoredReasons,
      parentId,
      properties,
      role,
    } = node;

    if (!name) {
      if (ignored) {
        name = { value: 'ignored node' };
      } else {
        name = { value: 'no name' };
      }
    }
    if (!name.value) {
      name.value = 'no name';
    }
    //if the node is ignored, it should be given an order number as it won't be read at all
    if (role.type === 'role') {
      const axNode = {
        backendDOMNodeId: backendDOMNodeId,
        childIds: childIds,
        ignored: ignored,
        ignoredReasons: ignoredReasons,
        name: name,
        nodeId: nodeId,
        ignoredReasons: ignoredReasons,
        parentId: parentId,
        properties: properties,
      };
      axArr.push(axNode);
    }
  }

  // Sort nodes by backendDOMNodeId in ascending order

  // Assign order based on sorted position
  for (const axNode of axArr) {
    if (!axNode.ignored) {
      // Assuming you only want to assign order to non-ignored nodes
      axNode.order = orderCounter++;
    } else {
      axNode.order = null; // Or keep it undefined, based on your requirement
    }
  }
  return axArr;
};

// attaches Chrome Debugger API to tab for running future commands
function attachDebugger(tabId, version) {
  return new Promise((resolve, reject) => {
    chrome.debugger.attach({ tabId: tabId }, version, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

// sends commands with Chrome Debugger API
function sendDebuggerCommand(tabId, command, params = {}) {
  return new Promise((resolve, reject) => {
    chrome.debugger.sendCommand({ tabId: tabId }, command, params, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

// detaches Chrome Debugger API from tab
function detachDebugger(tabId) {
  return new Promise((resolve, reject) => {
    chrome.debugger.detach({ tabId: tabId }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

// returns a pruned accessibility tree obtained using the Chrome Debugger API
async function axRecord(tabId) {
  try {
    await attachDebugger(tabId, '1.3');
    await sendDebuggerCommand(tabId, 'Accessibility.enable');
    const response = await sendDebuggerCommand(tabId, 'Accessibility.getFullAXTree');
    const pruned = pruneAxTree(response.nodes);
    await detachDebugger(tabId);
    return pruned;
  } catch (error) {
    console.error('axRecord debugger command failed:', error);
  }
}

// Chrome Debugger API is unused unless accessibility features are toggled on with UI.
// This function will replace the current empty snapshot if accessibility features are toggled on and the current location's accessibility snapshot has not yet been recorded.
async function replaceEmptySnap(tabsObj, tabId, toggleAxRecord) {
  if (tabsObj[tabId].currLocation.axSnapshot === 'emptyAxSnap' && toggleAxRecord === true) {
    // add new ax snapshot to currlocation
    const addedAxSnap = await axRecord(tabId);
    tabsObj[tabId].currLocation.axSnapshot = addedAxSnap;
    // modify array to include the new recorded ax snapshot
    tabsObj[tabId].axSnapshots[tabsObj[tabId].currLocation.index] = addedAxSnap;
  }
}

// This function will create the first instance of the test app's tabs object
// which will hold test app's snapshots, link fiber tree info, chrome tab info, etc.
function createTabObj(title) {
  // TO-DO for save button
  // Save State
  // Knowledge of the comparison snapshot
  // Check for it in the reducer
  // update tabsObj
  return {
    title,
    // snapshots is an array of ALL state snapshots for stateful and stateless
    // components the Reactime tab working on a specific user application
    snapshots: [],
    // axSnapshots is an array of the chrome accessibility tree at different points for state and stateless applications
    axSnapshots: [],
    // index here is the tab index that shows total amount of state changes
    index: 0,
    //* currLocation points to the current state the user is checking
    // (this accounts for time travel aka when user clicks jump on the UI)
    currLocation: null,
    // points to the node that will generate the next child set by newest node or jump
    currParent: 0,
    // points to the current branch
    currBranch: 0,
    // inserting a new property to build out our hierarchy dataset for d3
    hierarchy: null,
    // status checks: Content Script launched, React Dev Tools installed, target is react app
    status: {
      contentScriptLaunched: true,
      reactDevToolsInstalled: false,
      targetPageisaReactApp: false,
    },
    // Note: Paused = Locked
    mode: {
      paused: true,
    },
    // stores web metrics calculated by the content script file
    webMetrics: {},
  };
}

// Each node stores a history of the link fiber tree.
// In practice, new Nodes are passed the following arguments:
// 1. param 'obj' : arg request.payload, which is an object containing a tree from snapShot.ts and a route property
// 2. param tabObj: arg tabsObj[tabId], which is an object that holds info about a specific tab. Should change the name of tabObj to tabCollection or something
class HistoryNode {
  constructor(tabObj, newStateSnapshot, newAxSnapshot) {
    // continues the order of number of total state changes
    this.index = tabObj.index;
    tabObj.index += 1;
    // continues the order of number of states changed from that parent
    tabObj.currParent += 1;
    this.name = tabObj.currParent;
    // marks from what branch this node is originated
    this.branch = tabObj.currBranch;
    this.stateSnapshot = newStateSnapshot;
    this.axSnapshot = newAxSnapshot;
    this.children = [];
  }
}

function countCurrName(rootNode, name) {
  if (rootNode.name > name) {
    return 0;
  }
  if (rootNode.name === name) {
    return 1;
  }
  let branch = 0;
  rootNode.children.forEach((child) => {
    branch += countCurrName(child, name);
  });
  return branch;
}

// Adds a new node to the current location.
// Invoked in the case 'recordSnap'.
// In practice, sendToHierarchy is passed the following arguments:
// 1. param tabObj : arg tabObj[tabId]
// 2. param newNode : arg an instance of the Node class
function sendToHierarchy(tabObj, newNode) {
  // newNode.axSnapshot = tabObj.axSnapshots[tabObj.axSnapshots.length - 1];
  if (!tabObj.currLocation) {
    tabObj.currLocation = newNode;
    tabObj.hierarchy = newNode;
  } else {
    const currNameCount = countCurrName(tabObj.hierarchy, newNode.name);
    newNode.branch = currNameCount;
    tabObj.currBranch = newNode.branch;
    tabObj.currLocation.children.push(newNode);
    tabObj.currLocation = newNode;
  }
}

// This function is used when time jumping to a previous state,
// so that it runs recursively until it finds the correct index,
// and updates the tabsObject to the node at that index.
/* eslint no-param-reassign: ["error", { "props": false }] */

function changeCurrLocation(tabObj, rootNode, index, name) {
  // index comes from the app's main reducer to locate the correct current location on tabObj
  // check if current node has the index wanted
  if (rootNode.index === index) {
    tabObj.currLocation = rootNode;
    // Count number of nodes in the tree with name = next name.
    const currNameCount = countCurrName(tabObj.hierarchy, name + 1);
    tabObj.currBranch = currNameCount === 0 ? 0 : currNameCount - 1;
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

async function getActiveTab() {
  try {
    // First try to find a localhost tab
    const localhostTab = await findLocalhostTab();
    if (localhostTab) {
      return localhostTab.id;
    }

    // If no localhost tab is found, provide a more informative error
    const errorMessage =
      'No localhost tab found. Please ensure:\n' +
      '1. A React development server is running\n' +
      '2. The server is using localhost\n' +
      '3. The development page is open in Chrome';

    console.warn(errorMessage);

    // Fallback to current active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      return tabs[0].id;
    }

    throw new Error(errorMessage);
  } catch (error) {
    console.error('Error in getActiveTab:', error);
    throw error;
  }
}

/*
  The 'chrome.runtime' API allows a connection to the background service worker (background.js).
  This allows us to set up listener's for when we connect, message, and disconnect the script.
*/

// INCOMING CONNECTION FROM FRONTEND (MainContainer) TO BACKGROUND.JS
// Establishing incoming connection with Reactime.
chrome.runtime.onConnect.addListener(async (port) => {
  /*
    On initial connection, there is an onConnect event emitted. The 'addlistener' method provides a communication channel object ('port') when we connect to the service worker ('background.js') and applies it as the argument to it's 1st callback parameter.

    the 'port' (type: communication channel object) is the communication channel between different components within our Chrome extension, not to a port on the Chrome browser tab or the extension's port on the Chrome browser.
  
    The port object facilitates communication between the Reactime front-end and this 'background.js' script. This allows you to: 
    1. send messages and data
      (look for 'onMessage'/'postMessage' methods within this page)
    2. receive messages and data
      (look for 'addListener' methods within this page)
    between the front-end and the background.
  
    To establish communication between different parts of your extension:
      for the connecting end: use chrome.runtime.connect() 
      for the listening end: use chrome.runtime.onConnect. 
    Once the connection is established, a port object is passed to the addListener callback function, allowing you to start exchanging data.
  
    Again, this port object is used for communication within your extension, not for communication with external ports or tabs in the Chrome browser. If you need to interact with specific tabs or external ports, you would use other APIs or methods, such as chrome.tabs or other Chrome Extension APIs.
  */
  portsArr.push(port); // push each Reactime communication channel object to the portsArr
  // sets the current Title of the Reactime panel

  /**
   * Sends messages to ports in the portsArr array, triggering a tab change action.
   */
  function sendMessagesToPorts() {
    portsArr.forEach((bg, index) => {
      bg.postMessage({
        action: 'changeTab',
        payload: { tabId: activeTab.id, title: activeTab.title },
      });
    });
  }
  if (port.name === 'keepAlivePort') {
    console.log('Keep-alive port connected:', port);

    // Keep the port open by responding to any message
    port.onMessage.addListener((msg) => {
      console.log('Received message from content script:', msg);
    });

    port.onDisconnect.addListener(() => {
      console.warn('Keep-alive port disconnected.');
    });
  }
  if (portsArr.length > 0 && Object.keys(tabsObj).length > 0) {
    //if the activeTab is not set during the onActivate API, run a query to get the tabId and set activeTab
    if (!activeTab) {
      const tabId = await getActiveTab();
      chrome.tabs.get(tabId, (tab) => {
        // never set a reactime instance to the active tab
        if (!tab.pendingUrl?.match('^chrome-extension')) {
          activeTab = tab;
          sendMessagesToPorts();
        }
      });
    }
  }

  if (Object.keys(tabsObj).length > 0) {
    port.postMessage({
      action: 'initialConnectSnapshots',
      payload: tabsObj,
    });
  }

  // Handles port disconnection by removing the disconnected port
  port.onDisconnect.addListener(() => {
    const index = portsArr.indexOf(port);
    if (index !== -1) {
      console.warn(`Port at index ${index} disconnected. Removing it.`);
      portsArr.splice(index, 1);

      // Notify remaining ports about the disconnection
      portsArr.forEach((remainingPort) => {
        try {
          remainingPort.postMessage({
            action: 'portDisconnect',
          });
        } catch (error) {
          console.warn('Failed to notify port of disconnection:', error);
        }
      });
    }
  });

  // INCOMING MESSAGE FROM FRONTEND (MainContainer) TO BACKGROUND.js
  // listen for message containing a snapshot from devtools and send it to contentScript -
  // (i.e. they're all related to the button actions on Reactime)
  port.onMessage.addListener(async (msg) => {
    const { action, payload, tabId } = msg;
    console.log(`Received message - Action: ${action}, Payload:`, payload);
    if (!payload && ['import', 'setPause', 'jumpToSnap'].includes(action)) {
      console.error(`Invalid payload received for action: ${action}`, new Error().stack);
    }

    switch (action) {
      // import action comes through when the user uses the "upload" button on the front end to import an existing snapshot tree
      case 'import': // create a snapshot property on tabId and set equal to tabs object
        // may need do something like filter payload from stateless
        tabsObj[tabId].snapshots = payload.snapshots; // reset snapshots to page last state recorded
        tabsObj[tabId].axSnapshots = payload.axSnapshots; // TRYING to import axsnapshots
        // tabsObj[tabId].hierarchy = savedSnapshot.hierarchy; // why don't we just use hierarchy? Because it breaks everything...
        tabsObj[tabId].hierarchy.children = payload.hierarchy.children; // resets hierarchy to last state recorded
        tabsObj[tabId].hierarchy.stateSnapshot = payload.hierarchy.stateSnapshot; // resets hierarchy to last state recorded
        tabsObj[tabId].hierarchy.axSnapshot = payload.hierarchy.axSnapshot; // TRYING to import hierarchy axsnapshot
        tabsObj[tabId].currLocation = payload.currLocation; // resets currLocation to last state recorded
        tabsObj[tabId].index = payload.index; //reset index to last state recorded
        tabsObj[tabId].currParent = payload.currParent; // reset currParent to last state recorded
        tabsObj[tabId].currBranch = payload.currBranch; // reset currBranch to last state recorded

        return true; // return true so that port remains open

      // emptySnap actions comes through when the user uses the 'clear' button on the front end to clear the snapshot history and move slider back to 0 position
      case 'emptySnap':
        tabsObj[tabId].snapshots = [tabsObj[tabId].snapshots[tabsObj[tabId].currLocation.index]]; // reset snapshots to current page state
        tabsObj[tabId].hierarchy.children = []; // resets hierarchy
        tabsObj[tabId].hierarchy.stateSnapshot = {
          // resets hierarchy to current page state
          // not sure why they are doing a "shallow" deep copy
          ...tabsObj[tabId].snapshots[0],
        };
        tabsObj[tabId].axSnapshots = [
          tabsObj[tabId].axSnapshots[tabsObj[tabId].currLocation.index],
        ]; // resets axSnapshots to current page state
        tabsObj[tabId].hierarchy.axSnapshot = tabsObj[tabId].axSnapshots[0]; // resets hierarchy to accessibility tree of current page state
        tabsObj[tabId].index = 1; //reset index
        tabsObj[tabId].currParent = 0; // reset currParent
        tabsObj[tabId].currBranch = 1; // reset currBranch
        tabsObj[tabId].currLocation = tabsObj[tabId].hierarchy; // reset currLocation

        return true; // return true so that port remains open

      case 'setPause': // Pause = lock on tab
        tabsObj[tabId].mode.paused = payload;
        return true; // return true so that port remains open

      // Handling the launchContentScript case with proper validation
      case 'launchContentScript': {
        if (!tabId) {
          console.error('No tabId provided for content script injection');
          return false;
        }

        try {
          // Validate the tab exists before injecting
          chrome.tabs.get(tabId, async (tab) => {
            if (chrome.runtime.lastError) {
              console.error('Error getting tab:', chrome.runtime.lastError);
              return;
            }

            // Skip injection for chrome:// URLs
            if (tab.url?.startsWith('chrome://')) {
              console.warn('Cannot inject scripts into chrome:// URLs');
              return;
            }

            try {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['bundles/content.bundle.js'],
              });
              console.log('Content script injected successfully');
            } catch (err) {
              console.error('Error injecting content script:', err);
            }
          });
        } catch (err) {
          console.error('Error in launchContentScript:', err);
        }
        return true;
      }

      case 'jumpToSnap':
        chrome.tabs.sendMessage(tabId, msg);
        return true; // attempt to fix message port closing error, consider return Promise

      case 'toggleRecord':
        chrome.tabs.sendMessage(tabId, msg);
        return true;

      case 'toggleAxRecord':
        toggleAxRecord = !toggleAxRecord;

        await replaceEmptySnap(tabsObj, tabId, toggleAxRecord);
        // sends new tabs obj to devtools
        if (portsArr.length > 0) {
          portsArr.forEach((bg) =>
            bg.postMessage({
              action: 'sendSnapshots',
              payload: tabsObj,
              tabId,
            }),
          );
        }
        return true; // return true so that port remains open

      case 'reinitialize':
        chrome.tabs.sendMessage(tabId, msg);
        return true;

      default:
        return true;
    }
  });
});

// INCOMING MESSAGE FROM CONTENT SCRIPT TO BACKGROUND.JS
// background.js listening for a message from contentScript.js
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // AUTOMATIC MESSAGE SENT BY CHROME WHEN CONTENT SCRIPT IS FIRST LOADED: set Content
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
    action === 'injectScript' ||
    action === 'devToolsInstalled' ||
    action === 'aReactApp'
  ) {
    isReactTimeTravel = true;
  } else {
    return true;
  }
  // everytime we get a new tabId, add it to the object
  if (isReactTimeTravel && !(tabId in tabsObj)) {
    tabsObj[tabId] = createTabObj(tabTitle);
  }
  switch (action) {
    case 'attemptReconnect': {
      const success = 'portSuccessfullyConnected';
      sendResponse({ success });
      break;
    }
    case 'jumpToSnap': {
      changeCurrLocation(tabsObj[tabId], tabsObj[tabId].hierarchy, index, name);
      // hack to test without message from mainSlice
      // toggleAxRecord = true;
      // record ax tree snapshot of the state that has now been jumped to if user did not toggle button on
      await replaceEmptySnap(tabsObj, tabId, toggleAxRecord);

      // sends new tabs obj to devtools
      if (portsArr.length > 0) {
        portsArr.forEach((bg) =>
          bg.postMessage({
            action: 'sendSnapshots',
            payload: tabsObj,
            tabId,
          }),
        );
      }

      if (portsArr.length > 0) {
        portsArr.forEach((bg) =>
          bg.postMessage({
            action: 'setCurrentLocation',
            payload: tabsObj,
          }),
        );
      }
      break;
    }

    // Confirmed React Dev Tools installed, send this info to frontend
    case 'devToolsInstalled': {
      tabsObj[tabId].status.reactDevToolsInstalled = true;

      portsArr.forEach((bg) =>
        bg.postMessage({
          action: 'devTools',
          payload: tabsObj,
        }),
      );
      break;
    }

    case 'aReactApp': {
      tabsObj[tabId].status.targetPageisaReactApp = true;
      // JR 12.20.23 9.53pm added a message action to send to frontend
      portsArr.forEach((bg) =>
        bg.postMessage({
          action: 'aReactApp',
          payload: tabsObj,
        }),
      );
      break;
    }
    // This injects a script into the app that you're testing Reactime on,
    // so that Reactime's backend files can communicate with the app's DOM.
    case 'injectScript': {
      const injectScript = (file, tab) => {
        const htmlBody = document.getElementsByTagName('body')[0];
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', file);
        // eslint-disable-next-line prefer-template
        htmlBody.appendChild(script);
      };

      chrome.scripting.executeScript({
        target: { tabId },
        func: injectScript,
        args: [chrome.runtime.getURL('bundles/backend.bundle.js'), tabId],
      });
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

        // check if accessibility recording has been toggled on
        let addedAxSnap;
        if (toggleAxRecord === true) {
          addedAxSnap = await axRecord(tabId);
          tabsObj[tabId].axSnapshots.push(addedAxSnap);
        } else {
          addedAxSnap = 'emptyAxSnap';
          tabsObj[tabId].axSnapshots.push(addedAxSnap);
        }
        sendToHierarchy(
          tabsObj[tabId],
          new HistoryNode(tabsObj[tabId], request.payload, addedAxSnap),
        );

        if (portsArr.length > 0) {
          portsArr.forEach((bg) =>
            bg.postMessage({
              action: 'initialConnectSnapshots',
              payload: tabsObj,
            }),
          );
        }

        break;
      }

      // DUPLICATE SNAPSHOT CHECK
      const isDuplicateSnapshot = (previous, incoming) => {
        if (!previous || !incoming) return false;
        const prevData = previous?.componentData;
        const incomingData = incoming?.componentData;

        // Check if both snapshots have required data
        if (!prevData || !incomingData) return false;

        const timeDiff = Math.abs(
          (incomingData.timestamp || Date.now()) - (prevData.timestamp || Date.now()),
        );
        return prevData.actualDuration === incomingData.actualDuration && timeDiff < 1000;
      };

      const previousSnap = tabsObj[tabId]?.currLocation?.stateSnapshot?.children[0];
      const incomingSnap = request.payload.children[0];

      if (isDuplicateSnapshot(previousSnap, incomingSnap)) {
        console.warn('Duplicate snapshot detected, skipping');
        break;
      }

      // Or if it is a snapShot after a jump, we don't record it.
      if (reloaded[tabId]) {
        // don't add anything to snapshot storage if tab is reloaded for the initial snapshot
        reloaded[tabId] = false;
      } else {
        tabsObj[tabId].snapshots.push(request.payload);
        // INVOKING buildHierarchy FIGURE OUT WHAT TO PASS IN
        if (!tabsObj[tabId][index]) {
          // check if accessibility recording has been toggled on
          let addedAxSnap;
          if (toggleAxRecord === true) {
            addedAxSnap = await axRecord(tabId);
            tabsObj[tabId].axSnapshots.push(addedAxSnap);
          } else {
            addedAxSnap = 'emptyAxSnap';
            tabsObj[tabId].axSnapshots.push(addedAxSnap);
          }
          sendToHierarchy(
            tabsObj[tabId],
            new HistoryNode(tabsObj[tabId], request.payload, addedAxSnap),
          );
        }
      }

      // sends new tabs obj to devtools
      if (portsArr.length > 0) {
        portsArr.forEach((bg, index) => {
          try {
            bg.postMessage({
              action: 'sendSnapshots',
              payload: tabsObj,
              sourceTab,
            });
          } catch (error) {
            console.warn(`Failed to send snapshots to port at index ${index}:`, error);
          }
        });
      } else {
        console.warn('No active ports to send snapshots to.');
      }
    }
    default:
      break;
  }
  return true; // attempt to fix close port error
});

// when tab is closed, remove the tabId from the tabsObj
chrome.tabs.onRemoved.addListener((tabId) => {
  // tell devtools which tab to delete
  if (portsArr.length > 0) {
    portsArr.forEach((bg) =>
      bg.postMessage({
        action: 'deleteTab',
        payload: tabId,
      }),
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
          }),
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

// When tab view is changed, put the tabId as the current tab
chrome.tabs.onActivated.addListener(async (info) => {
  // Get info about the tab information from tabId
  try {
    const tab = await chrome.tabs.get(info.tabId);

    // Only update activeTab if:
    // 1. It's not a Reactime extension tab
    // 2. We don't already have a localhost tab being tracked
    // 3. Or if it is a localhost tab (prioritize localhost)
    if (!tab.url?.match('^chrome-extension')) {
      if (isLocalhost(tab.url)) {
        // Always prioritize localhost tabs
        activeTab = tab;
        if (portsArr.length > 0) {
          portsArr.forEach((bg) =>
            bg.postMessage({
              action: 'changeTab',
              payload: { tabId: tab.id, title: tab.title },
            }),
          );
        }
      } else if (!activeTab || !isLocalhost(activeTab.url)) {
        // Only set non-localhost tab as active if we don't have a localhost tab
        activeTab = tab;
        if (portsArr.length > 0) {
          portsArr.forEach((bg) =>
            bg.postMessage({
              action: 'changeTab',
              payload: { tabId: tab.id, title: tab.title },
            }),
          );
        }
      }
    }
  } catch (error) {
    console.error('Error in tab activation handler:', error);
  }
});

// Ensure keep-alive is set up when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed. Setting up keep-alive...');
  setupKeepAlive();
});

// Ensure keep-alive is set up when the browser starts
chrome.runtime.onStartup.addListener(() => {
  console.log('Browser started. Setting up keep-alive...');
  setupKeepAlive();
});

// Optional: Reset keep-alive when a message is received (to cover edge cases)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'resetKeepAlive') {
    console.log('Resetting keep-alive as requested.');
    setupKeepAlive();
    sendResponse({ success: true });
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

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'reactime') {
    chrome.windows
      .create({
        url: chrome.runtime.getURL('panel.html'),
        type: 'popup',
        width: 1200,
        height: 800,
      })
      .then((window) => {
        // Listen for window close
        chrome.windows.onRemoved.addListener(function windowClosedListener(windowId) {
          if (windowId === window.id) {
            // Cleanup when window is closed
            portsArr.forEach((port) => {
              try {
                port.disconnect();
              } catch (error) {
                console.warn('Error disconnecting port:', error);
              }
            });
            // Clear the ports array
            portsArr.length = 0;

            // Remove this specific listener
            chrome.windows.onRemoved.removeListener(windowClosedListener);
          }
        });
      });
  }
});
