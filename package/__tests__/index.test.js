const index = require('../index');

jest.mock('../timeJump');

describe('unit testing for index.js', () => {
  test('index.js should be exporting the linkFiber, timeJump, getTree methods', () => {
    expect(typeof index.linkFiber).toBe('function');
    expect(typeof index.timeJump).toBe('function');
    expect(typeof index.getTree).toBe('function');
  });

  test('index.js should be listening to the window for the jumpToSnap message', (done) => {
    const calls = 10;
    let count = 0;
    global.addEventListener('message', ({ data: { action } }) => {
      switch (action) {
        case 'jumpToSnap':
          count += 1;
          expect(index.timeJump.mock.calls.length).toBe(count);
          if (count === calls) done();
          break;
        default:
          break;
      }
    });
    [...Array(calls).keys()].forEach(() => global.postMessage({ action: 'jumpToSnap', payload: ['test'] }, '*'));
  });
  test('setLock message should change the mode object to the given payload', (done) => {
    const mode = { paused: false };
    const action = 'setLock';
    const payloads = [true, false, true, false, true, false, false];
    let count = 0;
    const calls = payloads.length;
    global.addEventListener('message', ({ data: { action: actionReceived, payload } }) => {
      switch (actionReceived) {
        case 'setLock':
          mode.locked = payload;
          expect(mode.locked).toBe(payloads[count]);
          count += 1;
          if (calls === count) done();
          break;
        default:
          break;
      }
    });
    payloads.forEach(payload => global.postMessage({ action, payload }, '*'));
  });

  test('setPause message should change the mode object to the given payload', (done) => {
    const mode = { paused: false };
    const action = 'setPause';
    const payloads = [true, false, true, false, true, false, false];
    let count = 0;
    const calls = payloads.length;
    global.addEventListener('message', ({ data: { action: actionReceived, payload } }) => {
      switch (actionReceived) {
        case 'setPause':
          mode.locked = payload;
          expect(mode.locked).toBe(payloads[count]);
          count += 1;
          if (calls === count) done();
          break;
        default:
          break;
      }
    });
    payloads.forEach(payload => global.postMessage({ action, payload }, '*'));
  });
});
