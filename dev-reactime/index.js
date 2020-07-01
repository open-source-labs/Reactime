/**
 * 'reactime' module has a single export
 * @function linkFiber
 */
import 'core-js';
import 'regenerator-runtime/runtime';
import linkFiberStart from './linkFiber';
import timeJumpStart from './timeJump';

// * State snapshot object initialized here
const snapShot = { 
  tree: null,
  unfilteredTree: null
};

const mode = {
  jumping: false,
  paused: false,
  locked: false,
};

// const linkFiber = require('./linkFiber')(snapShot, mode);
// console.log('import timeJump in index.js:', JSON.parse(JSON.stringify(snapShot)));
// const timeJump = require('./timeJump')(snapShot, mode);



const linkFiber = linkFiberStart(snapShot, mode);
const timeJump = timeJumpStart(snapShot, mode);


function getRouteURL(node) {
  if (node.name === 'Router') {
    return node.state.location.pathname;
  }
  if (node.children && node.children.length >= 1) {
    const tempNode = node.children;
    for (let index = 0; index < tempNode.length; index += 1) {
      return getRouteURL(tempNode[index]); // Carlos: ???
    }
  }
}

// * Event listener for time-travel actions
window.addEventListener('message', ({ data: { action, payload } }) => {
  switch (action) {
    case 'jumpToSnap':
      // console.log('payload in jumpToSnap', payload);
      timeJump(payload); // * This sets state with given payload
      // Get the pathname from payload and add new entry to browser history
      // MORE: https://developer.mozilla.org/en-US/docs/Web/API/History/pushState

      // try to modify workInProgress tree from here
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

console.log('index.js: loading reactime');
linkFiber();

// module.exports = linkFiber;
// export default linkFiber;
