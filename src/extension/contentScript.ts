// Web vital metrics calculated by 'web-vitals' npm package to be displayed
// in Web Metrics tab of Reactime app.
import {
  getTTFB, getLCP, getFID, getFCP, getCLS,
} from 'web-vitals';

// Reactime application starts off with this file, and will send
// first message to background.js for initial tabs object set up.
// A "tabs object" holds the information of the current tab,
// such as snapshots, performance metrics, title of app, and so on.
let firstMessage = true;
// Listens for window messages (from the injected script on the DOM)
window.addEventListener('message', msg => {
  // Event listener runs constantly based on actions
  // recorded on the test application from backend files (linkFiber.ts).
  // Background.js has a listener that includes switch cases, depending on
  // the name of the action (e.g. 'tabReload').
  if (firstMessage) {
    // One-time request tells the background script that the tab has reloaded.
    chrome.runtime.sendMessage({ action: 'tabReload' });
    firstMessage = false;
  }

  // After tabs object has been created from firstMessage, backend (linkFiber.ts)
  // will send snapshots of the test app's link fiber tree.
  const { action }: { action: string } = msg.data;
  if (action === 'recordSnap') {
    chrome.runtime.sendMessage(msg.data);
  }
  if (action === 'noDevToolsInstalled') {
    console.log('noDevToolsInstalled in content script', msg.data);
    chrome.runtime.sendMessage(msg.data);
  }
});

// Listening for messages from the UI of the Reactime extension.
chrome.runtime.onMessage.addListener(request => {
  const { action }: { action: string; } = request;
  console.log('content Script: from background script', request);
  // this is only listening for Jump toSnap
  if (action) {
    if (action === 'jumpToSnap') {
      //
      //
      chrome.runtime.sendMessage(request);
    }
    // After the jumpToSnap action has been sent back to background js,
    // it will send the same action to backend files (index.ts) for it execute the jump feature
    // '*' == target window origin required for event to be dispatched, '*' = no preference
    window.postMessage(request, '*');
  }
  return true; // attempt to fix port closing console error
});

// Performance metrics being calculated by the 'web-vitals' api and
// sent as an object to background.js.
// To learn more about Chrome web vitals, see https://web.dev/vitals/.
const metrics = {};
const gatherMetrics = ({ name, value }) => {
  metrics[name] = value;

  chrome.runtime.sendMessage({
    type: 'performance:metric',
    name,
    value,
  });
};

// Functions that calculate web metric values.
getTTFB(gatherMetrics);
getLCP(gatherMetrics);
getFID(gatherMetrics);
getFCP(gatherMetrics);
getCLS(gatherMetrics);

// Send message to background.js for injecting the initial script
// into the app's DOM.
chrome.runtime.sendMessage({ action: 'injectScript' });
