/* eslint-disable react/jsx-filename-extension */
import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import TravelContainer from '../containers/TravelContainer';
import { useStoreContext } from '../store';
import { moveBackward, moveForward } from '../actions/actions';

configure({ adapter: new Adapter() });

const state = {
  tabs: {
    87: {
      snapshots: [1, 2, 3, 4],
      sliderIndex: 2,
      playing: true,
    },
  },
  currentTab: 87,
};

const dispatch = jest.fn();
jest.mock('../store');
useStoreContext.mockImplementation(() => [state, dispatch]);

let wrapper;

beforeEach(() => {
  wrapper = shallow(<TravelContainer snapshotsLength={2} />);
  useStoreContext.mockClear();
  dispatch.mockClear();
});

describe('testing the backward-button', () => {
  test('backward-button should dispatch action upon click', () => {
    wrapper.find('.backward-button').simulate('click');
    expect(dispatch.mock.calls.length).toBe(1);
  });

  // backward-button invokes dispatch(moveBackward())
  // moveBackward is an actionCreator
  test('backward-button should send moveBackward action to dispatch', () => {
    wrapper.find('.backward-button').simulate('click');
    expect(dispatch.mock.calls[0][0]).toEqual(moveBackward());
  });
});

// test('testing the forward-button', () => {
//   wrapper.find('.forward-button').simulate('click');
//   expect(dispatch.mock.calls.length).toBe(1);
// });

// These are fake props to be used during dropdown tests

// const dropdownProps = {
//   selectedOption: {
//     value: 1,
//     label: 'label',
//   },
//   options: [0.5, 1, 2],
//   onChange: jest.fn(),
// };

// const options = [
//   { value: 2000, label: '0.5x' },
//   { value: 1000, label: '1.0x' },
//   { value: 500, label: '2.0x' },
// ];

// describe('testing the backward and forward buttons', () => {
//   test('if the backward button rewinds the playback', () => {
//     const wrapper = shallow(<TravelContainer {...props} />);

//     wrapper.find('.backward-button').simulate('click');

//     expect(props.moveBackward).toHaveBeenCalled();
//   });

//   test('if the forward button forwards the playback', () => {
//     const wrapper = shallow(<TravelContainer {...props} />);

//     wrapper.find('.forward-button').simulate('click');

//     expect(props.moveForward).toHaveBeenCalled();
//   });
// });

// describe('testing the play button', () => {
//   test('if the play button starts the playback', () => {
//     const wrapper = shallow(<TravelContainer {...props} />);

//     wrapper.find('.play-button').simulate('click');

//     expect(props.play).toHaveBeenCalled();
//   });

//   test("if playback is not running, the button should state 'Play'", () => {
//     const wrapper = shallow(<TravelContainer {...props} />);

//     wrapper.find('.play-button');

//     expect(wrapper.find('.play-button').text()).toBe('Play');
//   });

//   test("if playback is running, the button should state 'Pause'", () => {
//     props.playing = true;

//     const wrapper = shallow(<TravelContainer {...props} />);

//     wrapper.find('.play-button');

//     expect(wrapper.find('.play-button').text()).toBe('Pause');
//   });
// });

// describe('testing the playback speed', () => {
//   test('if the playback dropdown states 0.5x the speed should be 0.5x', () => {
//     const wrapper = shallow(<TravelContainer {...props} />);

//     wrapper.find('Dropdown').simulate('change', { value: ['val'] });
//     // wrapper.find('select').simulate('change', { value : 'hello'});
//     // console.log('val',wrapper.find('Dropdown').simulate('select', { value: ['val'] }));
//     // expect(wrapper.find('Dropdown').text()).toBe('0.5x')
//     expect(wrapper.find('select [selected]').val()).toEqual('key');
//   });
//   // test('if the playback dropdown states 1x the speed should be 1x', () => {

//   //   const wrapper = shallow(<TravelContainer { ...dropdownProps } />);

//   //   expect(wrapper.find('Dropdown').label).toBe('1.0x')

//   // });

//   // test('if the playback dropdown states 2x the speed should be 2x', () => {

//   //   const wrapper = shallow(<TravelContainer { ...dropdownProps } />);

//   //   wrapper.find('Dropdown').simulate('click');

//   //   expect(wrapper.find('Dropdown').label).toBe('2.0x')

//   // });
// });
