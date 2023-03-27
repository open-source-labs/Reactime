import linkFiberInitialization from '../routers/linkFiber';
import timeJumpInitialization from '../controllers/timeJump';
import componentActionsRecord from '../models/masterState';
import {
  root,
  rootPayload,
  classComponent,
  classPayload,
  updateClassPayload,
  functionalComponent,
  functionalPayload,
  mixComponents,
  mixPayload,
} from './ignore/stateComponents-testcases';
import { Snapshot, Status, FiberRoot } from '../types/backendTypes';
import Tree from '../models/tree';
import { DevTools } from '../types/linkFiberTypes';
import { JSDOM } from 'jsdom';
import path from 'path';
import fs from 'fs';

describe('linkFiber', () => {
  let snapshot: Snapshot;
  let mode: Status;
  let linkFiber: () => Promise<void>;
  let linkFiberDelayed: (resolve: any) => NodeJS.Timeout;
  let timeJump: (targetSnapshot: Tree) => Promise<void>;
  let fiberRoot: FiberRoot;
  let devTools: DevTools;
  let onCommitFiberRootDelayed: (resolve: any) => NodeJS.Timeout;
  const DELAY = 75; //ms
  const mockPostMessage = jest.fn();
  let dom: JSDOM;

  beforeAll(() => {
    // Set up a fake DOM environment with JSDOM
    const indexHTML = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    dom = new JSDOM(indexHTML, { url: 'http://localhost' });
    global.window = dom.window as unknown as Window & typeof globalThis;
    global.document = dom.window._document;
  });

  afterAll(() => {
    // Clean up the fake DOM environment
    dom.window.close();
  });

  beforeEach(() => {
    // Create snapshot and mode objects
    snapshot = {
      tree: new Tree('root', 'root'),
    };
    mode = {
      jumping: false,
    };
    // Initialize Fiber Root:
    fiberRoot = { current: root };

    // Initialize linkFiber
    linkFiber = linkFiberInitialization(snapshot, mode);
    // Since linkFiber invoke a throttle function that get delay for 70 ms, between each test, linkFiber need to be delayed for 75 ms to ensure no overlapping async calls.
    linkFiberDelayed = (resolve) => setTimeout(async () => resolve(await linkFiber()), DELAY);

    // Initialize timeJump
    timeJump = timeJumpInitialization(mode);

    // Set up mock postMessage function
    window.postMessage = mockPostMessage;

    // Set up mock React DevTools global hook
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      renderers: new Map<1, { version: string }>([[1, { version: '16' }]]),
      onCommitFiberRoot: (renderID = 0, root = fiberRoot, priortyLevel) => {},
      getFiberRoots: (renderID = 0) => new Set([fiberRoot]),
    };
    devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    // Since onCommitFiberRoot invoke a throttle function that get delay for 70 ms, between each test, onCommitFiberRoot need to be delayed for 75 ms to ensure no overlapping async calls.
    onCommitFiberRootDelayed = (resolve) =>
      setTimeout(
        async () => resolve(await devTools.onCommitFiberRoot(0, fiberRoot, 'high')),
        DELAY,
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clear the compoennt action record
    componentActionsRecord.clear();
    delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  });

  describe('link fiber initiliaztion', () => {
    it('link fiber should return a function', () => {
      expect(typeof linkFiber).toBe('function');
    });
    it('returned function should not throw an error', async () => {
      await expect(new Promise(linkFiberDelayed)).resolves.not.toThrowError();
    });
  });

  describe('React dev tools and react app check', () => {
    it('should not do anything if React Devtools is not installed', async () => {
      delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      await expect(new Promise(linkFiberDelayed)).resolves.not.toThrowError();
      expect(mockPostMessage).not.toHaveBeenCalled();
    });

    it('should post a message to front end that React DevTools is installed', async () => {
      await new Promise(linkFiberDelayed);
      expect(mockPostMessage).toHaveBeenCalled();
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'devToolsInstalled',
          payload: 'devToolsInstalled',
        },
        '*',
      );
    });

    it('should post a message & send snapshot to the front end if the target application is a React App', async () => {
      await new Promise(linkFiberDelayed);

      expect(mockPostMessage).toHaveBeenCalledTimes(3);
      // Post message for devTool Installed
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'devToolsInstalled',
          payload: 'devToolsInstalled',
        },
        '*',
      );

      // Post message for target is a react app
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'aReactApp',
          payload: 'aReactApp',
        },
        '*',
      );
      // Post message to send a snapshot of react app to front end
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'recordSnap',
          payload: rootPayload,
        },
        '*',
      );
    });

    it('should not do anything if the target application is not a React App', async () => {
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers = new Map();
      await new Promise(linkFiberDelayed);
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).not.toHaveBeenCalledTimes(3);
    });
  });

  describe('document visibility', () => {
    it('should initiate an event listener for visibility change', async () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      await new Promise(linkFiberDelayed);
      expect(addEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    });
    it('should not send snapshot when document is hidden', async () => {
      // Initialize linkFiber:
      await new Promise(linkFiberDelayed);
      expect(mockPostMessage).toHaveBeenCalledTimes(3);
      // Simulate document hidden
      Object.defineProperty(document, 'hidden', { value: true });
      const visibilityChangeEvent = new window.Event('visibilitychange');
      document.dispatchEvent(visibilityChangeEvent);
      // Reset count of mockPostMessage
      mockPostMessage.mockClear();
      await new Promise(onCommitFiberRootDelayed);
      // If document hidden, no message/snapshot will be posted
      expect(mockPostMessage).not.toHaveBeenCalled();
    });
  });

  describe('addOneMoreStep', () => {
    it('should monkey patch on onCommitFiberRoot', async () => {
      // Obtain the original onCommitFiberRoot
      const orginalOnCommitFiberRoot =
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot.toString();
      await new Promise(linkFiberDelayed);
      // Obtain the monkey patch (modified) onCommitFiberRoot
      const monkeyPatchOnCommitFiberRoot =
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot.toString();
      // The onCommitFiberRoot method should be been modifed
      expect(orginalOnCommitFiberRoot).not.toEqual(monkeyPatchOnCommitFiberRoot);
    });

    it('should send a snapshot when new fiberRoot is committed for a class component', async () => {
      // When first initialize linkFiber, should send snapShot of rootPayload
      await new Promise(linkFiberDelayed);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'recordSnap',
          payload: rootPayload,
        },
        '*',
      );
      mockPostMessage.mockClear();
      // After modified fiberRoot to classComponent, onCommitFiberRoot should send snapSot of classPayload
      fiberRoot = { current: classComponent };
      await new Promise(onCommitFiberRootDelayed);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'recordSnap',
          payload: classPayload,
        },
        '*',
      );
    });

    it('should send a snapshot when new fiberRoot is committed for a functional  component', async () => {
      // When first initialize linkFiber, should send snapShot of rootPayload
      await new Promise(linkFiberDelayed);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'recordSnap',
          payload: rootPayload,
        },
        '*',
      );
      mockPostMessage.mockClear();

      // After modified fiberRoot to functionalComponent, onCommitFiberRoot should send snapSot of functionalPayload
      fiberRoot = { current: functionalComponent };
      await new Promise(onCommitFiberRootDelayed);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'recordSnap',
          payload: functionalPayload,
        },
        '*',
      );
    });

    it('should send a snapshot when new fiberRoot is commited for mixture of components', async () => {
      // When first initialize linkFiber, should send snapShot of rootPayload
      await new Promise(linkFiberDelayed);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'recordSnap',
          payload: rootPayload,
        },
        '*',
      );
      mockPostMessage.mockClear();

      // After modified fiberRoot to mixComponents, onCommitFiberRoot should send snapSot of mixPayload
      fiberRoot = { current: mixComponents };
      await new Promise(onCommitFiberRootDelayed);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'recordSnap',
          payload: mixPayload,
        },
        '*',
      );
    });
  });

  describe('mode unit tests', () => {
    it('should not send snapshot if mode is jumping & not navigating', async () => {
      // When first initialize linkFiber, should not have the update class payload
      fiberRoot = { current: classComponent };
      await new Promise(linkFiberDelayed);
      mockPostMessage.mockClear();

      // Simulate jumping and navigating
      mode.jumping = true;
      await new Promise(onCommitFiberRootDelayed);
      // During jumping &/or navigating, should not post any message/snapshot to front end
      expect(mockPostMessage).not.toHaveBeenCalled();
    });

    it('should update react fiber tree based on the payload from frontend when mode is navigating', async () => {
      // When first initialize linkFiber, should not have the update class payload
      fiberRoot = { current: classComponent };
      await new Promise(linkFiberDelayed);
      expect(mockPostMessage).not.toHaveBeenCalledWith(
        {
          action: 'recordSnap',
          payload: updateClassPayload,
        },
        '*',
      );
      mockPostMessage.mockClear();

      // Simulate jumping and navigating
      mode.jumping = true;
      mode.navigating = () => timeJump(updateClassPayload);
      await new Promise(onCommitFiberRootDelayed);
      // During jumping &/or navigating, should not post any message/snapshot to front end
      expect(mockPostMessage).not.toHaveBeenCalled();

      // After navigate, react application should have updateClassPayload
      mode.jumping = false;
      await new Promise(onCommitFiberRootDelayed);
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          action: 'recordSnap',
          payload: updateClassPayload,
        },
        '*',
      );
    });
  });
});
