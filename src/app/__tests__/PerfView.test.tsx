/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { configure, shallow } from 'enzyme';
// import { act } from 'react-dom/test-utils';
import Adapter from 'enzyme-adapter-react-16';

const PerfView = require('../components/PerfView').default;
// import { iterator } from 'core-js/fn/symbol';

// Unit test cases for PerfView
configure({ adapter: new (Adapter as any)() });

// Test props and basic rendering
describe('PerfView Component ', () => {
  const snapshot0 = {
    name: 'root',
    state: 'root',
    componentData: {},
    children:
    [
      {
        name: 'App',
        state: { num: 0 },
        componentData: { actualDuration: 10000 },
        children:
        [
          {
            name: 'DisplayPanel', state: 'stateless', componentData: { actualDuration: 5000 }, children: [],
          },
          {
            name: 'AltDisplay', state: 'stateless', componentData: { actualDuration: 4000 }, children: [],
          },
          {
            name: 'Button Panel',
            state: 'stateless',
            componentData: { actualDuration: 3000 },
            children:
            [
              {
                name: 'Button', state: { num: 0 }, componentData: { actualDuration: 2000 }, children: [],
              },
              {
                name: 'Button', state: { num: 0 }, componentData: { actualDuration: 1000 }, children: [],
              },
            ],
          },
          {
            name: 'MarketSContainer', state: 'stateless', componentData: { actualDuration: 500 }, children: [],
          },
          {
            name: 'MainSlider', state: 'stateless', componentData: { actualDuration: 100 }, children: [],
          },
        ],
      },
    ],
  };

  const snapshot1 = {
    name: 'root',
    state: 'root',
    componentData: {},
    children:
    [
      {
        name: 'App',
        state: { num: 1 },
        componentData: { actualDuration: 10 },
        children:
        [
          {
            name: 'DisplayPanel', state: 'stateless', componentData: { actualDuration: 50 }, children: [],
          },
          {
            name: 'AltDisplay', state: 'stateless', componentData: { actualDuration: 40 }, children: [],
          },
          {
            name: 'Button Panel',
            state: 'stateless',
            componentData: { actualDuration: 30 },
            children:
            [
              {
                name: 'Button', state: { num: 2 }, componentData: { actualDuration: 20 }, children: [],
              },
              {
                name: 'Button', state: { num: 3 }, componentData: { actualDuration: 10 }, children: [],
              },
            ],
          },
          {
            name: 'MarketSContainer', state: 'stateless', componentData: { actualDuration: 5 }, children: [],
          },
          {
            name: 'MainSlider', state: 'stateless', componentData: { actualDuration: 1 }, children: [],
          },
        ],
      },
    ],
  };

  let wrapper;
  const snapshots = [];
  snapshots.push(snapshot0);
  snapshots.push(snapshot1);

  const props = {
    viewIndex: -1,
    snapshots,
    width: 600,
    height: 600,
  };

  beforeEach(() => {
    wrapper = shallow(<PerfView viewIndex={props.viewIndex} snapshots={props.snapshots} width={props.width} height={props.height} />);
  });

  it('renders a single svg element', () => {
    expect(wrapper.find('svg')).toHaveLength(1);
  });
});
