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
};

const linkFiber = linkFiberStart(snapShot, mode);
const timeJump = timeJumpStart(snapShot, mode);

// * Event listener for time-travel actions
window.addEventListener('message', ({ data: { action, payload } }: MsgData) => {
  switch (action) {
    case 'jumpToSnap':
      timeJump(payload, true); // * This sets state with given payload
      // Get the pathname from payload and add new entry to browser history
      // MORE: https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
      // try to modify workInProgress tree from here
      // window.history.pushState('', '', getRouteURL(payload));
      break;
    case 'setPause':
      mode.paused = payload;
      break;
    // maybe this isn't work react cohort 45
    // case 'onHover':
    //   if (Array.isArray(payload)) {
    //     for (let i = 0; i < payload.length; i + 1) {
    //       const element = document.getElementById(payload[i]);
    //       if (element !== null) {
    //         element.style.backgroundColor = '#C0D9D9';
    //       }
    //     }
    //   } else {
    //     const element: HTMLElement = document.querySelector(`.${payload}`);
    //     if (element !== null) {
    //       element.style.backgroundColor = '#C0D9D9';
    //     }
    //   }
    //   break;
    // // maybe this isn't work react cohort 45
    // case 'onHoverExit':
    //   if (Array.isArray(payload)) {
    //     for (let i = 0; i < payload.length; i++) {
    //       const element: HTMLElement = document.querySelector(`.${payload}`);
    //       if (element !== null) {
    //         element.style.backgroundColor = '';
    //       }
    //     }
    //   } else {
    //     const element: HTMLElement = document.querySelector(`.${payload}`);
    //     if (element !== null) {
    //       element.style.backgroundColor = '';
    //     }
    //   }
    //   break;
    default:
      break;
  }
});
// connect to dev tools and new fiber
linkFiber();
