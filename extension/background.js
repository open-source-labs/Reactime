console.log('background.js file is running');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('chrome.runtime.onMessage.addListener');
  console.log(request);
});

// establishing connection with devtools
chrome.runtime.onConnect.addListener((port) => {
  console.log('contentscript: connection established');
  port.postMessage({ from: 'background.js', message: 'established connection' });
  // port.onMessage.addListener((msg) => {
  //   console.log(msg);
  // });
});
