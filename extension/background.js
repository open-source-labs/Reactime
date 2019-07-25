console.log('background.js file is running');

let bg;
const snapshotArr = [];

// establishing connection with devtools
chrome.runtime.onConnect.addListener((port) => {
  bg = port;
  bg.postMessage({ from: 'background.js', message: 'established connection', date: Date.now() });

  // if snapshots were saved in the snapshotArr, send it to devtools as soon as connection to devtools is made
  if (snapshotArr.length > 0) {
    bg.postMessage(snapshotArr);
  }
});

// background.js recieves message from contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // if port is not null, send a message to devtools
  if (bg) {
    snapshotArr.push(request);
    bg.postMessage(snapshotArr);
    // else, push snapshot into an array
  } else snapshotArr.push(request);
});
