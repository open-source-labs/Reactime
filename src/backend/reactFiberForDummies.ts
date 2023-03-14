/**
 * @type
 * @member type - The type of the element. Can be a string (for HTML/SVG tags), a function component (a function that returns a React element), or a class component (a class that extends React.Component and has a render() method).
 * @member props - An object containing the properties passed to the element. These are the properties that are specified in JSX
 * @member key - An optional key that can be used to identify an element in a list. This helps React determine which elements have changed when rendering a list.
 * @member ref - An optional ref that can be used to get a reference to the element's underlying DOM node. This is useful for imperatively manipulating the DOM
 * @member _owner - A reference to the component that created this element. This property is used for debugging purposes only and is not meant to be used in production code.
 */

interface ReactElement {
  type: string | Function;
  props: {
    [key: string]: any;
    children: ReactElement[];
  };
  key: string | null;
  ref: any;
  _owner: FiberNode | null;
}

/**
 * @type
 * @member element - This property holds the current element that the fiber represents in the render tree.
 * @member parent - This property holds a reference to the parent fiber of the current fiber.
 * @member child - This property holds a reference to the first child fiber of the current fiber.
 * @member sibling - This property holds a reference to the next sibling fiber of the current fiber.
 * @member alternate - This property holds a reference to the corresponding fiber in the previous render (i.e. the "old" fiber).
 * @member effectTag - This property is used to describe the type of update that needs to be made to the DOM when the fiber is committed. It can be one of three values: "PLACEMENT" (for new elements), "UPDATE" (for updates to existing elements), or "DELETION" (for elements that need to be removed from the DOM).
 * @member effects - This property is used to keep track of all the fibers that need to be updated, added, or removed from the DOM during the current commit phase. It is an array of fibers that have been marked with an effectTag other than null.
 */

interface FiberNode {
  element: ReactElement;
  parent: FiberNode | null;
  child: FiberNode | null;
  sibling: FiberNode | null;
  alternate: FiberNode | null;
  effectTag: string | null;
  effects?: FiberNode[];
}

/**
 *
 * @param element
 * @param parent
 * @returns
 */
const createFiberNode = (element: ReactElement, parent: FiberNode | null): FiberNode => {
  return {
    element,
    parent,
    child: null,
    sibling: null,
    alternate: null,
    effectTag: null,
  };
};

// Fiber Reconciliation
const reconcile = (parentFiber: FiberNode, children: any[]) => {
  // checks to see if the parent fiber has an alternate fiber and if it does, it sets oldFiber to its child
  // If there is an alternate fiber for the parent fiber, it means that there was a previous version of the fiber tree that was reconciled, and oldFiber is set to its child fiber so that it can compared to the new children in the current version of the tree
  let oldFiber = parentFiber.alternate && parentFiber.alternate.child;
  let newFiber: FiberNode | null = null;
  let index = 0; // used to keep track of the current index in the children array that is being processed
  let prevFiber: FiberNode | null = null; // used to keep track of the last fiber that was process in the loop

  while (index < children.length || !oldFiber) {
    const element = children[index];
    // see if same type
    let sameType = oldFiber && element && element.type === oldFiber.element.type;
    // if same type is founf, create a newFiber
    if (sameType) {
      newFiber = {
        element,
        child: null,
        sibling: null,
        parent: parentFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }
  }
};
// Perform updates to DOM
