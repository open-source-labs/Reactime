import { FiberRoot } from './backendTypes';

/**
 * @interface DevTools - A global object provided by the React Developer Tools extension. It provides a set of methods that allow developers to inspect and manipulate React components in the browser.
 */
export interface DevTools {
  /**
   * @property renderers - an Map object containing information about the React renders that are currently active on the page. The react version being used can be obtained at key = 1.
   */
  renderers: Map<1, undefined | { version: string }>;
  /**
   * @method getFiberRoots - get the Set of fiber roots that are currently mounted for the given rendererID. If not found, initalize a new empty Set at renderID key.
   * @param renderID -  a unique identifier for a specific instance of a React renderer. When a React application is first mounted, it will receive a rendererID. This rendererID will remain the same for the entire lifecycle of the application, even if the state is updated and the components are re-rendered/unmounted/added. However, if the application is unmounted and re-mounted again, it will receive a new rendererID.
   * @return A set of fiberRoot.
   */
  getFiberRoots: (rendererID: number) => Set<FiberRoot>;

  /**
   * @method onCommitFiberRoot - After the state of a component in a React Application is updated, the virtual DOM will be updated. When a render has been commited for a root, onCommitFiberRoot will be invoked to determine if the component is being mounted, updated, or unmounted. After that, this method will send update information to the React DevTools to update its UI to reflect the change.
   * @param rendererID -  a unique identifier for a specific instance of a React renderer
   * @param root - root of the rendered tree (a.k.a the root of the React Application)
   * @param priorityLevel
   * @return void
   */
  onCommitFiberRoot: (rendererID: number, root: FiberRoot, priorityLevel: any) => void;
}
