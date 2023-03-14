import { Snapshot, Status, FiberRoot } from '../types/backendTypes';
// passes the data down to its components
import componentActionsRecord from '../models/masterState';
import routes from '../models/routes';
import createTree from '../controllers/createTree/createTree';

// ---------------------------UPDATE TREE SNAP SHOT-----------------------------
/**
 * @function updateSnapShotTree - Creates a new `snapShot` fiber tree with the provided `fiberRoot`. This runs after every Fiber commit.
 * - Middleware: Updates snapShot object with latest snapshot, using `sendSnapshot`
 * @param snapShot The current snapshot of the fiber tree
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * @param fiberRoot The `fiberRootNode`, which is the root node of the fiber tree is stored in the current property of the fiber root object which we can use to traverse the tree
 */
// updating tree depending on current mode on the panel (pause, etc)
export default function updateSnapShotTree(
  snapShot: Snapshot,
  mode: Status,
  fiberRoot: FiberRoot,
): void {
  // this is the currently active root fiber(the mutable root of the tree)
  const { current } = fiberRoot;
  // clear all of the legacy actions from old fiber tree becuase we are about to create a new one
  componentActionsRecord.clear();
  // calls the createTree function which creates the new Fiber tree and adds it to tree property on the snapShot object
  snapShot.tree = createTree(current);
  // sends the updated tree back
  // Don't send messages while jumping or while paused
  if (mode.jumping || mode.paused) return;
  sendSnapshot(snapShot, mode);
}

// -------------------SEND TREE SNAP SHOT TO FRONT END--------------------------
/**
 * @function sendSnapshot - Gets a copy of the current snapShot.tree and posts a recordSnap message to the window
 * @param snapShot The current snapshot of the fiber tree that is shown in the extension
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * @return void
 *
 */
function sendSnapshot(snapShot: Snapshot, mode: Status): void {
  // Make a deep copy of the tree:
  const payload = snapShot.tree.cleanTreeCopy();
  payload.route = routes.addRoute(window.location.href);
  // method safely enables cross-origin communication between Window objects;
  // e.g., between a page and a pop-up that it spawned, or between a page
  // and an iframe embedded within it.
  // this postMessage will be sending the most up-to-date snapshot of the current React Fiber Tree
  // the postMessage action will be received on the content script to later update the tabsObj
  // this will fire off everytime there is a change in test application
  console.log('sendSnapShot', { payload });
  console.log('sendSnapShot', { componentAction: componentActionsRecord.getAllComponents() });
  window.postMessage(
    {
      action: 'recordSnap',
      payload,
    },
    '*',
  );
}
