/* eslint-disable react/jsx-filename-extension */
import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import TravelContainer from '../containers/TravelContainer';
import MainSlider from '../components/MainSlider';
import Dropdown from '../components/Dropdown';
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

describe('<TravelContainer /> rendering', () => {
  test('should render three buttons', () => {
    expect(wrapper.find('button')).toHaveLength(3);
  });
  test('should render one MainSlider', () => {
    expect(wrapper.find(MainSlider)).toHaveLength(1);
  });
  test('should render one Dropdown', () => {
    expect(wrapper.find(Dropdown)).toHaveLength(1);
  });
});

describe('testing the backward-button', () => {
  test('should dispatch action upon click', () => {
    wrapper.find('.backward-button').simulate('click');
    expect(dispatch.mock.calls.length).toBe(1);
  });

  test('should send moveBackward action to dispatch', () => {
    wrapper.find('.backward-button').simulate('click');
    expect(dispatch.mock.calls[0][0]).toEqual(moveBackward());
  });
});

describe('testing the forward-button', () => {
  test('should dispatch action upon click', () => {
    wrapper.find('.forward-button').simulate('click');
    expect(dispatch.mock.calls.length).toBe(1);
  });

  test('should send moveforward action to dispatch', () => {
    wrapper.find('.forward-button').simulate('click');
    expect(dispatch.mock.calls[0][0]).toEqual(moveForward());
  });
});

describe('testing the play-button', () => {
  test("should display 'pause' if playing is true", () => {
    state.tabs[87].playing = true;
    wrapper = shallow(<TravelContainer snapshotsLength={2} />);
    expect(wrapper.find('.play-button').text()).toBe('Pause');
  });

  test('should display play if playing is false', () => {
    state.tabs[87].playing = false;
    wrapper = shallow(<TravelContainer snapshotsLength={2} />);
    expect(wrapper.find('.play-button').text()).toBe('Play');
  });
});

// describe('testing the playback speed', () => {
//   test('if the playback dropdown states 0.5x the speed should be 0.5x', () => {
//     const wrapper = shallow(<TravelContainer {...props} />);
//     wrapper.find('Dropdown').simulate('change', { value: ['val'] });
//     wrapper.find('select').simulate('change', { value: 'hello' });
//     console.log('val', wrapper.find('Dropdown').simulate('select', { value: ['val'] }));
//     expect(wrapper.find('Dropdown').text()).toBe('0.5x');
//     expect(wrapper.find('select [selected]').val()).toEqual('key');
//   });
//   test('if the playback dropdown states 1x the speed should be 1x', () => {
//     const wrapper = shallow(<TravelContainer {...dropdownProps} />);

//     expect(wrapper.find('Dropdown').label).toBe('1.0x');
//   });
//   test('if the playback dropdown states 2x the speed should be 2x', () => {
//     const wrapper = shallow(<TravelContainer {...dropdownProps} />);
//     wrapper.find('Dropdown').simulate('click');
//     expect(wrapper.find('Dropdown').label).toBe('2.0x');
//   });
// });
