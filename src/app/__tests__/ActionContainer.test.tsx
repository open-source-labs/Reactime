/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-filename-extension */

import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import ActionContainer from '../containers/ActionContainer';
import { useStoreContext } from '../store';
import { emptySnapshots } from '../actions/actions';
import Action from '../components/Action';

configure({ adapter: new (Adapter as any)() });

const state = {
  tabs: {
    87: {
      snapshots: [1, 2, 3, 4],
      hierarchy: {
        index: 0,
        name: 1,
        branch: 0,
        stateSnapshot: {
          state: {},
          children: [{
            state: { test: 'test' },
            name: 'App',
            componentData: { actualDuration: 3.5 },
          }],
        },
        children: [{
          index: 1,
          name: 2,
          branch: 0,
          stateSnapshot: {
            state: {},
            children: [{
              state: { test: 'test' },
              name: 'App',
              componentData: { actualDuration: 3.5 },
            }],
          },
          children: [{
            index: 2,
            name: 3,
            branch: 0,
            stateSnapshot: {
              state: {},
              children: [{
                state: { test: 'test' },
                name: 'App',
                componentData: { actualDuration: 3.5 },
              }],
            },
            children: [{
              index: 3,
              name: 4,
              branch: 0,
              stateSnapshot: {
                state: {},
                children: [{
                  state: { test: 'test' },
                  name: 'App',
                  componentData: { actualDuration: 3.5 },
                }],
              },
              children: [],
            }],
          }],
        }],
      },
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

//actionView={true} must be passed in to <ActionContainer /> in beforeEach() to deal with new
//conditional rendering in ActionContainer that shows/hides time-travel functionality

beforeEach(() => {
  wrapper = shallow(<ActionContainer actionView={true}/>);
  useStoreContext.mockClear();
  dispatch.mockClear();
});

describe('testing the emptySnapshot button', () => {
  test('emptySnapshot button should dispatch action upon click', () => {
    wrapper.find('.empty-button').simulate('click');
    expect(dispatch.mock.calls.length).toBe(1);
  });
  test('emptying snapshots should send emptySnapshot action to dispatch', () => {
    wrapper.find('.empty-button').simulate('click');
    expect(dispatch.mock.calls[0][0]).toEqual(emptySnapshots());
  });
});

test('number of actions should reflect snapshots array', () => {
  expect(wrapper.find(Action).length).toBe(state.tabs[state.currentTab].snapshots.length);
});
