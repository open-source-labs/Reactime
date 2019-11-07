const snapShot = { tree: null };

const mode = {
  jumping: false,
  paused: false,
  locked: false,
};

const linkFiber = require('./linkFiber')(snapShot, mode);
const timeJump = require('./timeJump')(snapShot, mode);

window.addEventListener('message', ({ data: { action, payload } }) => { //runs automatically twice per second with inspectedElement
  switch (action) {
    case 'jumpToSnap':
      timeJump(payload);
      // Get the pathname from payload and add new entry to browser history
      // MORE: https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
      if (payload.children[0].state && payload.children[0].state.location) {
        const route = payload.children[0].state.location.pathname;
        window.history.pushState(route);
      }
      break;
    case 'setLock':
      mode.locked = payload;
      break;
    case 'setPause':
      mode.paused = payload;
      break;
    default:
      break;
  }
});

module.exports = linkFiber;
