/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 'reactime' module has a single export
 * @function linkFiber
*/

import 'regenerator-runtime/runtime';
import linkFiberStart from './linkFiber';
import timeJumpStart from './timeJump';
import {
  Snapshot, Mode, SnapshotNode, MsgData,
} from './types/backendTypes';

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
// console.log("linkFiberStart in index.ts:" + linkFiberStart);
const linkFiber = linkFiberStart(snapShot, mode); // grabbing existing tree from react devtools
// console.log('linkFiber in index.ts: ' + linkFiber);
const timeJump = timeJumpStart(snapShot, mode);

/* 
function getRouteURL(node: SnapshotNode): string {
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
*/
// * Event listener for time-travel actions
window.addEventListener('message', ({ data: { action, payload } }: MsgData) => {
  // console.log('linkFiber in index.ts: ' + linkFiber);
  // console.log('action:', action);
  // console.log('payload:', payload);
  switch (action) {
    case 'jumpToSnap':
      timeJump(payload, true); // * This sets state with given payload
      // Get the pathname from payload and add new entry to browser history
      // MORE: https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
      // try to modify workInProgress tree from here
      // window.history.pushState('', '', getRouteURL(payload));
      break;
    case 'setLock':
      mode.locked = payload;
      break;
    case 'setPause':
      mode.paused = payload;
      break;
    case 'onHover':    
      if(Array.isArray(payload)){ 
        for (let i=0; i<payload.length;i++){
          let element = document.getElementById(payload[i])
          if (element !== null) {
                element.style.backgroundColor = '#C0D9D9'; 
              }
        }
      } else {
        let element = document.getElementById(payload)
        if (element !== null) {
          element.style.backgroundColor = '#C0D9D9'; 
        }
      }
      break;
    case 'onHoverExit': 
        if(Array.isArray(payload)){ 
        for (let i=0; i<payload.length;i++){
          let element = document.getElementById(payload[i])
          if (element !== null) {
                element.style.backgroundColor = ''; 
              }
        }
      } else {
        let element = document.getElementById(payload)
        if (element !== null) {
          element.style.backgroundColor = ''; 
        }
      }
      break;
    default:
      break;
  }
});

linkFiber();
