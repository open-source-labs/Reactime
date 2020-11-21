/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/ban-types */
// import 'core-js';
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

let copyInstances = 0;
const circularComponentTable = new Set<Tree>();

// Removes unserializable state data such as functions
function scrubUnserializableMembers(tree: Tree): Tree {
  Object.entries(tree.state).forEach(keyValuePair => {
    if (typeof keyValuePair[1] === 'function') tree.state[keyValuePair[0]] = 'function';
  });
  return tree;
}

function serializeState(state) {
  try {
    return JSON.parse(JSON.stringify(state));
  } catch (e) {
    return 'circularState';
  }
}

/**
 * This is the current snapshot that is being sent to the snapshots array.
 * Creates a Tree
 * @param state : the tree's current state
 * @param name : the tree's name
 * @param componentData : Data in the component tree
 * @parent generates a new tree (recursive call)
 */
class Tree {
  state: string | {};

  name: string;

  componentData: {};

  children: (Tree | string)[];

  parent: Tree

  atomsComponents: any;

  atomSelectors: any;

  rtid: any; 

  recoilDomNode: any; 

  constructor(state: string | {}, name = 'nameless', componentData: {} = {}, rtid: any = null, recoilDomNode:any = null) {
    this.state = state === 'root' ? 'root' : serializeState(state);
    this.name = name;
    this.componentData = componentData ? JSON.parse(JSON.stringify(componentData)) : {};
    this.children = [];
    this.parent = null; // ref to parent so we can add siblings
    this.rtid = rtid
    this.recoilDomNode = recoilDomNode
  }

  addChild(state: string | {}, name: string, componentData: {}, rtid: any, recoilDomNode:any): Tree {
    //console.log("arguments in addChild: "+ arguments.length)
    const newChild: Tree = new Tree(state, name, componentData, rtid, recoilDomNode);
    newChild.parent = this;
    this.children.push(newChild);
    return newChild;
  }

  addSibling(state: string | {}, name: string, componentData: {},  rtid: any, recoilDomNode:any): Tree {
    const newSibling: Tree = new Tree(state, name, componentData, rtid,recoilDomNode);
    newSibling.parent = this.parent;
    this.parent.children.push(newSibling);
    return newSibling;
  }

  /**
   * @function cleanTreeCopy : Adds a sibing to the current tree
   */
  cleanTreeCopy(): Tree {
    /**
     * @object circularComponentTable : Clears circular component table only on first call, not recursive ones
     *
     */
    if (copyInstances === 0) {
      copyInstances++;
      circularComponentTable.clear();
    }
    // creates copy of present node
    let copy: Tree = new Tree(this.state, this.name, this.componentData, this.rtid, this.recoilDomNode);
    delete copy.parent;
    circularComponentTable.add(this);
    copy = scrubUnserializableMembers(copy);

    // creates copy of each child of the present node
    copy.children = this.children.map((child: Tree): Tree | string => {
      if (!circularComponentTable.has(child)) {
        return child.cleanTreeCopy();
      }
      return 'circular';
    });

    copyInstances--;
    return copy;
  }
}

export default Tree;
