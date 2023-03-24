import { Snapshot, Status, FiberRoot } from '../types/backendTypes';
// passes the data down to its components
import componentActionsRecord from '../models/masterState';
import routes from '../models/routes';
import createTree from '../controllers/createTree/createTree';

// -------------------------UPDATE & SEND TREE SNAP SHOT------------------------
/**
 * This function creates a new `snapShot` fiber tree with the provided `fiberRoot`, then send the updated snapshot to front end.
 * This runs after every Fiber commit if mode is not jumping.
 * This
 * @param snapshot The current snapshot of the fiber tree
 * @param fiberRoot The `fiberRootNode`, which is the root node of the fiber tree is stored in the current property of the fiber root object which we can use to traverse the tree
 */
// updating tree depending on current mode on the panel (pause, etc)
export default function updateAndSendSnapShotTree(snapshot: Snapshot, fiberRoot: FiberRoot): void {
  // This is the currently active root fiber(the mutable root of the tree)
  const { current } = fiberRoot;
  // Clear all of the legacy actions from old fiber tree becuase we are about to create a new one
  componentActionsRecord.clear();
  // Calls the createTree function which creates the new Fiber tree and adds it to tree property on the snapShot object
  snapshot.tree = createTree(current);
  // Make a deep copy of the tree:
  const payload = snapshot.tree;
  // Save the current window url to route
  payload.route = routes.addRoute(window.location.href);
  console.log('send snapshot', {
    payload,
    componentAction: componentActionsRecord.getAllComponents(),
  });

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
