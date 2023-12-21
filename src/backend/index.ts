/**
 * 'reactime' module has a single export
 * @function linkFiber
 */
// --------------------------START OF IMPORT------------------------------------
// regenerator runtime supports async functionality : This package implements a fully-functional source transformation that takes the syntax for generators/yield from ECMAScript 2015 or ES2015 and Asynchronous Iteration proposal and spits out efficient JS-of-today (ES5) that behaves the same way.
import 'regenerator-runtime/runtime';
// linkFiberInitialization (actually uses the function linkFiber but is labeled here as linkFiberInitialization, returns a function). When this returned function is invoked, it checks if devTools is installed, checks if the website is a reactApp, adds event listeners for timetravel, and allows us to obtain the initial FiberRoot Node from react dev tool
import linkFiber from './routers/linkFiber';
// timeJumpInitialization (actually uses the function timeJumpInitiation but is labeled here as linkFiberInitialization, returns a function) returns a function that sets jumping to false and handles timetravel feature
import timeJumpInitialization from './controllers/timeJump';
import { Snapshot, Status, MsgData } from './types/backendTypes';
import routes from './models/routes';

// -------------------------INITIALIZE MODE--------------------------
/** Indicate if mode is jumping/not jumping or navigating during jumping */
const mode: Status = {
  jumping: false,
};

// ---------------------INITIALIZE LINKFIBER & TIMEJUMP-------------------------
// linkFiber is now assigned the default ASYNC function exported from the file linkFiber.ts
const linkFiberInit = linkFiber(mode);
// timeJump is now assigned the default ASYNC function exported from the file timeJump.ts
const timeJump = timeJumpInitialization(mode);

/**
 * Invoke linkFiber to perform the following:
 * 1. Check for ReactDev installation, valid target React App
 * 2. Obtain the initial ReactFiber Tree from target React App
 * 3. Send a snapshot of ReactFiber Tree to frontend/Chrome Extension
 */
linkFiberInit();

// --------------INITIALIZE EVENT LISTENER FOR TIME TRAVEL----------------------
/**
 * On the chrome extension, if user click left/right arrow or the play button (a.k.a time travel functionality), frontend will send a message `jumpToSnap` with payload of the cached snapShot tree at the current step
 * 1. Set jumping mode to true => dictate we are jumping => no new snapshot will be sent to frontend
 * 2. If navigate to a new route during jumping => cache timeJump in navigate.
 * 3. If not navigate during jumping =>  invoke timeJump to update ReactFiber tree with cached data from the snapshot payload
 */
window.addEventListener('message', async ({ data: { action, payload } }: MsgData) => {
  console.log('index.ts window event listener data received: ', action, payload);
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
