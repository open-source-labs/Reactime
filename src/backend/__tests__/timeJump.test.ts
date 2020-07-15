/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-classes-per-file */
import timeJumpRequire from '../timeJump';

class Component {
  mockfn: (state) => void

  state: Record<string, unknown>

  constructor(mockfn) {
    this.mockfn = mockfn;
  }

  setState(state, func = () => { }) {
    this.mockfn(state);
    func();
  }
}

class FiberNode {
  private state: Record<null, unknown>;

  children: FiberNode[];

  component: Component

  constructor(mockfn, state) {
    this.state = state;
    this.children = [];
    this.component = new Component(mockfn);
  }
}

describe('unit testing for timeJump.js', () => {
  let timeJump: (target) => void;
  let snapShot: Record<string, FiberNode>;
  let mode;
  let mockFuncs;

  beforeEach(() => {
    mode = { jumping: false };
    mockFuncs = [];
    for (let i = 0; i < 4; i += 1) mockFuncs.push(jest.fn());

    const tree: FiberNode = new FiberNode(mockFuncs[0], '*');
    tree.children = [
      new FiberNode(mockFuncs[1], '*'),
      new FiberNode(mockFuncs[2], '*'),
      new FiberNode(mockFuncs[3], '*'),
    ];

    snapShot = { tree };
    timeJump = timeJumpRequire(snapShot, mode);
  });

  test('calling the initial require should return a function', () => {
    expect(typeof timeJumpRequire).toBe('function');
  });

  describe('testing iteration through snapshot tree', () => {
    const states = ['root', 'firstChild', 'secondChild', 'thirdChild'];
    const target = new FiberNode(null, states[0]);
    target.children = [
      new FiberNode(null, states[1]),
      new FiberNode(null, states[2]),
      new FiberNode(null, states[3]),
    ];

    beforeEach((): void => {
      timeJump(target);
    });
    test('timeJump should call setState on each state in origin', () => {
      mockFuncs.forEach(mockFunc => expect(mockFunc.mock.calls.length).toBe(1));
    });

    test('timeJump should pass target state to origin setState', () => {
      mockFuncs.forEach((mockFunc, i) => expect(mockFunc.mock.calls[0][0]).toBe(states[i]));
    });
  });

  test('jumping mode should be set while timeJumping', () => {
    const logMode = jest.fn();
    logMode.mockImplementation(() => expect(mode.jumping).toBe(true));

    snapShot.tree = new FiberNode(logMode, null);
    const target = new FiberNode(null, 'test');
    timeJump(target);
    expect(logMode).toHaveBeenCalled();
  });
});
