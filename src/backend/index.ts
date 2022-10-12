/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 'reactime' module has a single export
 * @function linkFiber
*/
// regenerator runtime supports async functionality
import 'regenerator-runtime/runtime';
import linkFiberStart from './linkFiber';
import timeJumpStart from './timeJump';
import {
  Snapshot, Mode, MsgData,
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

// linkFiber is now assigned the default function exported from the file linkFiber.ts
const linkFiber = linkFiberStart(snapShot, mode);
// timeJump is now assigned the default function exported from the file timeJump.ts
const timeJump = timeJumpStart(snapShot, mode);

// * Event listener for time-travel actions
window.addEventListener('message', ({ data: { action, payload } }: MsgData) => {
  switch (action) {
    case 'jumpToSnap':
      timeJump(payload, true); // * This sets state with given payloa
      break;

    case 'setPause':
      mode.paused = payload;
      break;

    default:
      break;
  }
});
// connect to dev tools and new fiber,
// invokes anonymous function from linkFiber.ts set to linkFiber on line 30
linkFiber();
