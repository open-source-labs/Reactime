import timeJumpInitiation from '../controllers/timeJump';
import { Status } from '../types/backendTypes';
import Tree from '../models/tree';

describe('timeJumpInitiation', () => {
  const mockMode: Status = { jumping: false, paused: true };
  const mockTreeSnapshot: Tree = new Tree({});

  beforeEach(() => {
    // Reset mode before each test
    mockMode.jumping = false;
  });

  it('should return a function that updates the React Fiber Tree based on the target snapshot', async () => {
    // Call timeJumpInitiation and get the returned function
    const timeJump = timeJumpInitiation(mockMode);
    expect(typeof timeJump).toBe('function');

    // Call the returned function with the mock target snapshot
    await timeJump(mockTreeSnapshot);

    // Assert that the mode's jumping property is true
    expect(mockMode.jumping).toBe(true);
  });

  it('should reset the jumping mode to false when the mouse is over the browser', async () => {
    // Call timeJumpInitiation and get the returned function
    const timeJump = timeJumpInitiation(mockMode);
    expect(typeof timeJump).toBe('function');

    // Call the returned function with the mock target snapshot
    await timeJump(mockTreeSnapshot);

    // Simulate mouseover event
    window.dispatchEvent(new MouseEvent('mouseover'));

    // Assert that the mode's jumping property is false
    expect(mockMode.jumping).toBe(false);
  });
});

// import timeJumpRequire from '../timeJump';
// import componentActionsRecord from '../masterState';

// class Component {
//   mockfn: (state) => void;

//   state: Record<string, unknown>;

//   componentData: {};

//   constructor(mockfn) {
//     this.mockfn = mockfn;
//   }

//   setState(state, func = () => {}) {
//     this.mockfn(state);
//     func();
//   }
// }

// class FiberNode {
//   private state: Record<null, unknown>;

//   children: FiberNode[];

//   component: Component;

//   componentData: {
//     index?: number;
//   };

//   constructor(mockfn, state) {
//     this.state = state;
//     this.children = [];
//     this.component = new Component(mockfn);
//     this.componentData = { index: 0 };
//   }
// }

// describe('unit testing for timeJump.ts', () => {
//   let timeJump: (target) => void;
//   let snapShot: Record<string, FiberNode>;
//   let mode;
//   let mockFuncs;

//   beforeEach(() => {
//     const mockFunc = jest.fn();
//     mode = { jumping: false };
//     mockFuncs = [];
//     for (let i = 0; i < 4; i += 1) mockFuncs.push(mockFunc);

//     const tree: FiberNode = new FiberNode(mockFuncs[0], '*');
//     tree.children = [
//       new FiberNode(mockFuncs[1], '*'),
//       new FiberNode(mockFuncs[2], '*'),
//       new FiberNode(mockFuncs[3], '*'),
//     ];

//     snapShot = { tree };
//     timeJump = timeJumpRequire(mode);
//   });
//   test('calling the initial require should return a function', () => {
//     const funcDef = timeJumpRequire;
//     expect(typeof funcDef).toBe('function');
//   });

//   // xdescribe('testing iteration through snapshot tree', () => {
//   //   const states = ['root', 'firstChild', 'secondChild', 'thirdChild'];
//   //   const target = new FiberNode(null, states[0]);
//   //   target.children = [
//   //     new FiberNode(null, states[1]),
//   //     new FiberNode(null, states[2]),
//   //     new FiberNode(null, states[3]),
//   //   ];

//   //   target.componentData = {index: 0}

//   //   beforeEach((): void => {
//   //     timeJump(target);
//   //   });
//   //   test('timeJump should call setState on each state in origin', () => {
//   //     mockFuncs.forEach(mockFunc => expect(mockFunc.mock.calls.length).toBe(1));
//   //   });

//   //   test('timeJump should pass target state to origin setState', () => {
//   //     mockFuncs.forEach((mockFunc, i) => expect(mockFunc.mock.calls[0][0]).toBe(states[i]));
//   //   });
//   // });

//   test('jumping mode should be set while timeJumping', () => {
//     mode = { jumping: true };
//     const logMode = jest.fn();
//     logMode.mockImplementation(() => expect(mode.jumping).toBe(true));

//     snapShot.tree = new FiberNode(logMode, null);
//     const target = new FiberNode(null, 'test');
//     logMode(target);
//     expect(logMode).toHaveBeenCalled();
//   });
// });
