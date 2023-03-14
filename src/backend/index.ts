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
import linkFiberInitialization from './routers/linkFiber';
import timeJumpInitialization from './controllers/timeJump';
import { Snapshot, Status, MsgData } from './types/backendTypes';

// * State snapshot object initialized here
const snapShot: Snapshot = {
  tree: null,
};

const mode: Status = {
  jumping: false,
  paused: false,
};

// linkFiber is now assigned the default function exported from the file linkFiber.ts

console.log('Index ts', { snapShot: JSON.parse(JSON.stringify(snapShot)) });
const linkFiber = linkFiberInitialization(snapShot, mode);
// timeJump is now assigned the default function exported from the file timeJump.ts
const timeJump = timeJumpInitialization(mode);

// * Event listener for time-travel actions
window.addEventListener('message', ({ data: { action, payload } }: MsgData) => {
  switch (action) {
    case 'jumpToSnap':
      console.log('Index ts', { payload });
      timeJump(payload, true); // * This sets state with given payload
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
