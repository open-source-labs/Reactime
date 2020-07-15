const snapShot = { tree: null };

const mode = {
  jumping: false,
  paused: false,
  locked: false,
};

const linkFiber = require('./linkFiber')(snapShot, mode);
const timeJump = require('./timeJump')(snapShot, mode);

function getRouteURL(node) {
  if (node.name === 'Router') {
    return node.state.location.pathname;
  }
  if (node.children && node.children.length >= 1) {
    const tempNode = node.children;
    for (let index = 0; index < tempNode.length; index += 1) {
      return getRouteURL(tempNode[index]);
    }
  }
}

window.addEventListener('message', ({ data: { action, payload } }) => { // runs automatically twice per second with inspectedElement
  switch (action) {
    case 'jumpToSnap':
      timeJump(payload);
      // Get the pathname from payload and add new entry to browser history
      // MORE: https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
      window.history.pushState('', '', getRouteURL(payload));
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
