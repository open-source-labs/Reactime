const proxyquire = require('proxyquire').noCallThru();

const linkStateMock = (snapShot, mode) => ({ snapShot, mode });
const timeJumpMock = (snapShot, mode) => ({ snapShot, mode });

const index = proxyquire('../package/index.js', { './linkState': linkStateMock, './timeJump': timeJumpMock });

describe('unit testing for index.js', () => {
  test('index.js should be exporting the linkState and timeJump methods', () => {
    expect(typeof index.linkState).toBe('function');
    expect(typeof index.timeJump).toBe('function');
  });

  // test('index.js should be listening to the window for the jumpToSnap message', () => {

  // })
});
