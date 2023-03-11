import { Snapshot, Status, FiberRoot } from './types/backendTypes';
// import function that creates a tree
import Tree from './tree';
// passes the data down to its components
import componentActionsRecord from './masterState';
import routes from './routes';
import { createTree } from './linkFiber';
/**
 * @method sendSnapshot
 * @param snapShot The current snapshot
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * @return Nothing.
 *
 * Middleware: Gets a copy of the current snapShot.tree and posts a recordSnap message to the window
 */
function sendSnapshot(snapShot: Snapshot, mode: Status): void {
  // Don't send messages while jumping or while paused
  if (mode.jumping || mode.paused) return;
  // If there is no current tree  creates a new one
  if (!snapShot.tree) {
    snapShot.tree = new Tree('root', 'root');
  }
  // Make a deep copy of the tree:
  const payload = snapShot.tree.cleanTreeCopy();
  payload.route = routes.addRoute(window.location.href);
  // method safely enables cross-origin communication between Window objects;
  // e.g., between a page and a pop-up that it spawned, or between a page
  // and an iframe embedded within it.
  // this postMessage will be sending the most up-to-date snapshot of the current React Fiber Tree
  // the postMessage action will be received on the content script to later update the tabsObj
  // this will fire off everytime there is a change in test application

  window.postMessage(
    {
      action: 'recordSnap',
      payload,
    },
    '*',
  );
}

/**
 * @function updateSnapShotTree
 * @param snapShot The current snapshot
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * Middleware: Updates snapShot object with latest snapshot, using @sendSnapshot
 */
// updating tree depending on current mode on the panel (pause, etc)
export default function updateSnapShotTree(
  snapShot: Snapshot,
  mode: Status,
  fiberRoot: FiberRoot,
): void {
  console.log('snapShot - Update');
  // this is the currently active root fiber(the mutable root of the tree)
  if (fiberRoot) {
    const { current } = fiberRoot;
    // creates snapshot that is a tree based on properties in fiberRoot object
    componentActionsRecord.clear();
    snapShot.tree = createTree(current);
  }
  // sends the updated tree back
  sendSnapshot(snapShot, mode);
}
