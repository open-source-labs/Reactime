import { Snapshot, Status, FiberRoot } from '../types/backendTypes';
import { DevTools } from '../types/linkFiberTypes';
import updateAndSendSnapShotTree from './snapShot';
import throttle from '../controllers/throttle';
import componentActionsRecord from '../models/masterState';
import createComponentActionsRecord from '../controllers/createComponentActionsRecord';

// Set global variables to use in exported module and helper functions
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: DevTools;
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

/**
 * @constant MIN_TIME_BETWEEN_UPDATE - The minimum time (ms) between each re-render/update of the snapShot tree being displayed on the Chrome Extension.
 */
const MIN_TIME_BETWEEN_UPDATE = 70;
/**
 * @function throttledUpdateSnapshot - a function that will wait for at least MIN_TIME_BETWEEN_UPDATE ms, before updating the tree snapShot being displayed on the Chrome Extension.
 * @param fiberRoot - the root of ReactFiber Tree
 * @param mode - mode is jumping/not jumping or navigating during jumping
 * @param snapShot - the tree snapshot to send to Front End or obtained from Front End during timeJump
 */
const throttledUpdateSnapshot = throttle(async (fiberRoot: FiberRoot, mode: Status) => {
  // If not jumping
  if (!mode.jumping) {
    // Update and Send SnapShot tree to front end
    updateAndSendSnapShotTree(fiberRoot);
  }

  // If navigating to another route during jumping:
  else if (mode.navigating) {
    // Reset the array containing update methods:
    componentActionsRecord.clear();
    // Obtain new update methods for the current route:
    const { current } = fiberRoot;
    createComponentActionsRecord(current);
    // Invoke timeJump, which is stored in mode.navigating, to update React Application FiberTree based on the snapshotTree
    await mode.navigating();
  }
  // NOTE: if not navigating during jumping, timeJump is invoked in index.ts file.
}, MIN_TIME_BETWEEN_UPDATE);

/**
 * @function linkFiber - linkFiber contains core module functionality, exported as an anonymous function, perform the following logic:
 * 1. Check if React Dev Tool is installed.
 * 2. Check if the target application (on the browser) is a valid react application.
 * 3. Initiate a event listener for visibility update of the target React Application.
 * 4. Obtain the initial fiberRootNode, which is the root node of the fiber tree
 * 5. Initialize the fiber tree snapShot to send to Front End, later rendered on Chrome Extension.
 * 6. Monkey patching the onCommitFiberRoot from REACT DEV TOOL to obtain updated data after React Applicaiton is re-rendered.
 * @param snapShot The current snapshot (i.e fiber tree)
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * @return a function to be invoked by index.js that initiates snapshot monitoring
 */
export default function linkFiber(mode: Status): () => Promise<void> {
  /** A boolean value indicate if the target React Application is visible */
  let isVisible: boolean = true;
  /**
   * Every React application has one or more DOM elements that act as containers. React creates a fiber root object for each of those containers.
   * This fiber root is where React holds reference to a fiber tree
   * The `fiberRootNode`, which is the root node of the fiber tree is stored in the current property of the fiber root object
   */
  let fiberRoot: FiberRoot;

  // Return a function to be invoked by index.js that initiates snapshot monitoring
  return async function linkFiberInitialization() {
    // -------------------CHECK REACT DEVTOOL INSTALLATION----------------------
    // react devtools global hook is a global object that was injected by the React Devtools content script, allows access to fiber nodes and react version
    // Obtain React Devtools Object:
    const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    // If React Devtools is not installed, object will be undefined.
    if (!devTools) return;
    // If React Devtools is installed, send a message to front end.
    window.postMessage(
      {
        action: 'devToolsInstalled',
        payload: 'devToolsInstalled',
      },
      '*',
    );

    // --------------------CHECK VALID REACT APPLICATION------------------------
    // Obtain React Application information:
    const reactInstance = devTools.renderers.get(1);
    // If target application is not a React App, this will return undefined.
    if (!reactInstance) {
      return;
    }
    // If target application is a React App, send a message to front end.
    window.postMessage(
      {
        action: 'aReactApp',
        payload: 'aReactApp',
      },
      '*',
    );
    // --------------INITIATE EVENT LISTENER FOR VISIBILITY CHANGE--------------
    /**
     * Initiate an event listener for when there is a change to the visibility of the react target application (the browser tab)
     * @example If tic-tac-toe demo app is loaded on a tab with localhost:8080, whenever user switch tab or switch to another software => 'visibilityChange' => invoke the callback to update doWork boolean value
     */
    document.addEventListener('visibilitychange', () => {
      // Hidden property = background tab/minimized window
      isVisible = !document.hidden;
    });

    // ---------OBTAIN THE INITIAL FIBEROOTNODE FROM REACT DEV TOOL-------------
    // Obtain the FiberRootNode, which is the first value in the FiberRoot Set:
    fiberRoot = devTools.getFiberRoots(1).values().next().value;
    // console.log('initial fiberRoot from linkFiber', fiberRoot);

    // ----------INITIALIZE THE TREE SNAP SHOT ON CHROME EXTENSION--------------
    await throttledUpdateSnapshot(fiberRoot, mode); // only runs on start up

    // --------MONKEY PATCHING THE onCommitFiberRoot FROM REACT DEV TOOL--------
    // React has inherent methods that are called with react fiber
    // One of which is the onCommitFiberRoot method, which is invoked after the React application re-render its component(s).
    // we attach new functionality without compromising the original work that onCommitFiberRoot does
    // Money Patching the onCommitFiberRoot method from REACT DEV TOOL
    /**
     * @param onCommitFiberRoot -  is a callback provided by React that is automatically invoked by React Fiber after the target React application re-renders its components. This callback is used by REACT DEV TOOL to receive updated data about the component tree and its state. See {@link https://medium.com/@aquinojardim/react-fiber-reactime-4-0-f200f02e7fa8}
     * @returns an anonymous function, which will have the same parameters as onCommitFiberRoot and when invoked will update the fiberRoot value & post a request to update the snapShot tree on Chrome Extension
     */
    function addOneMoreStep(onCommitFiberRoot: DevTools['onCommitFiberRoot']) {
      return function (...args: Parameters<typeof onCommitFiberRoot>) {
        // Obtain the updated FiberRootNode, after the target React application re-renders
        const fiberRoot = args[1];
        // console.log('updated fiberRoot current from linkFiber', fiberRoot.current);
        // If the target React application is visible, send a request to update the snapShot tree displayed on Chrome Extension
        if (isVisible) throttledUpdateSnapshot(fiberRoot, mode);
        // After our added work is completed we invoke the original onComitFiberRoot function
        return onCommitFiberRoot(...args);
      };
    }
    devTools.onCommitFiberRoot = addOneMoreStep(devTools.onCommitFiberRoot);
  };
}
