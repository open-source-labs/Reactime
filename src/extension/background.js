console.log('background.js file is running');

let bg;

// need a function to clear snapshotArr when either tab is closed or page is refreshed
let snapshotArr = [];

// establishing connection with devtools
chrome.runtime.onConnect.addListener((port) => {
  bg = port;

  // if snapshots were saved in the snapshotArr,
  // send it to devtools as soon as connection to devtools is made
  if (snapshotArr.length > 0) {
    bg.postMessage(snapshotArr);
  }

  // receive snapshot from devtools and send it to contentScript
  port.onMessage.addListener((msg) => {
    console.log('background -> contentScript', msg);
    if (msg.action === 'emptySnap') {
      snapshotArr = [];
    } else {
      // find active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // send message to tab
        chrome.tabs.sendMessage(tabs[0].id, msg);
      });
    }
  });
});

// background.js recieves message from contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('npm -> background', request);
  // if port is not null, send a message to devtools
  if (bg) {
    // get active tab id
    // get snapshot arr from tab object
    snapshotArr.push([request]);
    bg.postMessage(snapshotArr);
    // else, push snapshot into an array
  } else snapshotArr.push(request);
});
