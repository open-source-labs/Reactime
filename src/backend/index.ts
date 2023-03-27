/**
 * 'reactime' module has a single export
 * @function linkFiber
 */
// --------------------------START OF IMPORT------------------------------------
// regenerator runtime supports async functionality
import 'regenerator-runtime/runtime';
import linkFiberInitialization from './routers/linkFiber';
import timeJumpInitialization from './controllers/timeJump';
import { Snapshot, Status, MsgData } from './types/backendTypes';
import routes from './models/routes';

// -------------------------INITIALIZE SNAPSHOT & MODE--------------------------
/** The snapshot of the current ReactFiber tree */
const snapShot: Snapshot = {
  tree: null,
};

/** Indicate if mode is jumping/not jumping or navigating during jumping */
const mode: Status = {
  jumping: false,
};

// ---------------------INITIALIZE LINKFIBER & TIMEJUMP-------------------------
// linkFiber is now assigned the default ASYNC function exported from the file linkFiber.ts
const linkFiber = linkFiberInitialization(snapShot, mode);
// timeJump is now assigned the default ASYNC function exported from the file timeJump.ts
const timeJump = timeJumpInitialization(mode);

/**
 * Invoke linkFiber to perform the follwoing:
 * 1. Check for ReactDev installation, valid target React App
 * 2. Obtain the intial ReactFiber Tree from target React App
 * 3. Send a snapshot of ReactFiber Tree to frontend/Chrome Extension
 */
linkFiber();

// -----------------SET UP EVENT LISTENER FOR TIME TRAVEL-----------------------
/**
 * On the chrome extension, if user click left/right arrow or the play button (a.k.a time travel functionality), frontend will send a message jumpToSnap with payload of the cached snapShot tree at the current step
 * 1. Set jumping mode to true => dictate we are jumping => no new snapshot will be sent to frontend
 * 2. If navigate to a new route during jumping => cache timeJump in navigate.
 *    Otherwise, invoke timeJump to update ReactFiber tree with cached data     from the snapshot payload
 */
window.addEventListener('message', async ({ data: { action, payload } }: MsgData) => {
  switch (action) {
    case 'jumpToSnap':
      // Set mode to jumping to prevent snapShot being sent to frontEnd
      // NOTE: mode.jumping is set to false inside the timeJump.ts
      mode.jumping = true;
      // Check if we are navigating to another route
      const navigating: boolean = routes.navigate(payload.route);
      // If need to navigate
      if (navigating) {
        // Cache timeJump function in mode.navigating => which will be invoked during onCommitFiberRoot:
        mode.navigating = () => timeJump(payload);
      }
      // If not navitating, invoke timeJump immediately to update React Application FiberTree based on the snapshotTree payload
      else {
        await timeJump(payload); // * This sets state with given payload
      }
      break;
    default:
      break;
  }
});
