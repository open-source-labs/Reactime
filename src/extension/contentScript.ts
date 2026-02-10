// Web vital metrics calculated by 'web-vitals' npm package to be displayed
// in Web Metrics tab of Reactime app.
import { current } from '@reduxjs/toolkit';
import { onTTFB, onLCP, onFID, onFCP, onCLS, onINP } from 'web-vitals';

const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 16000;

let currentPort = null;
let isAttemptingReconnect = false;

function establishConnection(attemptNumber = 1) {
  console.log(`Establishing connection, attempt ${attemptNumber}`);

  try {
    currentPort = chrome.runtime.connect({ name: 'keepAlivePort' });

    console.log('Port created, setting up listeners');

    currentPort.onMessage.addListener((msg) => {
      console.log('Port received message:', msg);
    });

    currentPort.onDisconnect.addListener(() => {
      const error = chrome.runtime.lastError;
      console.log('Port disconnect triggered', error);

      // Clear current port
      currentPort = null;

      // Prevent multiple simultaneous reconnection attempts
      if (isAttemptingReconnect) {
        console.log('Already attempting to reconnect, skipping');
        return;
      }

      isAttemptingReconnect = true;

      // Calculate delay with exponential backoff
      const delay = Math.min(
        INITIAL_RECONNECT_DELAY * Math.pow(2, attemptNumber - 1),
        MAX_RECONNECT_DELAY,
      );

      if (attemptNumber <= MAX_RECONNECT_ATTEMPTS) {
        console.log(
          `Will attempt reconnection ${attemptNumber}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`,
        );

        window.postMessage(
          {
            action: 'portDisconnect',
            payload: {
              attemptNumber,
              maxAttempts: MAX_RECONNECT_ATTEMPTS,
              nextRetryDelay: delay,
            },
          },
          '*',
        );

        setTimeout(() => {
          isAttemptingReconnect = false;
          establishConnection(attemptNumber + 1);
        }, delay);
      } else {
        console.log('Max reconnection attempts reached');
        isAttemptingReconnect = false;

        window.postMessage(
          {
            action: 'portDisconnect',
            payload: {
              autoReconnectFailed: true,
              message: 'Automatic reconnection failed. Please use the reconnect button.',
            },
          },
          '*',
        );
      }
    });

    // Send initial test message
    currentPort.postMessage({ type: 'connectionTest' });
    console.log('Test message sent');
  } catch (error) {
    console.error('Error establishing connection:', error);
    isAttemptingReconnect = false;

    // If immediate connection fails, try again
    if (attemptNumber <= MAX_RECONNECT_ATTEMPTS) {
      const delay = INITIAL_RECONNECT_DELAY;
      console.log(`Connection failed immediately, retrying in ${delay}ms`);
      setTimeout(() => establishConnection(attemptNumber + 1), delay);
    }
  }
}

// Initial connection
console.log('Starting initial connection');
establishConnection();

// Reactime application starts off with this file, and will send
// first message to background.js for initial tabs object set up.
// A "tabs object" holds the information of the current tab,
// such as snapshots, performance metrics, title of app, and so on.
let firstMessage = true;
// Listens for window messages (from the injected script on the DOM)
let isRecording = true;

// INCOMING MESSAGE FROM BACKEND (index.ts) TO CONTENT SCRIPT
window.addEventListener('message', (msg) => {
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
    if (isRecording) {
      // add timestamp to payload for the purposes of duplicate screenshot check in backgroundscript -ellie
      msg.data.payload.children[0].componentData.timestamp = Date.now();
      chrome.runtime.sendMessage(msg.data);
    }
  }
  if (action === 'devToolsInstalled') {
    chrome.runtime.sendMessage(msg.data);
  }
  if (action === 'aReactApp') {
    chrome.runtime.sendMessage(msg.data);
  }
});

// -------------- USER INPUT VISUALIZATION (CLICK REPLAY POINTER) --------------
const REACTIME_POINTER_OVERLAY_ID = 'reactime-pointer-overlay';
const REACTIME_POINTER_STYLES_ID = 'reactime-pointer-styles';

function getOrCreatePointerOverlay() {
  let overlay = document.getElementById(REACTIME_POINTER_OVERLAY_ID);
  if (!overlay) {
    // Inject styles once for pointer overlay (dot + ripple, high contrast)
    if (!document.getElementById(REACTIME_POINTER_STYLES_ID)) {
      const style = document.createElement('style');
      style.id = REACTIME_POINTER_STYLES_ID;
      style.textContent = `
        #${REACTIME_POINTER_OVERLAY_ID} {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2147483647;
        }
        #${REACTIME_POINTER_OVERLAY_ID} .reactime-pointer-dot {
          position: fixed;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #0d9488;
          border: 3px solid #fff;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.2), 0 0 20px 4px rgba(13,148,136,0.5);
          transform: translate(-50%, -50%);
        }
        #${REACTIME_POINTER_OVERLAY_ID} .reactime-pointer-ripple {
          position: fixed;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 3px solid #14b8a6;
          transform: translate(-50%, -50%);
          opacity: 0;
        }
        #${REACTIME_POINTER_OVERLAY_ID}.reactime-pointer-visible .reactime-pointer-dot {
          animation: reactime-dot-pulse 2s ease-in-out;
          animation-iteration-count: infinite;
        }
        #${REACTIME_POINTER_OVERLAY_ID}.reactime-pointer-visible .reactime-pointer-ripple {
          animation: reactime-ripple 1.2s ease-out;
          animation-iteration-count: infinite;
        }
        @keyframes reactime-dot-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; box-shadow: 0 0 0 1px rgba(0,0,0,0.2), 0 0 20px 4px rgba(13,148,136,0.5); }
          10% { transform: translate(-50%, -50%) scale(1); opacity: 1; box-shadow: 0 0 0 1px rgba(0,0,0,0.2), 0 0 20px 4px rgba(13,148,136,0.5); }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; box-shadow: 0 0 0 1px rgba(0,0,0,0.2), 0 0 28px 8px rgba(13,148,136,0.7); }
        }
        @keyframes reactime-ripple {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          #${REACTIME_POINTER_OVERLAY_ID}.reactime-pointer-visible .reactime-pointer-dot {
            animation: reactime-dot-in 0.25s ease-out;
          }
          #${REACTIME_POINTER_OVERLAY_ID}.reactime-pointer-visible .reactime-pointer-ripple {
            animation: none;
            opacity: 0;
          }
        }
        @keyframes reactime-dot-in {
          from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    overlay = document.createElement('div');
    overlay.id = REACTIME_POINTER_OVERLAY_ID;
    overlay.setAttribute('aria-hidden', 'true');
    const ripple = document.createElement('div');
    ripple.className = 'reactime-pointer-ripple';
    const dot = document.createElement('div');
    dot.className = 'reactime-pointer-dot';
    overlay.appendChild(ripple);
    overlay.appendChild(dot);
    overlay.style.display = 'none';
    (document.body || document.documentElement).appendChild(overlay);
  }
  return overlay;
}

function updateClickReplayPointer(payload) {
  const event = payload?.lastUserEvent;
  const overlay = getOrCreatePointerOverlay();
  const dot = overlay.querySelector('.reactime-pointer-dot');
  const ripple = overlay.querySelector('.reactime-pointer-ripple');
  if (!dot || !(dot instanceof HTMLElement)) return;
  if (event && typeof event.x === 'number' && typeof event.y === 'number') {
    const left = `${event.x}px`;
    const top = `${event.y}px`;
    dot.style.left = left;
    dot.style.top = top;
    if (ripple && ripple instanceof HTMLElement) {
      ripple.style.left = left;
      ripple.style.top = top;
    }
    overlay.style.display = '';
    // Remove then re-add visible class so ripple animation plays every time we jump
    overlay.classList.remove('reactime-pointer-visible');
    requestAnimationFrame(() => {
      overlay.classList.add('reactime-pointer-visible');
    });
  } else {
    overlay.classList.remove('reactime-pointer-visible');
    overlay.style.display = 'none';
  }
}

// FROM BACKGROUND TO CONTENT SCRIPT
// Listening for messages from the UI of the Reactime extension.
chrome.runtime.onMessage.addListener((request) => {
  const { action, port }: { action: string; port?: string } = request;
  if (action) {
    // Message being sent from background.js
    // This is toggling the record button on Reactime when clicked
    if (action === 'toggleRecord') {
      isRecording = !isRecording;
    }
    // this is only listening for Jump toSnap
    if (action === 'jumpToSnap') {
      updateClickReplayPointer(request.payload);
      chrome.runtime.sendMessage(request);
      // After the jumpToSnap action has been sent back to background js,
      // it will send the same action to backend files (index.ts) for it execute the jump feature
      // '*' == target window origin required for event to be dispatched, '*' = no preference
      window.postMessage(request, '*');
    }
    if (action === 'portDisconnect' && !currentPort && !isAttemptingReconnect) {
      console.log('Received disconnect message, initiating reconnection');
      // When we receive a port disconnection message, relay it to the window
      window.postMessage(
        {
          action: 'portDisconnect',
        },
        '*',
      );

      // Attempt to re-establish connection
      establishConnection();
    }

    if (action === 'reinitialize') {
      window.postMessage(request, '*');
    }
    return true;
  }
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
onTTFB(gatherMetrics);
onLCP(gatherMetrics);
onFID(gatherMetrics);
onFCP(gatherMetrics);
onCLS(gatherMetrics);
onINP(gatherMetrics);

// Send message to background.js for injecting the initial script
// into the app's DOM.
chrome.runtime.sendMessage({ action: 'injectScript' });
