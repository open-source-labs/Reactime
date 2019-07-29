console.log('contentScript running');

// listening for messages from npm package
window.addEventListener('message', (msg) => {
  const { action, payload } = msg.data;

  if (action === 'recordSnap') {
    chrome.runtime.sendMessage(payload);
  }
});

// listening for messages from background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // send the message to npm package
  console.log('devtools -> contentScript', request);
  const { action } = request;
  if (action === 'jumpToSnap') window.postMessage(request);
  if (action === 'stepToSnap') window.postMessage(request);
});
