import linkFiberInitialization from '../routers/linkFiber';
import { Snapshot, Status, FiberRoot } from '../types/backendTypes';
import Tree from '../models/tree';
import { DevTools } from '../types/linkFiberTypes';
import updateAndSendSnapShotTree from '../routers/snapShot';
import throttle from '../controllers/throttle';

describe('linkFiber', () => {
  let snapShot: Snapshot;
  let mode: Status;
  let linkFiber;
  let fiberRoot: FiberRoot;
  const mockPostMessage = jest.fn();

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
      onCommitFiberRoot: jest.fn((...args) => {
        console.log(...args);
      }),
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
    it('should send message to front end that React DevTools is installed', () => {
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

    it('should not do anything if React Devtools is not installed', () => {
      delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      expect(() => linkFiber()).not.toThrowError();
      expect(mockPostMessage).not.toHaveBeenCalled();
    });

    it('should send a message to the front end if the target application is a React App', () => {
      linkFiber();
      // the third call is from the onCommitFiberRoot() function
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

  describe('throttledUpdateSnapshot', () => {
    const mockUpdateAndSendSnapShotTree = jest.fn();

    beforeEach(() => {
      jest.useFakeTimers();
      mockUpdateAndSendSnapShotTree.mockClear();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('throttled function should be called with the correct arguments', () => {
      const throttledUpdateSnapshot = throttle(mockUpdateAndSendSnapShotTree, 1000);
      const onCoolDown = true;
      const isCallQueued = true;
      throttledUpdateSnapshot(onCoolDown, isCallQueued);

      expect(mockUpdateAndSendSnapShotTree).toHaveBeenCalledWith(onCoolDown, isCallQueued);
    });

    it('should call updateAndSendSnapShotTree only once per 100ms', () => {
      const throttledUpdateSnapshot = throttle(mockUpdateAndSendSnapShotTree, 100);
      throttledUpdateSnapshot();
      expect(mockUpdateAndSendSnapShotTree).toHaveBeenCalledTimes(1);
      throttledUpdateSnapshot();
      expect(mockUpdateAndSendSnapShotTree).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(100);
      expect(mockUpdateAndSendSnapShotTree).toHaveBeenCalledTimes(2);
    });

    it('should call throttle after visibility change', () => {
      const throttledUpdateSnapshot = throttle(mockUpdateAndSendSnapShotTree, 100);
      // Simulate visibility change
      const visibilityChangeEvent = new Event('visibilitychange');
      document.dispatchEvent(visibilityChangeEvent);
      expect(throttle).toHaveBeenCalled();
    });
  });

  describe('addOneMoreStep', () => {
    it('should add a new step to the current path in the snapshot tree', () => {});
  });

  describe('onCommitFiberRoot', () => {
    it('should call throttledUpdateSnapshot', () => {
      linkFiber();
      const onCommitFiberRoot = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot;
      expect(onCommitFiberRoot).toHaveBeenCalled();
    });
  });
});
