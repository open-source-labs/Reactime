import { shallow } from 'enzyme';

const index = require('../index');

jest.mock('../timeJump');


// describe('unit testing for index.js', () => {
  // test('index.js should be exporting the linkState and timeJump methods', () => {
  //   expect(typeof index.linkState).toBe('function');
  //   expect(typeof index.timeJump).toBe('function');
  // });

  // test('index.js should be listening to the window for the jumpToSnap message', (done) => {
  //   const calls = 10;
  //   let count = 0;
  //   global.addEventListener('message', ({ data: { action } }) => {
  //     if (action === 'jumpToSnap') {
  //       count += 1;
  //       // timeJump should be called everytime a message is received
  //       expect(index.timeJump.mock.calls.length).toBe(count);

  //       // test is done once all messages have been received
  //       if (count === calls) done();
  //     }
  //   });

  //   // iterate ${calls} amount of times
  //   [...Array(calls).keys()].forEach(() => global.postMessage({ action: 'jumpToSnap', payload: ['test'] }, '*'));
  // });

// }); 