console.log('contentScript injected');

// listening for messages from backend
window.addEventListener('message', (msg) => {
  const { action, payload } = msg.data;

  if (action === 'recordSnap') chrome.runtime.sendMessage(payload);
  console.log(msg);
});
