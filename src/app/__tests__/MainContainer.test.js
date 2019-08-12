/* eslint-disable react/jsx-filename-extension */

import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import MainContainer from '../containers/MainContainer';
import { useStoreContext } from '../store';
import { 
  addNewSnapshots, initialConnect, setPort
} from '../actions/actions';
import HeadContainer from '../containers/HeadContainer';
import ActionContainer from '../containers/ActionContainer';
import StateContainer from '../containers/StateContainer';
import TravelContainer from '../containers/TravelContainer';
import ButtonsContainer from '../containers/ButtonsContainer';
import Action from '../components/Action';

configure({ adapter: new Adapter() });

const state = {
  tabs: {
    87: {
      snapshots: [1, 2, 3, 4],
      sliderIndex: 0,
      viewIndex: -1,
    },
  },
  currentTab: 87,
};

const dispatch = jest.fn();

jest.mock('../store');
useStoreContext.mockImplementation(() => [state, dispatch]);

let wrapper;

beforeEach(() => {
  wrapper = shallow(<MainContainer />);
  useStoreContext.mockClear();
  dispatch.mockClear();
});

describe('MainContainer rendering', () => {
  test('With no connection, shouldn not render any containers', () => {
    expect(wrapper.find(HeadContainer).length).toBe(0);
    expect(wrapper.find(ActionContainer).length).toBe(0);
    expect(wrapper.find(StateContainer).length).toBe(0);
    expect(wrapper.find(TravelContainer).length).toBe(0);
    expect(wrapper.find(ButtonsContainer).length).toBe(0);
  });
  test('With connection established, should render All containers', () => {
    expect(wrapper.find(HeadContainer).length).toBe(1);
    expect(wrapper.find(ActionContainer).length).toBe(1);
    expect(wrapper.find(StateContainer).length).toBe(1);
    expect(wrapper.find(TravelContainer).length).toBe(1);
    expect(wrapper.find(ButtonsContainer).length).toBe(1);
  });
});
