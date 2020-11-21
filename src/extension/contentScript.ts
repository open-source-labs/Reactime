
let firstMessage = true;

// listening for window messages (from the injected script.../DOM)
window.addEventListener('message', msg => { // runs automatically every second
  // window listener picks up the message it sends, so we should filter
  // messages sent by contentscript
  // console.log("msg source in content script: " + Object.entries(msg.source));
  if (firstMessage) {
    // one-time request tells the background script that the tab has reloaded
    chrome.runtime.sendMessage({ action: 'tabReload' });
    firstMessage = false;
  }
  
  // post initial Message to background.js
  const { action }: { action: string } = msg.data;
  console.log("action in addEvent Listener: ", action);
  if (action === 'recordSnap') {
    // this is firing on page load
    chrome.runtime.sendMessage(msg.data);
  }
});

// listening for messages from the UI of the extension
chrome.runtime.onMessage.addListener(request => {

  console.log("hello from content script! " + request.action);
  
  const { action }: { action: string } = request;
  // DELETE THIS
  // switch (action) {
  //   case 'jumpToSnap':
  //     // sends single msg to event listeners within the extension
  //     chrome.runtime.sendMessage(request);
  //     // message coming from injected script in web page
  //     // '*' == target window origin required for event to be dispatched, '*' = no preference
  //     window.postMessage(request, '*');
  //     break;
  //   case 'setLock':
  //   case 'setPause':
  //     window.postMessage(request, '*');
  //     break;
  //   case 'onHover': 
  //     window.postMessage(request, '*'); 
  //   default:
  //   case 'onHoverExit': 
  //     window.postMessage(request, '*'); 
  //     break;
  // }
  // DELETE ABOVE
  if (action) {
    if (action === 'jumpToSnap') {
      // sends single msg to event listeners within the extension
      chrome.runtime.sendMessage(request);
    }
    // message coming from injected script in web page
    // '*' == target window origin required for event to be dispatched, '*' = no preference
    window.postMessage(request, '*');
  }
  return true; // attempt to fix port closing console error
});

chrome.runtime.sendMessage({ action: 'injectScript' });
