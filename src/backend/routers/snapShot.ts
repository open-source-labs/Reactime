import { Snapshot, Status, FiberRoot } from '../types/backendTypes';
// passes the data down to its components
import componentActionsRecord from '../models/masterState';
import routes from '../models/routes';
import createTree from '../controllers/createTree/CreateTree';

// ---------------------------UPDATE TREE SNAP SHOT-----------------------------
/**
 * - Create a new `snapShot` tree with the provided `fiberRoot`. This runs after every Fiber commit.
 * - Middleware: Updates snapShot object with latest snapshot, using `sendSnapshot`
 * @param snapShot The current snapshot
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * @param fiberRoot The `fiberRootNode`, which is the root node of a tree of React component. The `current` property of `fiberRoot` has data structure of a Tree, which can be used to traverse and obtain all child component data.
 */
// updating tree depending on current mode on the panel (pause, etc)
export default function updateSnapShotTree(
  snapShot: Snapshot,
  mode: Status,
  fiberRoot: FiberRoot,
): void {
  // this is the currently active root fiber(the mutable root of the tree)
  const { current } = fiberRoot;
  componentActionsRecord.clear();
  // creates snapshot that is a tree based on properties in fiberRoot object
  snapShot.tree = createTree(current);
  // sends the updated tree back
  sendSnapshot(snapShot, mode);
}

// -------------------SEND TREE SNAP SHOT TO FRONT END--------------------------
/**
 * Gets a copy of the current snapShot.tree and posts a recordSnap message to the window
 * @param snapShot The current snapshot
 * @param mode The current mode (i.e. jumping, time-traveling, or paused)
 * @return void
 *
 */
function sendSnapshot(snapShot: Snapshot, mode: Status): void {
  // Don't send messages while jumping or while paused
  if (mode.jumping || mode.paused) return;

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
  window.postMessage(
    {
      action: 'recordSnap',
      payload,
    },
    '*',
  );
}
