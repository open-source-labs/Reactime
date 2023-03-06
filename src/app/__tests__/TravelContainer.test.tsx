/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-filename-extension */
import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import TravelContainer from '../containers/TravelContainer';
import MainSlider from '../components/MainSlider';
import Dropdown from '../components/Dropdown';
import { useStoreContext } from '../store';
import { moveBackward, moveForward } from '../actions/actions';

configure({ adapter: new (Adapter as any)() });

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
