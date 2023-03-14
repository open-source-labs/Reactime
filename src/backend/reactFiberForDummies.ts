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
  element: ReactElement | null;
  parent: FiberNode | null;
  child: FiberNode | null;
  sibling: FiberNode | null;
  alternate: FiberNode | null;
  effectTag: string | null;
  effects?: FiberNode[];
  stateNode: any;
}

/**
 * @function createFiberNode - Responsible for creating a new Fiber Node. A Fiber node is an object that represents a React element in the reconciliation process. It contains information about the element, its parent, and its children as well other data
 * @param element - React element that represents the component or DOM node that the fiber will represent. It is an object that contains information about the type of element, its props, its children, etc.
 * @param parent - The fiber node that represents the parent component of the element. It is used to link the new fiber node to the fiber tree by setting its parent property to the parent fiber node
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
    stateNode: null,
  };
};

/**
 * @function reconcile - The purpose of the reconcile function is to reconcile the children array with the parentFiber node. In other words, it creates a fiber tree that reflects the current state of the React element tree
 * @param parentFiber - The fiber node of the parent element in the tree
 * @param children - An array of child elements (React elements) that belong to the parent element
 */
const reconcile = (parentFiber: FiberNode, children: any[]): void => {
  // checks to see if the parent fiber has an alternate fiber and if it does, it sets oldFiber to its child
  // If there is an alternate fiber for the parent fiber, it means that there was a previous version of the fiber tree that was reconciled, and oldFiber is set to its child fiber so that it can compared to the new children in the current version of the tree
  let oldFiber = parentFiber.alternate && parentFiber.alternate.child;
  let newFiber: FiberNode | null = null;
  let index = 0; // used to keep track of the current index in the children array that is being processed
  let prevFiber: FiberNode | null = null; // used to keep track of the last fiber that was process in the loop

  while (index < children.length || !oldFiber) {
    const reactElement = children[index];
    // see if same type
    let sameType = oldFiber && reactElement && reactElement.type === oldFiber.element.type;
    // if same type is found, create a newFiber
    if (sameType) {
      newFiber = {
        element: reactElement,
        child: null,
        sibling: null,
        parent: parentFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
        stateNode: oldFiber.stateNode,
      };
    } else {
      if (reactElement) {
        newFiber = createFiberNode(reactElement, parentFiber);
        newFiber.effectTag = 'PLACEMENT';

        if (typeof reactElement.type === 'function') {
          newFiber.stateNode = new (reactElement.type as any)(reactElement.props);
        } else {
          newFiber.stateNode = document.createElement(reactElement.type as string);
        }
      }

      if (oldFiber) {
        oldFiber.effectTag = 'DELETION';
        parentFiber.effects = parentFiber.effects || [];
        parentFiber.effects.push(oldFiber);
      }
    }

    oldFiber === null ? null : oldFiber.sibling;
    // this block of code if responsible for  creating a singly linked list of child nodes for the parent element, where each node has a child property pointing to its first child node and a sibling property pointing to its next sibling
    if (index === 0) {
      parentFiber.child = newFiber;
    } else if (reactElement) {
      prevFiber!.sibling = newFiber;
    }

    prevFiber = newFiber;
    index++;
  }
};

/**
 * @function commitRoot - Responsible for committing the changes made to the DOM during the reconcilation phase
 * @param rootFiber - Root of the fiber tree. It contains information about the element and changes that need to be made to the DOM
 */
const commitRoot = (rootFiber: FiberNode) => {
  if (!rootFiber) return;
  rootFiber.effects?.forEach((fiber) => {
    if (fiber.effectTag === 'PLACEMENT') {
      // place existing element
    } else if (fiber.effectTag === 'UPDATE') {
      // update existing element
    } else if (fiber.effectTag === 'DELETION') {
      // remove element from DOM
    }
  });
};

/**
 * @function render - Creates a root fiber which is the top-level fiber that represents the root of the React element ree.
 * @param element - The react element that you want to render into the container. It represents the root of your component tree
 * @param container - The DOM element that you want to render your React element into. It is typically a <div>
 */
const render = (element: ReactElement, container: HTMLElement) => {
  const rootFiber: FiberNode = createFiberNode(element, null);
  rootFiber.element = container as any as ReactElement; // cast container to ReactElement
  const workInProgressRootFiber: FiberNode = {
    ...rootFiber,
    alternate: rootFiber,
  };
  reconcile(workInProgressRootFiber, element.props.children);
  commitRoot(workInProgressRootFiber);
};
