import linkFiberInitialization from '../routers/linkFiber';
import { Snapshot, Status, FiberRoot } from '../types/backendTypes';
import Tree from '../models/tree';
import { DevTools } from '../types/linkFiberTypes';
import updateAndSendSnapShotTree from '../routers/snapShot';
import throttle from '../controllers/throttle';
import createTree from '../controllers/createTree/createTree';
import routes from '../models/routes';
import { JSDOM } from 'jsdom';

describe('linkFiber', () => {
  let snapShot: Snapshot;
  let mode: Status;
  let linkFiber;
  let fiberRoot: FiberRoot;
  const mockPostMessage = jest.fn();
  let dom: JSDOM;
  beforeAll(() => {
    // Set up a fake DOM environment with JSDOM
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' });
    global.window = dom.window;
    global.document = dom.window._document;
  });

  afterAll(() => {
    // Clean up the fake DOM environment
    dom.window.close();
  });
  beforeEach(() => {
    window.history.replaceState = jest.fn();
    window.history.pushState = jest.fn();
  });

  beforeEach(() => {
    // Create snapshot and mode objects
    snapShot = {
      tree: new Tree('root', 'root'),
    };
    mode = {
      jumping: false,
      paused: false,
      navigating: undefined,
    };

    fiberRoot = {
      current: {
        tag: 3,
        key: null,
        elementType: 'div',
        type: 'div',
        stateNode: {},
        child: null,
        sibling: null,
        index: 0,
        memoizedState: null,
        memoizedProps: {},
        dependencies: null,
        _debugHookTypes: [],
      },
    };

    linkFiber = linkFiberInitialization(snapShot, mode);
    // Set up mock postMessage function
    window.postMessage = mockPostMessage;

    // Set up mock React DevTools global hook
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      renderers: new Map<1, { version: string }>([[1, { version: '16' }]]),
      inject: jest.fn(),
      supportsFiber: true,
      onCommitFiberRoot: () => console.log('test'),
      onCommitFiberUnmount: jest.fn(),
      rendererInterfaces: {},
      getFiberRoots: jest.fn(() => [{ current: { tag: 3 } }]),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  });

  describe('link fiber initiliaztion', () => {
    it('link fiber should return a function', () => {
      expect(typeof linkFiber).toBe('function');
    });

    it('returned function should not throw an error', () => {
      expect(() => linkFiber()).not.toThrowError();
    });
  });

  describe('React dev tools and react app check', () => {
    it('should not do anything if React Devtools is not installed', () => {
      delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      expect(() => linkFiber()).not.toThrowError();
      expect(mockPostMessage).not.toHaveBeenCalled();
    });

    it('should post a message to front end that React DevTools is installed', () => {
      linkFiber();
      expect(mockPostMessage).toHaveBeenCalled();
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'devToolsInstalled',
          payload: 'devToolsInstalled',
        },
        '*',
      );
    });

    it('should post a message to the front end if the target application is a React App', () => {
      linkFiber();
      // the third call is from the onCommitFiberRoot() function to send snapshot to front end
      expect(mockPostMessage).toHaveBeenCalledTimes(3);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'devToolsInstalled',
          payload: 'devToolsInstalled',
        },
        '*',
      );
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'aReactApp',
          payload: 'aReactApp',
        },
        '*',
      );
    });

    it('should not do anything if the target application is not a React App', () => {
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers = new Map();
      linkFiber();
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).not.toHaveBeenCalledTimes(3);
    });
  });

  describe('document visibility', () => {
    it('should initiate an event listener for visibility change', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      linkFiber();
      expect(addEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    });
  });

  describe('addOneMoreStep', () => {
    it('should monkey patch on onCommitFiberRoot', () => {
      const mockOnCommitFiberRoot =
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot.toString();
      linkFiber();
      const onCommitFiberRoot = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot.toString();
      expect(mockOnCommitFiberRoot).not.toEqual(onCommitFiberRoot);
    });

    it('should send a snapshot when new fiberRoot is committed', () => {
      linkFiber();
      const payload = createTree(fiberRoot.current);
      payload.route = routes.addRoute(window.location.href);
      expect(mockPostMessage).toHaveBeenCalled();
      expect(mockPostMessage).toHaveBeenCalledTimes(3);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'recordSnap',
          payload,
        },
        '*',
      );
    });
  });

  describe('mode unit tests', () => {
    it('should update react fiber tree based on the payload from frontend when mode is navigating', () => {
      const newRoot: FiberRoot = {
        current: {
          tag: 1,
          key: null,
          elementType: 'div',
          type: 'div',
          stateNode: {
            state: { count: 2 },
            setState: function (newState) {
              this.state = newState;
            },
          },
          child: null,
          sibling: null,
          index: 0,
          memoizedState: null,
          memoizedProps: {},
          dependencies: null,
          _debugHookTypes: [],
        },
      };
      const payload = createTree(newRoot.current);
      payload.route = routes.addRoute(window.location.href);
    });
  });
});
