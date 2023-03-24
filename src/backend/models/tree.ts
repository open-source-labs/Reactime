import { Route } from './routes';
import { ComponentData } from '../types/backendTypes';

// ComponentNames is used to store a mapping between a component's unique identifier and its name. This mapping is used to reconstruct the component instances during deserialization.
let componentNames = {};

// Making a deep clone of state becuase we want to make a copy
/**
 * @function serializeState - In the context of React, state is often used to store data that determines the behavior and appearance of a component. By serializing the state, we can preserve the component's data across page refreshes, server-side rendering, and other transitions. Additionally, by serializing the state and passing it to a child component, we can create a deep clone of the state, which allows the child component to manipulate the state without affecting the original component. This is useful in situations where we want to keep the state of the parent component immutable, but still allow child components to modify a copy of the state.
 * @param state - Object that contains the current state of the application or system that needs to be serialized.
 * @returns - Depclone of the passed in state. If there is any circulate state, return 'circularState'
 */
export function serializeState(state) {
  try {
    // makes a deep clone
    return JSON.parse(JSON.stringify(state));
  } catch (e) {
    // if there is an error, that means there is circular state i.e state that depends on itself
    console.log('circular');
    return 'circularState';
  }
}

/**
 * This is the current snapshot that is being sent to the snapshots array.
 * Creates a Tree
 * @param state - the current state of the component represented by this node.
 * @param name - the name of the component represented by this node.
 * @param componentData - an object containing the props of the component represented by this node.
 * @param chilren - an array of child nodes.
 * @param parent -  a reference to the parent node.
 * @param isExpanded - a boolean value indicating whether the node is expanded in the UI.
 * @param rtid - a unique identifier for the node.
 * @param route - an object representing the route associated with the node.
 */
class Tree {
  state: string | {}; // TODO: should change this to stateless || statefull

  name: string;

  componentData: ComponentData | {};

  children: Tree[];

  isExpanded: boolean = true;

  rtid: string | null;

  route?: Route;

  // Duplicate names: add a unique number ID
  // Create an object 'componentNames' to store each component name as a key and it's frequency of use as its value
  // When a new component is made on the tree, check if the new component's name already exists in 'componentNames' (possibly with the .hasOwnProperty method)
  // If the name already exists, add its value (an integer) to the name
  // Also, increment the value after
  // If not, create the new component and also a new key: value pair in 'componentNames' with the component's name as the key and 0 as its value
  // EXAMPLE OF COMPONENTNAMES OBJECT: {editableInput: 1, Provider: 0, etc}

  constructor(
    state: string | {},
    name = 'nameless',
    componentData: ComponentData | {} = {},
    rtid: string | null = null,
  ) {
    this.children = [];
    this.componentData = componentData;
    this.state = state === 'root' ? 'root' : serializeState(state);
    this.name = name;
    this.rtid = rtid;
  }

  // Returns a unique name ready to be used for when new components gets added to the tree
  /**
   * @function checkForDuplicates - Generates a unique name for a component that is being added to the component tree
   * @param name
   * @returns
   */
  checkForDuplicates(name: string): string {
    /**
     * The condition for check empty name does not seem to ever be reached
     * Commented and did not remove for potential future use
     */
    // check for empty name
    // if (name === '' && typeof this.rtid === 'string') {
    //   name = this.rtid.replace('fromLinkFiber', '');
    // }
    // if parent node is root, initialize the componentNames object
    if (this.name === 'root') componentNames = {};

    // Numerize the component name if found duplicate
    // Ex: A board has 3 rows => Row, Row1, Row2
    // Ex: Each row has 3 boxes => Box, Box1, Box2, ..., Box8
    componentNames[name] = componentNames[name] + 1 || 0;
    name += componentNames[name] ? componentNames[name] : '';

    return name;
  }
  /**
   *
   * @param state - string if root, serialized state otherwise
   * @param name - name of child
   * @param componentData - props
   * @param rtid - ??
   * @returns - return new tree instance that is child
   */
  addChild(
    state: Tree['state'],
    name: Tree['name'],
    componentData: Tree['componentData'],
    rtid: Tree['rtid'],
  ): Tree {
    // Get unique name by invoking checkForDuplicates method
    const uniqueName = this.checkForDuplicates(name);
    // Instantiates new child Tree with state, uniqueName, componentData and rtid
    const newChild: Tree = new Tree(state, uniqueName, componentData, rtid);
    // adds newChild to children array
    this.children.push(newChild);
    // return newChild
    return newChild;
  }
}

export default Tree;
