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
import componentActionsRecord from './models/masterState';
import routes from './models/routes';

// * State snapshot object initialized here
const snapShot: Snapshot = {
  tree: null,
};

const mode: Status = {
  jumping: false,
  paused: false,
};

// linkFiber is now assigned the default function exported from the file linkFiber.ts

console.log('Index ts Initiation');
const linkFiber = linkFiberInitialization(snapShot, mode);
// timeJump is now assigned the default function exported from the file timeJump.ts
const timeJump = timeJumpInitialization(mode);

// * Event listener for time-travel actions
window.addEventListener('message', async ({ data: { action, payload } }: MsgData) => {
  switch (action) {
    case 'jumpToSnap':
      console.log('Index ts - jumpToSnap', { payload });
      // Set mode to jumping to prevent snapShot being sent to frontEnd
      // NOTE: mode.jumping is set to false inside the timeJump.ts
      mode.jumping = true;
      // Check if we are navigating to another route
      const navigating: boolean = routes.navigate(payload.route);
      // If need to navigate
      if (navigating) {
        // Pass timeJump function to mode.navigating => which will be invoked during onCommitFiberRoot:
        mode.navigating = () => timeJump(payload);
      }
      // If not navitating, invoke timeJump immediately to update React Application FiberTree based on the snapshotTree
      else {
        await timeJump(payload); // * This sets state with given payload
      }
      break;

    default:
      break;
  }
});
// connect to dev tools and new fiber,
// invokes anonymous function from linkFiber.ts set to linkFiber on line 30
linkFiber();
