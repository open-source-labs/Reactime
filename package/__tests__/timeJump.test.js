const timeJumpExport = require('../timeJump');

describe('unit testing for timeJump.js', () => {
  let timeJump;
  let snapShot;
  let mode;
  let mockFuncs;
  const count = 3;

  beforeEach(() => {
    snapShot = [];
    mode = { jumping: false };
    mockFuncs = [];
    timeJump = timeJumpExport(snapShot, mode);

    const createSetStateAsync = i => state => new Promise((resolve) => {
      mockFuncs[i](state);
      resolve();
    });

    for (let i = 0; i < count; i += 1) {
      mockFuncs.push(jest.fn());
      snapShot.push({ setStateAsync: createSetStateAsync(i) });
    }
  });

  // test('calling the initial require should return a function', () => {
  //   expect(typeof timeJump).toBe('function');
  // });

  // test('timeJump should iterate through snapshot and call setStateAsync on each state', () => {
  //   const calls = 10;
  //   for (let i = 1; i <= calls; i += 1) {
  //     timeJump(Array(count).fill('test'));
  //     mockFuncs.forEach(mockFunc => expect(mockFunc.mock.calls.length).toBe(i));
  //   }
  // });

  // test('timeJump should pass the state from new snapshot to setStateAsync', () => {
  //   const newSnapShot = [];
  //   for (let i = 0; i < count; i += 1) {
  //     newSnapShot.push(`testState${i}`);
  //   }
  //   timeJump(newSnapShot);
  //   mockFuncs.forEach((mockFunc, i) => expect(mockFunc.mock.calls[0][0]).toBe(`testState${i}`));

  //   for (let i = 0; i < count; i += 1) {
  //     newSnapShot[i] = { testkey: `testval${i}` };
  //   }
  //   timeJump(newSnapShot);
  //   mockFuncs.forEach((mockFunc, i) => expect(mockFunc.mock.calls[1][0]).toEqual({ testkey: `testval${i}` }));
  // });
});
