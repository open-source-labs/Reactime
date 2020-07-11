/**
 * 'reactime' module has a single export
 * @function linkFiber
 */
import 'core-js';
import 'regenerator-runtime/runtime';
import linkFiberStart from './linkFiber';
import timeJumpStart from './timeJump';
import { Interface } from 'readline';

interface Snapshot{
    tree: null;
    unfilteredTree: null;
}

interface Mode {
    jumping: boolean;
    paused: boolean;
    locked: boolean;
}
interface Node{
    name: string;
    state: {
      location?: any
    }
    children: any[]
}
interface Data{
  data: {
    action: string,
    payload: any,
  }
}

// * State snapshot object initialized here
const snapShot: Snapshot = { 
  tree: null,
  unfilteredTree: null,
};

const mode: Mode = {
  jumping: false,
  paused: false,
  locked: false,
};


// const linkFiber = require('./linkFiber')(snapShot, mode);
// const timeJump = require('./timeJump')(snapShot, mode);



const linkFiber = linkFiberStart(snapShot, mode);
console.log('linkfiber --> ',linkFiber)
const timeJump = timeJumpStart(snapShot, mode);
console.log('timejump --> ' , timeJump )


function getRouteURL(node: Node): string {
  if (node.name === 'Router') {
    return node.state.location.pathname;
  }
  if (node.children && node.children.length >= 1) {
    const tempNode: any[] = node.children;
    for (let index = 0; index < tempNode.length; index += 1) {
      return getRouteURL(tempNode[index]); // Carlos: ???
    }
  }
}

// * Event listener for time-travel actions
window.addEventListener('message', ({ data: { action, payload } } : Data) => {
  switch (action) {
    case 'jumpToSnap':
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

linkFiber();

// module.exports = linkFiber;
// export default linkFiber;
