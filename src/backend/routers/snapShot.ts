import { Snapshot, FiberRoot } from '../types/backendTypes';
import componentActionsRecord from '../models/masterState';
import routes from '../models/routes';
import createTree from '../controllers/createTree';
const _ = require('lodash');

// -------------------------UPDATE & SEND TREE SNAP SHOT------------------------
/**
 * This function creates a new `snapShot` fiber tree with the provided `fiberRoot`, then send the updated snapshot to front end.
 * This runs after every Fiber commit if mode is not jumping.
 * This
 * @param snapshot The current snapshot of the fiber tree
 * @param fiberRoot The `fiberRootNode`, which is the root node of the fiber tree is stored in the current property of the fiber root object which we can use to traverse the tree
 */
// updating tree depending on current mode on the panel (pause, etc)
export default function updateAndSendSnapShotTree(fiberRoot: FiberRoot): void {
  
  // This function compares trees with one another
  function isIdentical(tree1, tree2) {
    // Check if both are null
    if (!tree1 && !tree2) return true;
  
    // Check if either of them is null
    if (!tree1 || !tree2) return false;
  
    // Get the keys
    const tree1Keys = Object.keys(tree1);
    const tree2Keys = Object.keys(tree2);
  
    // Check if length of keys is different
    if (tree1Keys.length !== tree2Keys.length) return false;
  
    // Check keys and values
    for (let key of tree1Keys) {
      const val1 = tree1[key];
      const val2 = tree2[key];
  
      const areObjects = isObject(val1) && isObject(val2);
      if (
        (areObjects && !isIdentical(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }
    return true;
  }
  
  function isObject(object) {
    return object != null && typeof object === 'object';
  }
  
  // This is the currently active root fiber(the mutable root of the tree)
  const { current } = fiberRoot;
  // Clear all of the legacy actions from old fiber tree because we are about to create a new one
  componentActionsRecord.clear();
  // Calls the createTree function which creates the new snapshot tree and store new state update method to compoenActionsRecord
  /** The snapshot of the current ReactFiber tree */
  const payload = createTree(current);
  // Save the current window url to route
  payload.route = routes.addRoute(window.location.href);
  // method safely enables cross-origin communication between Window objects;
  // e.g., between a page and a pop-up that it spawned, or between a page
  // and an iframe embedded within it.
  // this postMessage will be sending the most up-to-date snapshot of the current React Fiber Tree
  // the postMessage action will be received on the content script to later update the tabsObj
  // this will fire off everytime there is a change in test application
  // convert the payload from a fiber tree to an object to avoid a data clone error when postMessage processes the argument
  console.log('This is the payload, baby: ', payload);
  const clonedDeepPayload = _.cloneDeep(payload);
  console.log('cloneDeepPayload tree', clonedDeepPayload);
  // compare payload and clonedDeepPayload with isIdentical
  // console.log('are they identical?', isIdentical(payload, clonedDeepPayload));
  // console.log('typeof payload', typeof payload);
  const obj = JSON.parse(JSON.stringify(payload));
  // console.log('righton, this is the obj: ', obj)
  // console.log('typeof obj', typeof obj);
  console.log('passing in obj');
  window.postMessage(
    {
      action: 'recordSnap',
      payload: obj,
    },
    '*',
  );
}
