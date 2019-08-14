const timeJumpRequire = require('../timeJump');

jest.mock('../timeJump');
const timeJump = jest.fn();
timeJumpRequire.mockReturnValue(timeJump);

const index = require('../index');

describe('unit testing for index.js', () => {
  test('index.js should be exporting a function', () => {
    expect(typeof index).toBe('function');
  });

  test('index.js should be calling timeJump for every jumpToSnap message', done => {
    const calls = 10;
    let count = 0;
    global.addEventListener('message', ({ data: { action } }) => {
      if (action === 'jumpToSnap') {
        count += 1;
        expect(timeJump.mock.calls.length).toBe(count);
        if (count === calls) done();
      }
    });
    for (let i = 0; i < calls; i += 1) {
      global.postMessage({ action: 'jumpToSnap', payload: ['test'] }, '*');
    }
  });
});
